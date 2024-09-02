import LoginForm from "@/components/Auth/LoginForm";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <section
      className={`flex h-[calc(100dvh-66px-1rem)] flex-col items-center gap-2 sm:px-4`}
    >
      <div className={`mt-20 flex flex-col items-center gap-2`}>
        <figure
          style={{
            background: `url(/popcorn.png)`,
            backgroundSize: `contain`,
          }}
          className={`aspect-square w-[130px]`}
        ></figure>

        <h1 className={`sr-only`}>Login</h1>
      </div>

      {/* Form Card */}
      <LoginForm />
    </section>
  );
}
