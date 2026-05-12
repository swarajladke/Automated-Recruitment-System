import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import CandidateTracker from "@/components/CandidateTracker";
import HireFlowAutoRedirect from "@/components/HireFlowAutoRedirect";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireFlow AI | Interview Arena",
  description: "Advanced AI-powered assessment platform for high-stakes technical and behavioral interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        <Suspense fallback={null}>
          <CandidateTracker />
          <HireFlowAutoRedirect />
        </Suspense>
        
        {children}

        <Toaster />
      </body>
    </html>
  );
}
