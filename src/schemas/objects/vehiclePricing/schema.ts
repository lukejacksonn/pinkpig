import { defineType, defineField } from "sanity";

export default defineType({
  name: "vehiclePricing",
  title: "Vehicle Pricing",
  type: "object",
  fields: [
    defineField({
      name: "perDay",
      title: "Price Per Day",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "perWeek",
      title: "Price Per Week",
      type: "number",
    }),
    defineField({
      name: "perMonth",
      title: "Price Per Month",
      type: "number",
    }),
  ],
});

export type VehiclePricingType = {
  perDay: number;
  perWeek: number;
  perMonth: number;
};
