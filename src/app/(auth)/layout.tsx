import Image from "next/image";
import elementMobile from "@/assets/element.png";
import elementDesktop from "@/assets/element2.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black px-4 py-10">
      {/* Mobile glow: anchored to the bottom */}
      <Image
        src={elementMobile}
        alt=""
        aria-hidden
        priority
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full md:hidden"
      />

      {/* Desktop glow: covers the whole background */}
      <Image
        src={elementDesktop}
        alt=""
        aria-hidden
        priority
        fill
        sizes="100vw"
        className="pointer-events-none hidden object-cover md:block"
      />

      <div className="relative z-10 w-full max-w-111.5">{children}</div>
    </main>
  );
}
