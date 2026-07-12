import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UsernamePromptModal from "@/components/username-prompt-modal";
import DisclaimerModal from "@/components/disclaimer-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-zinc-950" />}>
        <Navbar />
      </Suspense>
      <DisclaimerModal />
      <UsernamePromptModal />
      <div className="grow">{children}</div>
      <Footer />
    </>
  );
}

