import { defineType, defineField } from "sanity";

export default defineType({
  name: "vehicleStats",
  title: "Vehicle Stats",
  type: "object",
  fields: [
    defineField({
      name: "color",
      title: "Color",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "seats",
      title: "Number of Seats",
      type: "number",
    }),
    defineField({
      name: "acceleration",
      title: "0-100 Km/h",
      type: "string",
    }),
    defineField({
      name: "maxSpeed",
      title: "Max Speed",
      type: "string",
    }),
    defineField({
      name: "engine",
      title: "Engine",
      type: "string",
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
    }),
    defineField({
      name: "drive",
      title: "Drive",
      type: "string",
      options: {
        list: ["Front Wheel Drive", "Rear Wheel Drive", "All Wheel Drive"],
      },
    }),
    defineField({
      name: "fuel",
      title: "Fuel",
      type: "string",
    }),
  ],
});

export type VehicleStatsType = {
  color: string;
  year: number;
  seats: number;
  acceleration: string;
  maxSpeed: string;
  engine: string;
  transmission: string;
  drive: "Front Wheel Drive" | "Rear Wheel Drive" | "All Wheel Drive";
  fuel: string;
};
