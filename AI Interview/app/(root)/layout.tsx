import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout min-h-screen bg-[#020408] text-white">
      <nav className="flex items-center justify-between py-6 border-b border-white/5 mb-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Image src="/logo.svg" alt="HireFlow Logo" width={24} height={24} className="invert" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-white leading-none">HireFlow</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-emerald-500">AI Interview</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60">
             Session Secured
           </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
