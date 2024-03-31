import Reveal from "@/components/Layout/Reveal";
import { isPlural } from "@/lib/isPlural";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function Countdown({
  isTvPage,
  filmReleaseDate,
  nextEps,
  film,
}) {
  const dateStr = !isTvPage ? filmReleaseDate : film.first_air_date;
  const date = new Date(dateStr);

  const upcomingDate = !isTvPage ? filmReleaseDate : nextEps?.air_date;

  const timeLeft = new Date(new Date(upcomingDate) - new Date());

  const duration = moment.duration(timeLeft);
  const yearsLeft = duration.years();
  const monthsLeft = duration.months();
  const daysLeft = duration.days();
  const hoursLeft = duration.hours();
  const minutesLeft = duration.minutes();
  const secondsLeft = duration.seconds();

  const [countdown, setCountdown] = useState({
    years: yearsLeft,
    months: monthsLeft,
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  });

  const calculateCountdown = () => {
    return {
      years: yearsLeft,
      months: monthsLeft,
      days: daysLeft,
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className={`flex flex-wrap justify-start gap-2 text-center`}>
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
