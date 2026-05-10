"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface Props {
  score: number;
}

export default function HireFlowIntegration({ score }: Props) {
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const candidateId = sessionStorage.getItem("candidate_id");

    if (candidateId && !hasSubmitted.current) {
      const numericId = parseInt(candidateId);
      
      if (!isNaN(numericId)) {
        submitScore(numericId);
        hasSubmitted.current = true;
      } else {
        console.error("HireFlow AI: Invalid candidate_id found in storage");
      }
    }
  }, [score]);

  const submitScore = async (candidateId: number) => {
    try {
      const response = await fetch("http://localhost:5001/receive-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          module: "ai",
          score: score,
        }),
      });

      if (response.ok) {
        toast.success("Interview score synced with HireFlow AI!");
        
        setTimeout(() => {
          toast.info("Redirecting back to dashboard...");
          setTimeout(() => {
            window.location.href = "http://localhost:5173/dashboard";
          }, 1500);
        }, 1000);
      } else {
        toast.error("Failed to sync score with central controller.");
      }
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error("Connection error to HireFlow AI.");
    }
  };

  return null;
}
