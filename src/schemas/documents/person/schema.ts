import { defineField, defineType } from "sanity";
import type { ImageAsset } from "sanity";
import groq from "groq";
import { sanityClient } from "sanity:client";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

export type PersonType = {
  _id: string;
  _type: "person";
  _createdAt: string;
  image: ImageAsset;
  name: string;
  slug: {
    _type: "slug";
    current: string;
  };
  role: string;
  description: string;
} & {};

/* ------------------------------------------------------ */
/* Getter and setter functions for the type */
/* ------------------------------------------------------ */

const reference = (include: string[]) =>
  include.map((name) => `${name} -> { ... }`).join(",\n");

const doc = (slug: string, args?: { references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "person" && (_id == $slug || slug.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<PersonType>;

const list = (args?: { range?: string; references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "person"]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    {}
  ) as Promise<PersonType[]>;

/* Exported functions */

export const Person = {
  doc,
  list,
};
