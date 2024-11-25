import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "banner",
      title: "Banner",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
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
      of: [{ type: "block" }, { type: "image" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

import type { PortableTextBlock, ImageAsset } from "sanity";

export type CategoryType = {
  _id: string;
  _type: "category";
  _createdAt: string;
  banner: ImageAsset;
  icon: ImageAsset;
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
    groq`*[_type == "category" && (_id == $slug || slug.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<CategoryType>;

const list = (args?: { range?: string; references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "category"]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    {}
  ) as Promise<CategoryType[]>;

/* Exported functions */

export const Category = {
  doc,
  list,
};
