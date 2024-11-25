import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { sanityClient } from "sanity:client";
import { verifyTurnstile } from "../../../../utils/turnstileVerify";
import { uuid } from "@sanity/uuid";
import type { CustomerType } from "../customer/schema";
import type { SanityDocument } from "sanity";

export const create = defineAction({
  accept: "form",
  input: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    messenger: z
      .union([z.literal("whatsapp"), z.literal("telegram"), z.literal("phone")])
      .optional(),
    name: z.string(),
    message: z.string().optional(),
    product: z.string().optional(),
    "cf-turnstile-response": z.string(),
  }),
  handler: async (data, Astro) => {
    try {
      // Get the turnstile token submitted with the form data
      const token = data["cf-turnstile-response"];
      const ip =
        Astro.request.headers.get("CF-Connecting-IP") ?? Astro.request.url;

      // This action is exposed to the public so check it passes captcha
      const turnstile = await verifyTurnstile(Astro)(token, ip);
      if (!turnstile.success) {
        console.error(turnstile);
        return { error: "Invalid turnstile response" };
      }

      // Check if there is already a submission from the same IP address
      const enquiryByIp = `*[_type == "enquiry" && ip == $ip]`;
      const existingEnquiry = await sanityClient.fetch(enquiryByIp, { ip });

      // If there is an existing enquiry, redirect the user
      if (existingEnquiry.length > 10 && !ip.match("localhost")) {
        return { error: "Too many enquiries from this IP address" };
      }

      // Check if the customer already exists
      const customerByEmailOrPhone = `*[_type == "customer" && ((defined(email) && email == $email) || (defined(phone) && phone == $phone))][0]`;
      let customer = (await sanityClient.fetch(customerByEmailOrPhone, {
        email: data.email ?? null,
        phone: data.phone ?? null,
      })) as CustomerType | undefined;

      // Either create or update the customer
      customer = (await sanityClient.createOrReplace({
        ...customer,
        _id: customer?._id ?? `customer.${uuid()}`,
        _type: "customer",
        name: data.name || customer?.name,
        phone: data.phone || customer?.phone,
        email: data.email || customer?.email,
        messenger: data.messenger || customer?.messenger,
      })) as SanityDocument & CustomerType;

      // Create the enquiry document
      const enquiry = await sanityClient.create({
        _id: `drafts.enquiry.${uuid()}`,
        _type: "enquiry",
        customer: {
          _type: "reference",
          _ref: customer._id,
        },
        product: {
          _type: "reference",
          _ref: data.product,
        },
        booking: {
          _type: "booking",
          start: data.start,
          end: data.end,
        },
        message: data.message,
        ip,
      });

      if (enquiry._id) {
        // Add the enquiry to the customer's list of enquiries

        // await sanityClient
        //   .patch(customer._id)
        //   .setIfMissing({ enquiries: [] })
        //   .insert("after", "enquiries[-1]", [
        //     { _ref: enquiry._id, _type: "reference" },
        //   ])
        //   .commit({ autoGenerateArrayKeys: true });

        // Set the submitted flag to true to render the success message
        return {
          success: true,
          message: "Your enquiry has been submitted",
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { error: true };
      }
    }
  },
});
