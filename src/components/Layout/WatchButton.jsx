import { IonIcon } from "@ionic/react";
import { play } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function WatchButton({ mediaType, season, episode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const handleWatch = () => {
    current.set("streaming", "true");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <button
      onClick={handleWatch}
      className={`btn btn-primary max-w-fit rounded-full px-8`}
    >
      <IonIcon icon={play} />
      <span>Watch</span>
    </button>
  );
}
