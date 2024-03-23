import useSWR from "swr";
import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Axios from "axios";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const cookies = useCookies();

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR(
    "/account",
    () =>
      Axios.get(`/api/account`, {
        params: {
          session_id: cookies.get("tmdb.session_id"),
        },
      })
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
    Axios.post(`/api/login`, { request_token }).then(({ data }) => {
      mutate();
      router.replace(pathname);
    });
  };

  const logout = async () => {
    if (!error) {
      await Axios.delete(`/api/logout`, {
        data: {
          session_id: cookies.get("tmdb.session_id"),
        },
      }).then(() => mutate(null));
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
    isLoading,
    login,
    logout,
  };
};
