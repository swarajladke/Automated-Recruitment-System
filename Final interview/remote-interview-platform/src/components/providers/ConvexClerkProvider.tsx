"use client";

import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock.convex.cloud");

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

export default ConvexClerkProvider;
