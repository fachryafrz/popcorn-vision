import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  return (
    <Link
      id="login"
      href={
        pathname !== `/login`
          ? `/login?redirect_to=${pathname}${searchParams ? `?${searchParams}` : ``}`
          : `/login`
      }
      prefetch={false}
      className={`btn btn-circle flex border-transparent bg-opacity-0 p-1 hocus:border-transparent hocus:bg-opacity-[30%] hocus:backdrop-blur-sm`}
    >
      <IonIcon
        icon={personCircleOutline}
        style={{ fontSize: 36 }}
        className={`h-[36px] w-[36px]`}
      />
      {/* <span className={`hidden xl:block`}>Login</span> */}
    </Link>
  );
}
