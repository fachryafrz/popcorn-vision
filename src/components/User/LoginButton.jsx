import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth();

  const getToken = async () => {
    await axios.get("/authentication/token/new").then(({ data }) => {
      const { request_token: REQUEST_TOKEN } = data;
      console.log(REQUEST_TOKEN);
      router.push(
        `https://www.themoviedb.org/authenticate/${REQUEST_TOKEN}?redirect_to=${window.location.href}`,
      );
    });
  };

  useEffect(() => {
    if (searchParams.get("request_token")) {
      login({ request_token: searchParams.get("request_token") });
    }
  }, [searchParams]);

  return (
    <button
      onClick={getToken}
      className={`btn aspect-square h-auto min-h-0 w-8 rounded-full border-transparent bg-base-100 bg-opacity-[50%] p-0 text-white hover:border-transparent sm:w-12 xl:aspect-auto xl:h-full xl:w-auto xl:px-4`}
    >
      <IonIcon icon={personCircleOutline} className={`!text-xl`} />
      <span className={`hidden xl:block`}>Login</span>
    </button>
  );
}
