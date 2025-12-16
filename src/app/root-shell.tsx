"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import TRPCProvider from "@/lib/trpc/provider";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showLogo = pathname !== "/chat";

  return (
    <TRPCProvider>
      {showLogo && (
        <Link
          href="/"
          aria-label="Go to homepage"
          className="absolute top-4 left-4 md:top-6 md:left-6 z-50"
        >
          <div className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-zinc-900/80 flex items-center justify-center border border-zinc-700/60 group-hover:border-zinc-400 transition-colors">
              <Image
                src="/1F924.svg"
                alt="Meowww logo"
                width={22}
                height={22}
                priority
              />
            </div>
            <span className="hidden md:inline text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
              Meowww
            </span>
          </div>
        </Link>
      )}
      {children}
      <Toaster richColors position="top-right" />
    </TRPCProvider>
  );
}
