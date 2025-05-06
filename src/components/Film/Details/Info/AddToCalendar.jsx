import { siteConfig } from "@/config/site";
import { handleOpenWindow } from "@/lib/openWindow";
import { IonIcon } from "@ionic/react";
import dayjs from "dayjs";
import ical from "ical-generator";
import { calendarOutline, logoGoogle, logoYahoo } from "ionicons/icons";

export default function AddToCalendar({ film }) {
  const googleCalendarUrl = (
    title,
    description,
    location,
    startDate,
    endDate,
  ) => {
    const base = "https://www.google.com/calendar/render";
    const format = (date) => date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details: description,
      location,
      dates: `${format(startDate)}/${format(endDate)}`,
    });
    return `${base}?${params.toString()}`;
  };

  const yahooCalendarUrl = (
    title,
    description,
    location,
    startDate,
    endDate,
  ) => {
    const base = "https://calendar.yahoo.com/";
    const format = (date) => date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    const params = new URLSearchParams({
      v: 60,
      title,
      desc: description,
      in_loc: location,
      st: format(startDate),
      dur: "allday",
    });
    return `${base}?${params.toString()}`;
  };

  const downloadICS = (title, description, location, startDate) => {
    const calendar = ical({ name: "Popcorn Vision" });

    calendar.createEvent({
      start: startDate.toDate(),
      end: dayjs(startDate).add(1, "day").toDate(), // All day: +1 hari
      summary: title,
      description,
      location,
      allDay: true,
    });

    const blob = new Blob([calendar.toString()], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const calendars = [
    {
      name: "Google",
      logo: logoGoogle,
      type: "url",
      url: googleCalendarUrl,
    },
    {
      name: "Yahoo",
      logo: logoYahoo,
      type: "url",
      url: yahooCalendarUrl,
    },
    {
      name: "iCal File (.ics)",
      logo: calendarOutline,
      type: "file",
      url: downloadICS,
    },
  ];

  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <label
        tabIndex={0}
        className="btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm"
      >
        <IonIcon
          icon={calendarOutline}
          style={{
            fontSize: 20,
          }}
        />
        <span>Add to Calendar</span>
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] w-40 bg-base-200 p-2 shadow"
      >
        {calendars.map((calendar) => (
          <li key={calendar.name}>
            <button
              onClick={() =>
                calendar.type !== "file"
                  ? handleOpenWindow(
                      calendar.url(
                        `🍿 ${film.title}`,
                        `${film.overview} \n\nvia ${siteConfig.name}: ${window.location.href}`,
                        "",
                        dayjs(film.release_date || film.first_air_date),
                        dayjs(
                          film.release_date ||
                            film.last_air_date ||
                            film.first_air_date,
                        ),
                      ),
                    )
                  : calendar.url(
                      film.title,
                      `${film.overview} \n\nvia ${siteConfig.name}: ${window.location.href}`,
                      "",
                      dayjs(film.release_date || film.first_air_date),
                      dayjs(
                        film.release_date ||
                          film.last_air_date ||
                          film.first_air_date,
                      ),
                    )
              }
            >
              <IonIcon icon={calendar.logo} />
              <span>{calendar.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
