import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { login } = useAuth();

  const getToken = async () => {
    await axios.get("/authentication/token/new").then(({ data }) => {
      const { request_token: REQUEST_TOKEN } = data;

      const redirect_to = encodeURIComponent(window.location.href);

      router.push(
        `https://www.themoviedb.org/authenticate/${REQUEST_TOKEN}?redirect_to=${redirect_to}`,
      );
    });
  };

  useEffect(() => {
    if (
      searchParams.get("approved") === "true" &&
      searchParams.get("request_token")
    ) {
      login({ request_token: searchParams.get("request_token") });
    }

    if (searchParams.get("denied") === "true") {
      router.replace(pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, searchParams]);

  return (
    <button
      onClick={getToken}
      className={`btn aspect-square h-auto min-h-0 rounded-full border-transparent bg-opacity-0 p-1 hover:border-transparent hover:bg-opacity-[30%] hover:backdrop-blur-sm sm:m-0 xl:aspect-auto`}
    >
      <IonIcon icon={personCircleOutline} className={`!text-3xl`} />
      {/* <span className={`hidden xl:block`}>Login</span> */}
    </button>
  );
}
