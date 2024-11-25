import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import type { ActionAPIContext } from "astro:actions";

export const verifyTurnstile =
  (Astro: ActionAPIContext) =>
  async (
    token: string,
    ip: string
  ): Promise<TurnstileServerValidationResponse> => {
    const { env } = Astro.locals.runtime;
    // Create a new FormData object to send to the Turnstile API
    let body = new FormData();
    body.append(
      "secret",
      import.meta.env.TURNSTILE_API_KEY || env.TURNSTILE_API_KEY
    );
    body.append("response", token);
    body.append("remoteip", ip);

    // Send the request to the Turnstile API
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const turnstile = await fetch(url, { body, method: "POST" });
    const outcome = await turnstile.json();

    // Return the success status of the Turnstile API response
    return outcome;
  };
