import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    defineField({
      name: "banner",
      title: "Banner",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
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
      name: "icon",
      title: "Icon",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
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
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "mission",
      title: "Mission",
      type: "text",
      validation: (Rule) => Rule.required().max(500),
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
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "telegram",
      title: "Telegram",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "announcements",
      title: "Announcements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "location",
      title: "Google Maps URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------ */
/* Type definitions for the schema */
/* ------------------------------------------------------ */

import type { PortableTextBlock, ImageAsset } from "sanity";

export type CompanyType = {
  _id: string;
  _type: "company";
  _createdAt: string;
  banner: ImageAsset;
  thumbnail: ImageAsset;
  logo: ImageAsset;
  icon: ImageAsset;
  avatar: ImageAsset;
  name: string;
  tagline: string;
  mission: string;
  description: string;
  about: (PortableTextBlock | ImageAsset)[];
  phone?: string;
  email?: string;
  telegram?: string;
  address?: string;
  announcements?: string[];
  location?: string;
  team: PersonType[];
} & {};

/* ------------------------------------------------------ */
/* Getter and setter functions for the type */
/* ------------------------------------------------------ */

import groq from "groq";
import { sanityClient } from "sanity:client";
import type { PersonType } from "../person/schema";

const reference = (include: string[]) =>
  include.map((name) => `${name} -> { ... }`).join(",\n");

const doc = (args?: { references?: string[] }) =>
  sanityClient.fetch(
    groq`*[_type == "company"][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`
  ) as Promise<CompanyType>;

/* Exported functions */

export const Company = {
  doc,
};
