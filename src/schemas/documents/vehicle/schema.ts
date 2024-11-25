import { defineField, defineType } from "sanity";

/* ------------------------------------------------------ */
/* Schema definition for the document type */
/* ------------------------------------------------------ */

export default defineType({
  name: "vehicle",
  title: "Vehicle",
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
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "vehicleStats",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "vehiclePricing",
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
import type { VehicleStatsType } from "../../objects/vehicleStats/schema";
import type { VehiclePricingType } from "../../objects/vehiclePricing/schema";
import type { BrandType } from "../brand/schema";
import type { CategoryType } from "../category/schema";

export type VehicleType = {
  _id: string;
  _type: "vehicle";
  _createdAt: string;
  name: string;
  description: string;
  stats: VehicleStatsType;
  pricing: VehiclePricingType;
  content: PortableTextBlock[];
  image: ImageAsset;
  images: ImageAsset[];
  brand: BrandType;
  category: CategoryType;
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
    groq`*[_type == "vehicle" && (_id == $slug || slug.current == $slug)][0] {
      ...,
      ${reference(args?.references ?? [])}
    }`,
    { slug }
  ) as Promise<VehicleType>;

const list = (args?: {
  range?: string;
  references?: string[];
  filter?: string;
}) =>
  sanityClient.fetch(
    groq`*[_type == "vehicle"${args?.filter ? ` && ${args?.filter}` : ""}]${args?.range ?? ""} {
      ...,
      ${reference(args?.references ?? [])}
    } | order(_createdAt desc) | order(pricing.perDay desc)`,
    {}
  ) as Promise<VehicleType[]>;

/* Exported functions */

export const Vehicle = {
  doc,
  list,
};
