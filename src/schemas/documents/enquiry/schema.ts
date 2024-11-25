import { defineField, defineType } from "sanity";
import { sanityClient } from "sanity:client";
import { DateInput } from "./dateInput";
import type { CustomValidator, SanityDocument } from "@sanity/types";
import { HiOutlineEnvelope } from "react-icons/hi2";

export default defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "vehicle" }, { type: "service" }],
    }),
    defineField({
      name: "booking",
      title: "Booking",
      type: "object",
      components: { input: DateInput },
      // @ts-ignore
      validation: (Rule) => Rule.custom(overlapsAnotherEnquiry),
      fields: [
        defineField({
          name: "start",
          title: "Start",
          type: "datetime",
          options: {
            dateFormat: "dddd, Do MMMM",
            timeFormat: "h:mm a",
            timeStep: 15,
          },
        }),
        defineField({
          name: "end",
          title: "End",
          type: "datetime",
          options: {
            dateFormat: "dddd, Do MMMM",
            timeFormat: "h:mm a",
            timeStep: 15,
          },
        }),
      ],
    }),
    defineField({
      name: "message",
      title: "Notes",
      type: "text",
    }),
    defineField({
      name: "ip",
      title: "IP Address",
      type: "string",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      name: "customer.name",
      productName: "product.name",
      media: "product.image",
    },
    prepare(selection) {
      const { name, productName, media } = selection;
      return {
        title: name || "No name",
        subtitle: productName || "No product",
        media: media || HiOutlineEnvelope,
      };
    },
  },
});

export type EnquiryType = {
  _id: string;
  _type: "enquiry";
  customer: {
    _ref: string;
    _type: "reference";
  };
  product: {
    _ref: string;
    _type: "reference";
  };
  booking: {
    start: string;
    end: string;
  };
  start: string; // ISO date string
  end: string; // ISO date string
  duration: number;
  message: string;
  ip: string;
  status: "unanswered" | "negotiating" | "confirmed" | "conceded";
};

const overlapsAnotherEnquiry: CustomValidator<{
  start: string | undefined;
  end: string | undefined;
}> = async (value, context) => {
  const document = context.document as SanityDocument & EnquiryType;
  if (!document || !document.product) return true;

  // Ensure both start and end dates are set
  if (!(value?.start && value.end)) return "Required start and end dates";

  // Check if the booking overlaps with another enquiry
  const query = `*[_type == "enquiry" && product._ref == $product && ((booking.start <= $start && $start <= booking.end) || (booking.start <= $end && $end <= booking.end))]`;
  const params = {
    id: document._id,
    product: document.product._ref,
    start: new Date(value.start).toISOString(),
    end: new Date(value.end).toISOString(),
  };
  const existingEnquiries = (
    await sanityClient.fetch(query, params, {
      useCdn: false,
    })
  ).filter(
    (booking: SanityDocument) =>
      !booking._id.startsWith("drafts.") &&
      booking._id.replace("drafts.", "") !== document._id.replace("drafts.", "")
  );

  // If there are no overlapping enquiries then validation passes
  return existingEnquiries.length === 0
    ? true
    : "This date conflicts with another confirmed enquiry.";
};
