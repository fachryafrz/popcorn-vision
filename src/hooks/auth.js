import useSWR from "swr";
import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useCookies } from "next-client-cookies";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const cookies = useCookies();

  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    "/account",
    () =>
      axios
        .get(`/account`, {
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

  const login = async ({ setErrors, setStatus, request_token }) => {
    // setErrors([]);
    // setStatus(null);

    axios
      .post(`/authentication/session/new`, { request_token })
      .then(({ data }) => {
        // localStorage.setItem("session_id", data.session_id);
        cookies.set("tmdb.session_id", data.session_id);
        mutate();
        router.replace(pathname);
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        // setErrors(error.response.data.errors);
      });
  };

  const logout = async () => {
    if (!error) {
      await axios
        .delete(`/authentication/session`, {
          params: {
            session_id: cookies.get("tmdb.session_id"),
          },
        })
        .then(() => {
          cookies.remove("tmdb.session_id"), mutate(null);
        });
    }

    // window.location.pathname = pathname;
    // router.refresh();
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
