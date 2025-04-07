"use client";

import { siteConfig } from "@/config/site";
import { DISCLAIMER_READ, POPCORN } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Disclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const disclaimerRead = localStorage.getItem(DISCLAIMER_READ);
    if (disclaimerRead) {
      setShowDisclaimer(false);
      return;
    }

    setShowDisclaimer(true);
  }, []);

  useEffect(() => {
    if (!showDisclaimer) return;

    // Show the modal
    document.getElementById("disclaimer").showModal();

    // Close the modal if the user scrolls to the bottom
    const handleScroll = () => {
      if (!contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsScrolledToBottom(true);
      }
    };

    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentEl) {
        contentEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, [showDisclaimer]);

  return (
    <>
      {showDisclaimer && (
        <dialog
          id="disclaimer"
          className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
        >
          <div className="modal-box flex max-w-xl flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col items-center">
              <figure
                style={{
                  background: `url(${POPCORN})`,
                  backgroundSize: `contain`,
                }}
                className={`aspect-square w-[100px]`}
              ></figure>

              <h2 className="!mt-0 text-center text-3xl font-bold">
                Disclaimer
              </h2>
            </div>

            {/* Contents */}
            <div
              ref={contentRef}
              onScroll={() => setIsScrolledToBottom(false)}
              className="prose -mx-4 max-h-[300px] max-w-none overflow-y-auto px-4 outline-none prose-p:!text-pretty prose-strong:!text-white"
            >
              <ReactMarkdown>{DISCLAIMER_TEXT}</ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="modal-action mt-0">
              <button
                disabled={!isScrolledToBottom}
                className="btn btn-primary w-full rounded-full disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  localStorage.setItem(DISCLAIMER_READ, "true");
                  document.getElementById("disclaimer")?.close();

                  setTimeout(() => {
                    setShowDisclaimer(false);
                  }, 100);
                }}
              >
                I Agree
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

const DISCLAIMER_TEXT = `
${siteConfig.name} is an open-source project created for educational and personal learning purposes. It functions as a film discovery platform and does not claim ownership of any media content displayed.

All data including titles, posters, and metadata is retrieved from third-party public API (The Movie Database). Streaming links or embeds shown on this site are sourced from external providers. **${siteConfig.name} does not host, store, or upload any content.**

Any media streamed via this platform originates from third-party sources whose availability and legality are beyond our control. If you believe that any content infringes your copyright, **please contact the original hosting provider**, as ${siteConfig.name} does not have ownership or control over the hosted files.

Use of this site implies that you understand and accept these terms. ${siteConfig.name} is non-commercial and should only be used for personal exploration and learning. We do not encourage or promote any form of copyright violation.
`;
