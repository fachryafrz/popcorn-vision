import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  return (
    <Link
      href={
        pathname !== `/login`
          ? `/login?redirect_to=${pathname}${searchParams ? `?${searchParams}` : ``}`
          : `/login`
      }
       
      className={`btn btn-square btn-sm flex h-full w-full rounded-full border-transparent bg-opacity-0 p-0 hocus:border-transparent hocus:bg-opacity-[30%] hocus:backdrop-blur-sm`}
    >
      <IonIcon
        icon={personCircleOutline}
        style={{
          fontSize: 36,
        }}
      />
      {/* <span className={`hidden xl:block`}>Login</span> */}
    </Link>
  );
}
