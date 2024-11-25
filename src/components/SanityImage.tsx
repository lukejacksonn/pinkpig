import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import type { Image } from "@sanity/types";

export default (props: {
  className?: string;
  src: Image;
  alt?: string;
  priority?: boolean;
}) => {
  const { src, priority, ...rest } = props;
  const builder = imageUrlBuilder(sanityClient);
  let image = { url: () => "" };

  try {
    image = builder.image(src);
  } catch (error) {
    console.error(error);
  }

  return (
    <img
      src={image.url() + `?auto=format&w=1920&q=75`}
      loading={priority ? "eager" : "lazy"}
      alt={src.asset?._ref}
      {...rest}
    />
  );
};
