import { defineField, defineType } from "sanity";
import type { ImageAsset } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "messenger",
      title: "Messenger",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
    }),
    defineField({
      name: "enquiries",
      title: "Enquiries",
      type: "array",
      of: [{ type: "reference", to: [{ type: "enquiry" }] }],
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

export type CustomerType = {
  _id: string;
  _type: "customer";
  _createdAt: string;
  image: ImageAsset;
  name: string;
  email: string;
  phone: string;
  messenger?: string;
  notes?: string;
  enquiries?: Array<{
    _type: "reference";
    _ref: string;
  }>;
};
