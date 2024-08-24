import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginButton() {
  const pathname = usePathname();

  return (
    <Link
      href={`/login?redirect_to=${pathname}`}
      className={`btn aspect-square h-auto min-h-0 rounded-full border-transparent bg-opacity-0 p-1 hover:border-transparent hover:bg-opacity-[30%] hover:backdrop-blur-sm sm:m-0 xl:aspect-auto`}
    >
      <IonIcon icon={personCircleOutline} className={`!text-3xl`} />
      {/* <span className={`hidden xl:block`}>Login</span> */}
    </Link>
  );
}
