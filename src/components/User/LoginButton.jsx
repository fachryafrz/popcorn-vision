import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

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
