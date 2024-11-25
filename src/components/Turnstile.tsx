import { Turnstile as TS } from "@marsidev/react-turnstile";

export const Turnstile = () => {
  return (
    <TS
      siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}
      className="absolute inset-0 opacity-0 z-0 pointer-events-none"
      onSuccess={() => {
        document.querySelector("[type=submit]")?.removeAttribute("disabled");
      }}
    />
  );
};
