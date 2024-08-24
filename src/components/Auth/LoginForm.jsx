"use client";

import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    await axios.get("/authentication/token/new").then(({ data }) => {
      const { request_token } = data;

      const credentials = {
        username,
        password,
        request_token,
      };

      axios
        .post("/authentication/token/validate_with_login", credentials)
        .then(({ data: { request_token } }) => {
          login({ request_token, setIsLoading });
        })
        .catch(({ response: { data } }) => {
          const { status_message } = data;

          setError(status_message);
          setIsLoading(false);
        });
    });
  };

  useEffect(() => {
    if (error) setPassword("");
  }, [error]);

  return (
    <div
      className={`flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-secondary bg-opacity-10 p-4`}
    >
      <form onSubmit={handleLogin} className={`w-full`}>
        <div className={`flex flex-col gap-2`}>
          {error && (
            <div
              role="alert"
              className="alert alert-error flex justify-center rounded-xl !p-2
            "
            >
              <span className={`text-center text-sm font-medium`}>{error}</span>
            </div>
          )}

          <label className="form-control w-full">
            <div className="label py-0 pb-1">
              <span className="label-text font-medium">Username</span>
            </div>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered input-md w-full rounded-full"
            />
          </label>

          <label className="form-control w-full">
            <div className="label py-0 pb-1">
              <span className="label-text font-medium">Password</span>
            </div>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered input-md w-full rounded-full"
            />
            <div className="label">
              <Link
                href={`https://www.themoviedb.org/reset-password`}
                target="_blank"
                className="label-text-alt italic text-primary-blue"
              >
                Forgot your password?
              </Link>
            </div>
          </label>

          <div
            className={`flex flex-col justify-between gap-2 xs:flex-row xs:items-end`}
          >
            <button
              type="submit"
              className={`btn btn-primary btn-sm order-2 mt-2 h-[40px] w-[100px] rounded-full px-8`}
            >
              {isLoading && <span className={`loading loading-spinner`}></span>}
              {!isLoading && <span>Login</span>}
            </button>

            <Link
              href={`https://www.themoviedb.org/signup`}
              target="_blank"
              className={`order-1 flex text-sm text-base-content underline hocus:no-underline`}
            >
              Doesn&apos;t have an account?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
