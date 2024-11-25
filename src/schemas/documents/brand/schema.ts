import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "brand",
  title: "Brands",
  type: "document",
  fields: [
    defineField({
      name: "banner",
      title: "Banner",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "about",
      title: "About",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

import type { PortableTextBlock, ImageAsset } from "sanity";

export type BrandType = {
  _id: string;
  _type: "brand";
  _createdAt: string;
  banner: ImageAsset;
  logo: ImageAsset;
  name: string;
  description: string;
  about: (PortableTextBlock | ImageAsset)[];
  slug: {
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
    groq`*[_type == "brand" && (_id == $slug || slug.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<BrandType>;

const list = (args?: { range?: string; references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "brand"]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    {}
  ) as Promise<BrandType[]>;

/* Exported functions */

export const Brand = {
  doc,
  list,
};
