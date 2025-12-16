import { IonIcon } from "@ionic/react";
import { play } from "ionicons/icons";
import { useQueryState, parseAsBoolean } from "nuqs";

export default function WatchButton() {
  const [streaming, setStreaming] = useQueryState("streaming", parseAsBoolean);

  const handleWatch = () => {
    setStreaming(true);
  };

  return (
    <button
      onClick={handleWatch}
      className={`btn btn-primary max-w-fit rounded-full px-12`}
    >
      <IonIcon icon={play} />
      <span>Watch</span>
    </button>
  );
}
