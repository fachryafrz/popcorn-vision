"use client";

import { useImageSlider } from "@/zustand/imageSlider";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { useSearchParams } from "next/navigation";

export default function ImageSlider() {
  const searchParams = useSearchParams();

  const { open, setOpen, images, selectedIndex } = useImageSlider();

  const handleClose = () => {
    setOpen(false);

    if (searchParams.get("person")) {
      document.getElementById("personModal").showModal();
    }
  };

  return (
    <Lightbox
      open={open}
      close={handleClose}
      slides={images}
      index={selectedIndex}
      plugins={[Captions, Counter, Fullscreen, Slideshow, Thumbnails, Zoom]}
      captions={{ descriptionTextAlign: "center" }}
      carousel={{ finite: true }}
    />
  );
}
