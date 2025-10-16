import "./globals.css";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Stuff by Aymen",
  description:
    "New portfolio launching soon. Designer focused on strategy‑led brand systems. Open to project inquiries.",
  openGraph: {
    title: "Stuff by Aymen",
    description:
      "New portfolio launching soon. Designer focused on strategy‑led brand systems. Open to project inquiries.",
    url: "https://www.stuffbyaymen.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stuff by Aymen",
    description:
      "New portfolio launching soon. Designer focused on strategy‑led brand systems. Open to project inquiries.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}
