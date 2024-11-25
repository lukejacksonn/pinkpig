import { HiArrowRight } from "react-icons/hi2";
import SanityImage from "./SanityImage";
import type { PromotionType } from "../schemas/documents/promotions/schema";

interface Props {
  children?: any;
}

export const Banner = (props: Props) => {
  const { children } = props;

  return (
    <section className="w-screen relative ~px-3/8">
      <div className="flex overflow-x-scroll snap-x snap-always snap-mandatory [&>*]:snap-start [clip-path:polygon(0_5vh,5vh_0,100%_0,100%_100%,100%_100%,0%_100%)] rounded-3xl">
        {children}
      </div>
    </section>
  );
};

export const Promotion = (props: {
  promotion: PromotionType;
  priority?: boolean;
}) => {
  const { banner, title, description, link } = props.promotion;

  return (
    <a
      href={link.current}
      className="relative flex-none w-full relative h-[77svh] bg-gradient-to-tr from-primary-900 to-primary-200 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden mb-2">
        <SanityImage
          className="w-full h-full object-cover"
          src={banner}
          priority={props.priority}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 via-primary-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/30 to-transparent"></div>
      </div>
      <div className="relative w-full h-full flex items-end">
        <div className="~py-12/20 ~px-12/24 flex flex-col ~gap-6/8 -ml-4">
          <h2 className="text-balance ~-ml-2/4 ~text-4xl/7xl max-w-[15ch] font-display font-bold text-white drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] italic">
            <span className="leading-[1.38cap]">{title}</span>
          </h2>
          <p className="text-primary-300 font-prose ~text-xl/2xl max-w-[35ch]">
            {description}
          </p>
        </div>
      </div>
      <button className="text-prose font-prose absolute ~top-6/10 ~right-6/10 flex items-center ~gap-3/4 bg-white self-start ~pl-6/8 ~pr-4/5 ~py-2/3 rounded-full ~text-lg/xl">
        <span className="~text-sm/xl">Show All</span>
        <HiArrowRight className="size-[1.1em] text-prose" />
      </button>
    </a>
  );
};

export const Slide = {
  Promotion,
};
