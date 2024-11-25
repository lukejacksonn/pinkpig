import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/schemas";

import { assist } from "@sanity/assist";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import {
  HiChatBubbleLeft,
  HiGift,
  HiHome,
  HiTicket,
  HiTruck,
  HiUserCircle,
} from "react-icons/hi2";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Business Manager")
    .items([
      S.listItem()
        .schemaType("company")
        .title("Company")
        .child(
          S.editor().id("company").schemaType("company").documentId("company")
        )
        .icon(HiHome),
      S.documentTypeListItem("promotion").title("Promotions").icon(HiGift),
      S.documentTypeListItem("enquiry")
        .title("Enquiries")
        .icon(HiChatBubbleLeft),
      S.documentTypeListItem("vehicle").title("Vehicles").icon(HiTruck),
      S.documentTypeListItem("service").title("Services").icon(HiTicket),
      S.documentTypeListItem("customer").title("Customers").icon(HiUserCircle),
      // ...S.documentTypeListItems().filter(
      //   (item) => !["company", "enquiry", ].includes(item.getId() ?? "")
      // ),
    ]);

export default defineConfig({
  name: "default",
  title: import.meta.env.PUBLIC_SANITY_STUDIO_TITLE,

  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({ structure }),
    visionTool(),
    unsplashImageAsset(),
    assist(),
  ],

  schema: {
    types: schemaTypes,
  },
});
