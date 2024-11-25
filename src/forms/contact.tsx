import { Turnstile } from "@marsidev/react-turnstile";
import { actions } from "astro:actions";
import { useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";

export const ContactForm = () => {
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { error } = await actions.enquire(formData);
        console.error({ error });
        if (!error) setSubmitted(true);
      }}
      className="relative w-full md:flex-none md:max-w-[28rem] flex flex-col ~gap-6/8 ~px-6/12 ~py-8/16 bg-surface rounded-3xl"
    >
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-title text-4xl">Get in Touch</h1>
        <p className="text-prose">
          Complete the form below and we will get back to you as soon as
          possible with an answer.
        </p>
      </header>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Full Name"
          className="bg-base px-4 py-3 rounded"
        />
        <input
          type="string"
          id="phone"
          name="phone"
          required
          placeholder="Phone Number"
          className="bg-base px-4 py-3 rounded"
        />
        <textarea
          className="bg-base px-4 py-3 rounded w-full min-h-[10rem]"
          id="description"
          name="message"
          required
          placeholder="What would you like to know?"
        ></textarea>
        <Turnstile
          siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}
          className="absolute inset-0 opacity-0 z-0 pointer-events-none"
          onSuccess={() => setVerified(true)}
        />
        <button
          type="submit"
          disabled={!verified}
          className="disabled:opacity-50 -mx-1 mt-2 flex items-center justify-center gap-6 bg-primary-800 px-10 py-5 text-white text-xl cursor-pointer rounded-3xl"
        >
          <span className="font-medium font-prose whitespace-nowrap">
            Send Message
          </span>
        </button>
      </div>
      {submitted && (
        <div className="absolute inset-0 w-full h-full flex gap-4 flex-col items-center justify-center bg-white">
          <HiOutlineEnvelope className="w-24 h-24 text-primary-800/20" />
          <div className="flex flex-col gap-3 items-center">
            <h3 className="font-display text-primary-800 text-3xl">
              Message Sent
            </h3>
            <p className="max-w-[30ch] text-neutral-500 text-center">
              Thank you for your enquiry. We will get back to you shortly.
            </p>
          </div>
        </div>
      )}
    </form>
  );
};
