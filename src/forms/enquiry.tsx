import { Turnstile } from "@marsidev/react-turnstile";
import { actions } from "astro:actions";
import { useState } from "react";
import {
  HiArrowPath,
  HiOutlineEnvelope,
  HiOutlinePaperAirplane,
  HiOutlinePhone,
} from "react-icons/hi2";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

export const EnquiryForm = (props: {
  product: {
    _id: string;
  };
}) => {
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center aspect-[16/9] w-full">
        <HiOutlineEnvelope className="size-32 text-primary-200" />
        <p className="max-w-[30ch] text-prose/50 text-center">
          Thank you for your enquiry, we will get back to you as soon as
          possible
        </p>
      </div>
    );
  }

  return (
    <form
      className="relative flex flex-col max-w-[28rem] font-prose ~gap-12/16"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const { error } = await actions.enquire(formData);
        if (!error) setSubmitted(true);
        setSubmitting(false);
      }}
    >
      <div className="w-full flex flex-col ~gap-6/8">
        <input type="hidden" name="product" value={props?.product._id} />
        <label className="flex items-center">
          <span className="flex-1 text-prose/80 font-medium">Start Date</span>
          <input
            className="bg-base px-4 py-2 rounded text-prose"
            type="datetime-local"
            name="start"
            defaultValue={toLocalISOString(new Date(), 1)}
            min={toLocalISOString(new Date())}
            onChange={(e) => {
              const endInput = document.querySelector(
                'input[name="end"]'
              ) as HTMLInputElement;
              endInput.min = e.target.value;
            }}
          />
        </label>
        <label className="flex items-center">
          <span className="flex-1 text-prose/80 font-medium">End Date</span>
          <input
            className="bg-base px-4 py-2 rounded text-prose"
            type="datetime-local"
            name="end"
            min={toLocalISOString(new Date(), 1)}
            defaultValue={toLocalISOString(new Date(), 3)}
          />
        </label>
        <input
          type="string"
          name="name"
          required
          placeholder="Full Name"
          className="w-full bg-base px-6 py-4 rounded"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Phone Number"
          className="w-full bg-base px-6 py-4 rounded"
        />
        <label className="flex flex-col ~gap-4/6">
          <span className="flex-1 text-prose/80 font-medium">
            Preferred Contact Method
          </span>
          <div className="relative flex gap-4">
            {["WhatsApp", "Telegram", "Phone"].map((type) => (
              <div className="relative aspect-[1/1] w-full" key={type}>
                <input
                  type="radio"
                  name="messenger"
                  defaultChecked={type === "WhatsApp"}
                  value={type.toLowerCase()}
                  className="absolute opacity-0 w-full h-full inset-0 [&:checked+*]:border-line/50 [&:checked+*]:bg-base [&:checked+*]:focus:outline [&:checked+*]:outline-blue-600"
                />
                <div className="w-full h-full flex flex-col items-center justify-center border-2 rounded-lg gap-2.5 text-xs text-prose/80 font-prose">
                  {type === "WhatsApp" && (
                    <FaWhatsapp className="~size-6/10 fill-current text-[#25D366]" />
                  )}
                  {type === "Telegram" && (
                    <FaTelegram className="~size-6/10 fill-current text-[#049be5]" />
                  )}
                  {type === "Phone" && (
                    <HiOutlinePhone className="~size-6/10 fill-current text-red-500" />
                  )}
                  <span>{type}</span>
                </div>
              </div>
            ))}
          </div>
        </label>
        <Turnstile
          siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}
          className="absolute inset-0 opacity-0 z-0 pointer-events-none"
          onSuccess={() => setVerified(true)}
        />
        <button
          type="submit"
          disabled={!verified || submitting}
          className="disabled:opacity-50 -mx-1 mt-2 flex items-center justify-center gap-6 bg-primary-800 px-10 py-5 text-white text-xl cursor-pointer rounded-3xl"
        >
          <span className="font-medium font-prose whitespace-nowrap">
            Submit Enquiry
          </span>
          {submitting ? (
            <span className="font-medium font-prose whitespace-nowrap">
              <HiArrowPath className="w-6 h-6 animate-spin" />
            </span>
          ) : (
            <HiOutlinePaperAirplane className="w-6 h-6 -rotate-45" />
          )}
        </button>
      </div>
    </form>
  );
};

function toLocalISOString(date: Date, offset = 0) {
  const localDate = new Date(+date - date.getTimezoneOffset() * 60000);

  localDate.setDate(localDate.getDate() + offset);
  localDate.setHours(9);
  localDate.setMinutes(0);
  localDate.setSeconds(0);
  localDate.setMilliseconds(0);
  return localDate.toISOString().slice(0, -1);
}
