import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginButton() {
  const pathname = usePathname();

  return (
    <Link
      href={`/login?redirect_to=${pathname}`}
      className={`btn btn-square btn-sm flex h-full w-full rounded-full border-transparent bg-opacity-0 p-0 hocus:border-transparent hocus:bg-opacity-[30%] hocus:backdrop-blur-sm`}
    >
      <IonIcon icon={personCircleOutline} className={`!text-4xl`} />
      {/* <span className={`hidden xl:block`}>Login</span> */}
    </Link>
  );
}
