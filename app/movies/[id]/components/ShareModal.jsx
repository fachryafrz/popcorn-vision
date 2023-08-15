"use client";

import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function ShareModal({ isActive, setIsActive }) {
  const appURL = `https://popcorn.vision`;
  const pathname = usePathname();
  const fullURL = `${appURL}${pathname}`;

  const [copied, setCopied] = useState(false);
  const modal = useRef();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  useEffect(() => {
    const handleActive = (e) => {
      if (!modal.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener(`mousedown`, handleActive);
  }, []);

  return (
    <div
      className={`${
        isActive ? `block` : `hidden`
      } fixed inset-0 w-screen h-screen z-50 bg-black bg-opacity-75 grid place-items-center p-8`}
    >
      <div
        id="modal"
        ref={modal}
        className={`p-4 rounded-2xl max-w-sm bg-base-dark-gray bg-opacity-50 backdrop-blur-xl w-full`}
      >
        <h2>Share</h2>

        <div className={`mt-2 flex items-center gap-2 mb-4`}>
          <WhatsappShareButton
            url={fullURL}
            title={`Check out this amazing film!`}
          >
            <WhatsappIcon size={50} round={true} />
          </WhatsappShareButton>

          <FacebookShareButton
            url={fullURL}
            title={`Check out this amazing film!`}
          >
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>

          <TwitterShareButton
            url={fullURL}
            title={`Check out this amazing film!`}
          >
            <TwitterIcon size={50} round={true} />
          </TwitterShareButton>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-black text-sm border border-white border-opacity-50`}
        >
          <input
            type="text"
            value={fullURL}
            readOnly
            className={`bg-transparent w-full`}
          />
          <button
            onClick={handleCopy}
            className={`py-2 px-4 flex w-full sm:max-w-fit justify-center rounded-full bg-primary-blue text-black font-medium`}
          >
            {copied ? `Copied!` : `Copy`}
          </button>
        </div>
      </div>
    </div>
  );
}
