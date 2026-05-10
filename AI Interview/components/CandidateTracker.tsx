"use client";

import { useEffect } from "react";

export default function CandidateTracker() {
  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const candidateId = params.get("candidate_id");

      if (candidateId) {
        sessionStorage.setItem("candidate_id", candidateId);
        console.log("HireFlow AI: Candidate ID captured:", candidateId);
      }
    }
  }, []);

  return null;
}
