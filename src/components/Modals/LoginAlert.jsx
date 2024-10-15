import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function LoginAlert() {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  useEffect(() => {
    document.getElementById("loginAlert").close();
  }, [pathname]);

  return (
    <Suspense>
      <dialog
        id="loginAlert"
        className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
      >
        <div className="modal-box flex max-w-sm flex-col items-center">
          <h3 className="text-center text-lg font-bold">Login Required!</h3>
          <p className="py-4 text-center">This action requires you to login.</p>
          <Link
            href={`/login?redirect_to=${pathname}${searchParams ? `?${searchParams}` : ``}`}
            prefetch={true}
            className={`btn btn-primary w-full rounded-full`}
          >
            Proceed to Login
          </Link>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </Suspense>
  );
}
