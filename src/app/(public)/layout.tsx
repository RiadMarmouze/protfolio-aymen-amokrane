// app/(site)/layout.tsx
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "var(--nav-h, 64px)" }}>{children}</div>
      <Footer />
    </>
  );
}
