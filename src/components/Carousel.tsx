import type { SanityAsset } from "@sanity/image-url/lib/types/types";
import type { BrandType } from "../schemas/documents/brand/schema";
import type { CategoryType } from "../schemas/documents/category/schema";
import type { ServiceType } from "../schemas/documents/service/schema";
import type { VehicleType } from "../schemas/documents/vehicle/schema";

import SanityImage from "./SanityImage";

/* -----------------------------------*/
/* Container Components */
/* -----------------------------------*/

export const Carousel = (props: {
  id?: string;
  heading?: string;
  link?: {
    href: string;
    text: string;
  };
  children: any;
  gap?: "sm" | "lg";
  pad?: "sm" | "lg";
}) => {
  const { heading, link, children, gap, pad, id } = props;
  return (
    <section className="w-full flex flex-col items-center ~gap-5/12">
      {(heading || link) && (
        <div className="w-full flex ~gap-6/10 items-center">
          {heading && <h3 className="font-display ~text-lg/2xl">{heading}</h3>}
          <hr className="flex-1 border-line" />
          {link && (
            <a className="~text-sm/base text-prose/80" href={link.href}>
              {link.text}
            </a>
          )}
        </div>
      )}
      <ul
        id={id}
        className={`w-screen flex overflow-x-scroll ${
          {
            sm: "~px-4/8",
            md: "~px-6/12",
            lg: "~px-8/16",
          }[pad ?? "md"]
        } ${
          {
            sm: "~gap-3/7",
            md: "~gap-6/10",
            lg: "~gap-8/14",
          }[gap ?? "md"]
        }`}
      >
        {children}
      </ul>
    </section>
  );
};

export const Grid = (props: {
  heading: string;
  link: {
    href: string;
    text: string;
  };
  children: any;
  gap?: "sm" | "lg";
  pad?: "sm" | "lg";
}) => {
  const { heading, link, children, gap, pad } = props;
  return (
    <section className="w-full flex flex-col items-center ~gap-5/12">
      <div className="w-full flex ~gap-6/10 items-center">
        <h3 className="font-display ~text-base/3xl capitalize">{heading}</h3>
        <hr className="flex-1 border-line" />
        <a className="~text-sm/base text-prose/80" href={link.href}>
          {link.text}
        </a>
      </div>
      <ul
        className={`w-screen overflow-x-scroll grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
          {
            sm: "~px-4/8",
            md: "~px-6/12",
            lg: "~px-8/16",
          }[pad ?? "md"]
        } ${
          {
            sm: "~gap-3/7",
            md: "~gap-6/10",
            lg: "~gap-8/14",
          }[gap ?? "md"]
        }`}
      >
        {children}
      </ul>
    </section>
  );
};

/* -----------------------------------*/
/* Card Components */
/* -----------------------------------*/

const Brand = (props: { brand: BrandType }) => {
  const { brand } = props;
  return (
    <a
      className="relative flex items-center relative bg-surface ~p-4/8 aspect-[1/1] rounded-3xl overflow-hidden"
      href={`/vehicles?brand=${brand.slug?.current}`}
    >
      <SanityImage
        className="w-full h-full object-contain"
        src={brand.logo}
        alt={brand.name}
      />
    </a>
  );
};

const Category = (props: { category: CategoryType }) => {
  const { category } = props;
  return (
    <a
      className="block relative bg-surface ~p-4/8 rounded-3xl overflow-hidden"
      href={`/vehicles?category=${category.slug?.current}`}
    >
      <SanityImage
        className="w-full aspect-[4/2] object-contain"
        src={category.icon}
      />
      <h2 className="mt-2 font-prose font-medium text-prose ~text-base/lg text-center">
        {category.name}
      </h2>
    </a>
  );
};

const Service = (props: { service: ServiceType }) => {
  const { service } = props;
  return (
    <a
      href={`/${service.slug?.current ?? service._id}`}
      className="block bg-surface rounded-3xl"
    >
      <div className="relative rounded-t-3xl overflow-hidden">
        <SanityImage
          className="w-full aspect-[16/9] object-cover"
          src={service.image}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 via-primary-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent"></div>
      </div>
      <div className="py-6 px-6 flex flex-col gap-2">
        <h2 className="font-prose font-bold text-title text-xl">
          {service.name}
        </h2>
        <p className="font-prose text-prose font-light text-sm line-clamp-2">
          {service.description}
        </p>
      </div>
    </a>
  );
};

const Vehicle = (props: { vehicle: VehicleType }) => {
  const { vehicle } = props;
  return (
    <div
      key={props.vehicle._id}
      className="w-full relative bg-surface aspect-[9/12] rounded-3xl overflow-hidden"
      style={{ containerType: "inline-size" }}
    >
      <div className="absolute inset-0">
        <SanityImage
          className="w-full h-full object-cover"
          src={vehicle.image}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 via-primary-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent"></div>
      </div>
      <a
        className="relative w-full h-full flex items-end"
        href={`/vehicles/${vehicle.slug?.current ?? vehicle._id}`}
      >
        <div className="p-[12cqw] flex flex-col gap-[3cqw]">
          <h2 className="font-display font-bold text-white text-[8cqw] leading-[1.2em]">
            {vehicle.name}
          </h2>
          <p className="font-prose text-white/80 text-[5cqw]">
            AED {vehicle.pricing?.perDay} / $
            {Math.round(vehicle.pricing?.perDay / 3.6)}
          </p>
        </div>
      </a>
    </div>
  );
};

/* -----------------------------------*/
/* Pill Component */
/* -----------------------------------*/

export const Pill = (props: {
  icon: SanityAsset;
  text: string;
  href: string;
  active?: boolean;
}) => {
  const { icon, text, href, active } = props;

  // let url = new URL(props.url);

  // let params = url.searchParams.get(item._type) ?? "";
  // let others = params
  //   .split(",")
  //   .filter((slug) => slug && slug !== item.slug?.current);
  // let isSelected = params
  //   ? params.split(",").includes(item.slug?.current)
  //   : false;

  // if (isSelected) {
  //   if (others.length === 0) {
  //     url.searchParams.delete(item._type);
  //   } else {
  //     url.searchParams.set(item._type, others.join(","));
  //   }
  // } else {
  //   url.searchParams.set(
  //     item._type,
  //     others.concat(item.slug?.current).join(",")
  //   );
  // }

  // const href = decodeURIComponent(url.toString());

  return (
    <li
      className="flex-none border rounded-full ~text-sm/xl data-[active=true]:border-line bg-white"
      data-active={active}
    >
      <a
        href={href}
        className="relative flex items-center gap-[1em] px-[1em] pr-[1.5rem] py-[1ex]"
      >
        <SanityImage className="w-8 h-8 object-contain" src={icon} />
        <span className="flex-1 font-prose whitespace-nowrap">{text}</span>
      </a>
    </li>
  );
};

export const List = {
  Carousel,
  Grid,
};

export const Item = {
  Brand,
  Category,
  Service,
  Vehicle,
};
