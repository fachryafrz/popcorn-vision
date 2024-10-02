import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginAlert() {
  const pathname = usePathname();

  return (
    <dialog
      id="loginAlert"
      className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
    >
      <div className="modal-box flex max-w-sm flex-col items-center">
        <h3 className="text-center text-lg font-bold">Login Required!</h3>
        <p className="py-4 text-center">This action requires you to login.</p>
        <Link
          href={`/login?redirect_to=${pathname}`}
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
  );
}
