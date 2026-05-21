import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = async (candidateId?: string, role?: string) => {
    const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!client && !isMock) return;

    try {
      const id = crypto.randomUUID();

      // Mock Bypass: Skip network call if using mock keys
      if (isMock) {
        console.warn("Mock Mode: Bypassing real meeting creation");
        let url = `/meeting/${id}`;
        const params = new URLSearchParams();
        if (candidateId) params.append("candidate_id", candidateId);
        if (role) params.append("role", role);
        if (params.toString()) url += `?${params.toString()}`;
        router.push(url);
        return;
      }

      if (!client) throw new Error("Stream Video client is missing");
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: role ? `Interview for ${role}` : "Instant Meeting",
            candidateId: candidateId,
          },
        },
      });

      let url = `/meeting/${call.id}`;
      const params = new URLSearchParams();
      if (candidateId) params.append("candidate_id", candidateId);
      if (role) params.append("role", role);
      if (params.toString()) url += `?${params.toString()}`;

      router.push(url);
      toast.success("Meeting Created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create meeting");
    }
  };

  const joinMeeting = (callId: string, candidateId?: string, role?: string) => {
    let url = `/meeting/${callId}`;
    const params = new URLSearchParams();
    if (candidateId) params.append("candidate_id", candidateId);
    if (role) params.append("role", role);
    if (params.toString()) url += `?${params.toString()}`;
    router.push(url);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
