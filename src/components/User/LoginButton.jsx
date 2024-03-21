import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
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
      className={`btn rounded-full border-transparent bg-base-100 bg-opacity-[50%] text-white hover:border-transparent`}
    >
      <span>Login</span>
    </button>
  );
}
