import Reveal from "@/components/Layout/Reveal";
import { isPlural } from "@/lib/isPlural";
import moment from "moment";
import { usePathname } from "next/navigation";
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
        <Reveal>
          <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
            <span className="countdown font-mono text-4xl sm:text-5xl">
              <span style={{ "--value": countdown.years }}></span>
            </span>
            {isPlural({ text: "year", number: countdown.years })}
          </div>
        </Reveal>
      )}
      {countdown.months > 0 && (
        <Reveal delay={0.1}>
          <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
            <span className="countdown font-mono text-4xl sm:text-5xl">
              <span style={{ "--value": countdown.months }}></span>
            </span>
            {isPlural({ text: "month", number: countdown.months })}
          </div>
        </Reveal>
      )}
      {countdown.days > 0 && (
        <Reveal delay={0.2}>
          <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
            <span className="countdown font-mono text-4xl sm:text-5xl">
              <span style={{ "--value": countdown.days }}></span>
            </span>
            {isPlural({ text: "day", number: countdown.days })}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.3}>
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.hours }}></span>
          </span>
          {isPlural({ text: "hour", number: countdown.hours })}
        </div>
      </Reveal>
      <Reveal delay={0.4}>
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.minutes }}></span>
          </span>
          min
        </div>
      </Reveal>
      <Reveal delay={0.5}>
        <div className="flex flex-col rounded-xl bg-secondary bg-opacity-10 p-2 text-neutral-content backdrop-blur">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span style={{ "--value": countdown.seconds }}></span>
          </span>
          sec
        </div>
      </Reveal>
    </div>
  );
}
