import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UsernamePromptModal from "@/components/username-prompt-modal";
import DisclaimerModal from "@/components/disclaimer-modal";
import { BottomNav } from "@/components/navbar/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <DisclaimerModal />
      <UsernamePromptModal />
      <div className="grow pb-16 lg:pb-0">{children}</div>
      <Suspense>
        <BottomNav />
      </Suspense>
      <Footer />
    </>
  );
}

