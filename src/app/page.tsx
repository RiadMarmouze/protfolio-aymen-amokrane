import Logo from "@/components/Logo";
import PageIntroTransition from "@/components/PageIntroTransition";
import SocialLinks from "@/components/SocialLinks";
import Starfield from "@/components/Starfield";
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


const INTRO_CONFIG = {
  bgColor: "#000",
  rectColor: "#fff",
  rectSize: { w: 300, h: 100 },
  borderRadius: 0,
  imageUrl: "/images/common/logo.jpg",
  imageFit: "cover" as const,
  imagePosition: "50% 45%",
  durationMs: 2100,
  bgFadeStartAtMs: 1800,
  bgFadeDurationMs: 500,
  overlayHideAtMs: 1200,
  shakeIntensity: 4,
  sweep: {
    enabled: true,
    color: "rgba(0,0,0,0.5)",
    angleDeg: 135,
    widthPct: 18,
  },
  glow: {
    enabled: true,
    color: "#ffffff",
    blurPx: 5,
    spreadPx: 2,
    opacity: 0.3,
  },
  disableTint: true,
  tintOpacity: 0.35,
};

export default function Page() {
  return (
    <div className="fixed bg-black text-white inset-0 select-none">
      {/* Background (no pointer events) */}
      <div className="absolute inset-0 -z-10">
        <Starfield density={0.0006} />
      </div>

      {/* Foreground with intro overlay */}
      <PageIntroTransition config={INTRO_CONFIG}>
        <main className="h-[100dvh] w-[100dvw] grid place-items-center overflow-hidden px-6 py-10 md:px-12">
          <div className="flex flex-col items-center gap-8 md:gap-10 text-center max-w-[90vw] md:max-w-[600px]">
            <Logo />
            <div className="space-y-3 md:space-y-4">
              <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-white/60">
                Under construction
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Stuff by Aymen
              </h1>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                Design. Systems. Identity.
              </p>
            </div>
            <div className="mt-4 md:mt-6">
              <SocialLinks />
            </div>
          </div>
        </main>
      </PageIntroTransition>
    </div>
  );
}
