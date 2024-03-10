"use client";

import { useEffect, useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function ShareModal() {
  const [URL, setURL] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); // Reset copied state after 5 seconds
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  useEffect(() => {
    setURL(window.location.href);
  }, []);

  return (
    <dialog
      id="shareModal"
      className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
    >
      <div className="modal-box max-w-sm">
        <h2 className={`text-center`}>Share to</h2>

        <div className={`mb-4 mt-2 flex flex-wrap justify-center gap-2`}>
          <WhatsappShareButton url={URL}>
            <WhatsappIcon size={50} round={true} />
          </WhatsappShareButton>

          <FacebookShareButton url={URL}>
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>

          <TwitterShareButton url={URL}>
            <TwitterIcon size={50} round={true} />
          </TwitterShareButton>

          <LinkedinShareButton url={URL}>
            <LinkedinIcon size={50} round={true} />
          </LinkedinShareButton>

          <PinterestShareButton url={URL}>
            <PinterestIcon size={50} round={true} />
          </PinterestShareButton>

          <RedditShareButton url={URL}>
            <RedditIcon size={50} round={true} />
          </RedditShareButton>

          <TelegramShareButton url={URL}>
            <TelegramIcon size={50} round={true} />
          </TelegramShareButton>

          <EmailShareButton url={URL}>
            <EmailIcon size={50} round={true} />
          </EmailShareButton>
        </div>

        <div className="divider">or</div>

        <div
          className={`flex w-full flex-col items-center gap-2 rounded-full border border-white border-opacity-50 bg-black bg-opacity-50 p-2 text-sm sm:flex-row`}
        >
          <label htmlFor={`copyURL`}></label>
          <input
            id={`copyURL`}
            name={`copyURL`}
            type={`text`}
            value={URL}
            readOnly={true}
            className={`w-full bg-transparent`}
          />
          <button
            onClick={handleCopy}
            className={`btn btn-primary btn-sm rounded-full font-medium text-black`}
          >
            {copied ? `Copied!` : `Copy`}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
