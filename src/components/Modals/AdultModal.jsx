"use client";

import { useRouter } from 'next-nprogress-bar';
import { useEffect } from "react";

export default function AdultModal({ adult }) {
  const router = useRouter();

  useEffect(() => {
    if (adult) {
      const modal = document.getElementById("adultModal");
      modal.showModal();
    }
  }, [adult]);

  const handleClose = () => {
    const modal = document.getElementById("adultModal");
    modal.close();
  };

  return (
    <dialog
      id="adultModal"
      className="modal backdrop:bg-black backdrop:bg-opacity-90 backdrop:backdrop-blur"
    >
      <div className="modal-box flex max-w-sm flex-col items-center">
        <h3 className="text-lg font-bold">Adult Content!</h3>
        <p className="py-4 text-center">
          This page contains adult content. You must be 18 years or older to
          access this page.
        </p>
        <div className="modal-action">
          <button
            onClick={() => router.back()}
            className="btn btn-error text-white"
          >
            Go back
          </button>

          <form method="dialog" className="">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={handleClose} className="btn">
              I am 18 years or older
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
