import footer from "../footer.json";
import { IonIcon } from "@ionic/react";
import * as Icons from "ionicons/icons";

import logo from "/popcorn.png";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const createdYear = 2023;

  const location = useLocation();
  const isTvPage = location.pathname.startsWith("/tv");

  return (
    <div className="px-4 lg:px-6 max-w-7xl mx-auto pt-[2rem] flex flex-col text-white">
      <div className="flex flex-col items-center justify-center text-center pb-8">
        <figure
          className={`w-[100px] flex flex-col font-bold text-4xl text-center items-center after:leading-tight after:content-["Popcorn_Vision"]`}
        >
          <img loading="lazy" src={logo} alt="Popcorn Vision" />
        </figure>
      </div>
      <div className="grid gap-8 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {footer.map((footer) => (
          <div key={footer.id}>
            <h2 className="font-bold text-xl mb-2 xl:mb-4">{footer.section}</h2>
            <ul>
              {footer.links &&
                footer.links.map((link) => (
                  <li
                    key={link.name}
                    className="font-light tracking-wider hover:font-normal transition-all max-w-fit"
                  >
                    <Link to={isTvPage ? `/tv` : `/`}>{link.name}</Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-bold text-xl mb-2 xl:mb-4">Get in Touch</h2>
          <p className="font-light tracking-wide mb-2 xl:mb-4">
            Stay connected with us to discover more stories about new movies and
            explore more with us
          </p>
          <div className="flex gap-2 flex-wrap">
            <a
              href="https://facebook.com/fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hover:bg-opacity-25 hover:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={Icons.logoFacebook} className="text-[1.25rem]" />
            </a>
            <a
              href="https://twitter.com/fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hover:bg-opacity-25 hover:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={Icons.logoTwitter} className="text-[1.25rem]" />
            </a>
            <a
              href="https://instagram.com/fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hover:bg-opacity-25 hover:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={Icons.logoInstagram} className="text-[1.25rem]" />
            </a>
            <a
              href="https://youtube.com/@fachryafrz"
              target="_blank"
              className="bg-base-gray bg-opacity-10 p-3 rounded-xl text-primary-blue grid place-items-center hover:bg-opacity-25 hover:scale-105 transition-all active:scale-100"
            >
              <IonIcon icon={Icons.logoYoutube} className="text-[1.25rem]" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-8 flex justify-center border-t border-base-gray border-opacity-25 text-center">
        <p>
          {import.meta.env.VITE_APP_NAME} &copy;{" "}
          {createdYear == currentYear
            ? createdYear
            : `${createdYear}-${currentYear}`}{" "}
          all rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
