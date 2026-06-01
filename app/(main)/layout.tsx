import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UsernamePromptModal from "@/components/username-prompt-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <UsernamePromptModal />
      <div className="grow">{children}</div>
      <Footer />
    </>
  );
}
