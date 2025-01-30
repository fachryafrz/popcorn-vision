import moment from "moment";
import { usePathname } from "next/navigation";
import pluralize from "pluralize";
import { useCallback, useEffect, useState } from "react";

export default function Countdown({ movieReleaseDate, tvReleaseDate }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const upcomingDate = !isTvPage ? movieReleaseDate : tvReleaseDate;

  const calculateTimeLeft = useCallback(() => {
    const date = new Date(upcomingDate);
    const timeLeft = new Date(date - new Date());
    const duration = moment.duration(timeLeft);
    return {
      years: duration.years(),
      months: duration.months(),
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }, [upcomingDate]);

  const [countdown, setCountdown] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div
      aria-hidden
      className={`flex flex-wrap justify-start gap-2 text-center`}
    >
      {countdown.years > 0 && (
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.years }}></span>
          </span>
          {pluralize("year", countdown.years)}
        </div>
      )}
      {countdown.months > 0 && (
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.months }}></span>
          </span>
          {pluralize("month", countdown.months)}
        </div>
      )}
      {countdown.days > 0 && (
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.days }}></span>
          </span>
          {pluralize("day", countdown.days)}
        </div>
      )}
      <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
        <span className="countdown font-mono text-4xl sm:text-5xl">
          <span style={{ "--value": countdown.hours }}></span>
        </span>
        {pluralize("hour", countdown.hours)}
      </div>
      <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
        <span className="countdown font-mono text-4xl sm:text-5xl">
          <span style={{ "--value": countdown.minutes }}></span>
        </span>
        min
      </div>
      <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
        <span className="countdown font-mono text-4xl sm:text-5xl">
          <span style={{ "--value": countdown.seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
}
