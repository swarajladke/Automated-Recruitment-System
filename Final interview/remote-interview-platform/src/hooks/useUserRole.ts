import { useSearchParams } from "next/navigation";

export const useUserRole = () => {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id");

  return {
    isLoading: false,
    isInterviewer: !candidateId,
    isCandidate: !!candidateId,
  };
};
