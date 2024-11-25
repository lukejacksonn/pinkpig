import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "promotion",
  title: "Promotions",
  type: "document",
  fields: [
    defineField({
      name: "subject",
      title: "Subject",
      type: "reference",
      to: [
        { type: "vehicle" },
        { type: "brand" },
        { type: "category" },
        { type: "service" },
      ],
    }),
    defineField({
      name: "banner",
      title: "Banner",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

import type { ImageAsset } from "sanity";

export type PromotionType = {
  _id: string;
  _type: "promotion";
  _createdAt: string;
  subject: {
    _type: "reference";
    _ref: string;
  };
  banner: ImageAsset;
  title: string;
  description: string;
  link: {
    _type: "slug";
    current: string;
  };
} & {};

/* ------------------------------------------------------ */
/* Getter and setter functions for the type */
/* ------------------------------------------------------ */

import groq from "groq";
import { sanityClient } from "sanity:client";

const reference = (include: string[]) =>
  include.map((name) => `${name} -> { ... }`).join(",\n");

const doc = (slug: string, args?: { references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "promotion" && (_id == $slug || link.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<PromotionType>;

const list = (args?: { range?: string; references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "promotion"]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    {}
  ) as Promise<PromotionType[]>;

/* Exported functions */

export const Promotion = {
  doc,
  list,
};
