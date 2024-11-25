import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
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
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
        },
      ],
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

import type { PortableTextBlock, ImageAsset } from "sanity";

export type ServiceType = {
  _id: string;
  _type: "service";
  _createdAt: string;
  name: string;
  description: string;
  content: PortableTextBlock[];
  image: ImageAsset;
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
    groq`*[_type == "service" && (_id == $slug || slug.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<ServiceType>;

const list = (args?: { range?: string; references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "service"]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    {}
  ) as Promise<ServiceType[]>;

/* Exported functions */

export const Service = {
  doc,
  list,
};
