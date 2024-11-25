import { useEffect, useState } from "react";
import { useDocumentOperation, useFormValue } from "sanity";
import { sanityClient } from "sanity:client";
import type { EnquiryType } from "./schema";
import { HiChevronLeft } from "react-icons/hi2";

export const DateInput = () => {
  // The current values of the document
  const _id = useFormValue(["_id"]) as string;
  const _type = useFormValue(["_type"]) as string;
  const start = useFormValue(["booking", "start"]) as string | undefined;
  const end = useFormValue(["booking", "end"]) as string | undefined;
  const product = useFormValue(["product"]) as { _ref: string };

  // The current month
  const [currentMonth, setCurrentMonth] = useState(
    new Date(start ?? new Date())
  );

  // The patch function for the document
  const { patch } = useDocumentOperation(_id.replace("drafts.", ""), _type);

  // Dates that are already booked
  const [bookings, setBookings] = useState<
    {
      start: Date;
      end: Date;
    }[]
  >([]);

  useEffect(() => {
    // If there is no product or _id, reset the bookings
    if (!product?._ref || !_id) {
      setBookings([]);
      return;
    }
    // Fetch all confirmed bookings for the product
    sanityClient
      .fetch(
        '*[_type == "enquiry" && product._ref == $product && defined(booking)] { _id, booking }',
        { product: product._ref, none: Math.random() }
      )
      .then((confirmed) => {
        const disabledDates = confirmed
          .filter(
            (enquiry: EnquiryType) =>
              !enquiry._id.startsWith("drafts.") &&
              enquiry._id !== _id.replace("drafts.", "")
          )
          .map((enquiry: EnquiryType) => ({
            start: new Date(enquiry.booking.start),
            end: new Date(enquiry.booking.end),
          }));
        setBookings(disabledDates);
      });
  }, [product, _id]);

  const handleDateClick = (date: Date) => {
    if (start && end) {
      patch.execute([{ unset: ["booking.start", "booking.end"] }]);
      return;
    }
    if (!start) {
      const start =
        hoursInADay(date).find(
          (d) => !bookings.find((x) => x.start <= d && x.end >= d)
        ) ?? date;
      patch.execute([{ set: { ["booking.start"]: start.toISOString() } }]);
      return;
    }
    if (!end) {
      const end =
        hoursInADay(date)
          .reverse()
          .find((d) => !bookings.find((x) => x.start <= d && x.end >= d)) ??
        date;
      patch.execute([{ set: { ["booking.end"]: end.toISOString() } }]);
      return;
    }
  };

  const reset = () => {
    patch.execute([{ unset: ["booking.start", "booking.end"] }]);
    setCurrentMonth(new Date());
  };

  const changeMonth = (by: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + by)
    );
  };

  return (
    <div className="flex flex-col gap-6 border rounded border-white/10 p-6">
      <div className="flex justify-between">
        <CurrentMonth month={currentMonth} />
        <div className="flex gap-2">
          <ResetDateSelection start={start} end={end} reset={reset} />
          <ChangeMonthButton change={changeMonth} by={-1} />
          <ChangeMonthButton change={changeMonth} by={1} />
        </div>
      </div>
      <hr className="opacity-10" />
      <DayHeadings />
      <div className="grid grid-cols-7 grid-rows-4 gap-2 w-full">
        {getDaysInMonth(currentMonth).map((date) => (
          <DayButton
            key={date.toISOString()}
            start={start}
            end={end}
            handleDateClick={handleDateClick}
            bookings={bookings}
            date={date}
          />
        ))}
      </div>
      <hr className="opacity-10" />
      <div className="flex flex-col gap-4">
        <HourSelect
          type="start"
          date={start}
          bookings={bookings}
          patch={patch}
        />
        <HourSelect type="end" date={end} bookings={bookings} patch={patch} />
      </div>
    </div>
  );
};

const getDaysInMonth = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add previous month's days
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = new Date(year, month, -i);
    days.unshift(date);
  }

  // Add current month's days
  for (let date = 1; date <= lastDay.getDate(); date++) {
    days.push(new Date(year, month, date));
  }

  return days;
};

const hoursInADay = (date: Date | string) =>
  Array.from({ length: 24 }, (_, index) => {
    const d = new Date(date);
    d.setHours(index, 0, 0, 0);
    return d;
  });

const sameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const toTime = (d: Date) =>
  d.getHours() === 0
    ? "12:00 am"
    : d.getHours() === 12
      ? "12:00 pm"
      : d.getHours() > 12
        ? `${d.getHours() - 12}:00 pm`
        : `${d.getHours()}:00 am`;

const CurrentMonth = (props: { month: Date }) => {
  return (
    <span className="font-medium">
      {new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(props.month)}
    </span>
  );
};

