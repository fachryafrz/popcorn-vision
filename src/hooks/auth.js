import useSWR from "swr";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Axios from "axios";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    "/account",
    () =>
      Axios.get(`/api/account`)
        .then(({ data }) => data)
        .catch((error) => {
          if (error.response.status !== 409) throw error;
        }),

    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  const login = async ({ request_token }) => {
    Axios.post(`/api/auth/login`, { request_token }).then(({ data }) => {
      mutate();

      current.delete("request_token");
      current.delete("approved");
      current.delete("denied");
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };

  const logout = async () => {
    if (!error) {
      await Axios.delete(`/api/auth/logout`).then(() => mutate(null));
    }

    if (pathname === "/profile") {
      router.replace("/");
    }
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error]);

  return {
    user,
    login,
    logout,
  };
};
