"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HireFlowAutoRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const role = searchParams.get("role");
    const candidateId = searchParams.get("candidate_id");
    
    if (role && candidateId) {
      console.log("HireFlow AI: Deep-linking detected for role:", role);
      // Save to session storage for the integration component
      sessionStorage.setItem("candidate_id", candidateId);
      sessionStorage.setItem("applied_role", role);
      
      // In a real app, we'd search for the interview ID for this role.
      // For this demo, we'll redirect to a generic interview start if role matches.
      
      router.push("/interview");
    }
  }, [searchParams, router]);

  return null;
}