const ChangeMonthButton = (props: {
  change: (x: number) => void;
  by: number;
}) => {
  return (
    <button
      className="p-2 rounded-full bg-gray-800 text-white"
      onClick={() => props.change(props.by)}
    >
      <HiChevronLeft className={props.by < 0 ? "" : "rotate-180"} />
    </button>
  );
};

function ResetDateSelection(props: {
  start: string | undefined;
  end: string | undefined;
  reset: () => void;
}) {
  const { start, end, reset } = props;
  return (
    (start || end) && (
      <button
        className="px-3 self-stretch rounded-full bg-gray-800 text-white"
        onClick={reset}
      >
        Reset
      </button>
    )
  );
}

const DayHeadings = () => {
  return (
    <div className="grid grid-cols-7 grid-rows-1 gap-2 w-full">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <span key={day} className="text-center font-medium opacity-80">
          {day}
        </span>
      ))}
    </div>
  );
};

const HourSelect = (props: {
  type: "start" | "end";
  date: Date | string | undefined;
  bookings: { start: Date; end: Date }[];
  patch: ReturnType<typeof useDocumentOperation>["patch"];
}) => {
  const { date, bookings, patch, type } = props;
  return (
    <div className="flex items-center gap-8">
      <span className="w-20 flex-none whitespace-nowrap capitalize">
        {type} Time
      </span>
      <select
        value={date ? new Date(date).toISOString() : undefined}
        className="w-full bg-gray-800 rounded-lg p-2 border border-r-8 border-gray-800"
        onChange={(e) => {
          patch.execute([{ set: { ["booking." + type]: e.target.value } }]);
        }}
      >
        {date &&
          hoursInADay(date).map((d) => {
            const booked = bookings.find((x) => x.start <= d && x.end >= d);
            return (
              !booked && (
                <option
                  key={d.toISOString()}
                  disabled={!!booked}
                  value={d.toISOString()}
                  className={`rounded-lg disabled:opacity-50 data-[selected='true']:bg-gray-700 flex-none w-16 h-10 flex items-center justify-center flex-1 ${booked ? "bg-red-500/30" : "bg-gray-800"}`}
                  data-selected={
                    date && new Date(date).getHours() === d.getHours()
                  }
                >
                  {toTime(d)}
                </option>
              )
            );
          })}
      </select>
    </div>
  );
};

const DayButton = (props: {
  start: string | undefined;
  end: string | undefined;
  handleDateClick: (date: Date) => void;
  bookings: { start: Date; end: Date }[];
  date: Date;
}) => {
  const { start, end, handleDateClick, bookings, date } = props;

  const hours = hoursInADay(date).map((d) => {
    const booked = bookings.find((x) => x.start <= d && x.end >= d);
    return {
      hour: d.getHours(),
      booked: booked,
      between: start && end && d > new Date(start) && d < new Date(end),
    };
  });
  const day = {
    isSelectionStart: Boolean(start && sameDay(new Date(start), date)),
    isSelectionEnd: Boolean(end && sameDay(new Date(end), date)),
    isSelectionBetween: Boolean(
      start &&
        end &&
        date > new Date(start) &&
        !sameDay(new Date(start), date) &&
        date < new Date(end) &&
        !sameDay(new Date(end), date)
    ),
    isBeforeStart: Boolean(
      start && date < new Date(start) && !sameDay(date, new Date(start))
    ),
    isAfterEnd: Boolean(
      end && date > new Date(end) && !sameDay(date, new Date(end))
    ),
    isFullyBooked: hours.every((x) => x.booked),
    isAfterAnotherStart: Boolean(
      start &&
        bookings.find((x) => x.start >= new Date(start) && x.start <= date)
    ),
    isInThePast: date < new Date(),
  };
  return (
    <button
      key={date.toISOString()}
      onClick={() => handleDateClick(date)}
      className="overflow-hidden disabled:opacity-30 rounded relative flex flex-none w-full aspect-[1/1] items-center justify-center data-[start='true']:rounded-l-2xl data-[end='true']:rounded-r-2xl data-[between='true']:rounded-none"
      disabled={
        !(day.isSelectionStart || day.isSelectionEnd) &&
        (day.isInThePast ||
          day.isBeforeStart ||
          day.isAfterEnd ||
          day.isAfterAnotherStart ||
          day.isFullyBooked)
      }
      data-start={day.isSelectionStart}
      data-end={day.isSelectionEnd}
      data-between={day.isSelectionBetween}
    >
      <div className="absolute w-full h-full inset-0 flex">
        {hours.map(({ hour, booked, between }) => (
          <div
            key={hour}
            className={`flex-1 ${between ? "bg-gray-700" : booked ? "bg-red-500/30" : "bg-gray-800/50"}`}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <span className="relative text-2xl font-medium">{date.getDate()}</span>
      </div>
    </button>
  );
};
