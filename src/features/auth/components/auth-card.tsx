import Image from "next/image";
import logo from "@/assets/logo.svg";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <section className="rounded-2xl border border-neutral-900 bg-black px-4 py-8 md:px-6 md:py-10">
      <div className="flex items-center justify-center gap-3">
        <Image
          src={logo}
          alt="Sociality logo"
          width={30}
          height={30}
          priority
        />
        <span className="text-display-xs font-bold">Sociality</span>
      </div>

      <h1 className="mt-6 text-center text-xl font-bold md:text-display-xs">
        {title}
      </h1>

      <div className="mt-6">{children}</div>
    </section>
  );
}
