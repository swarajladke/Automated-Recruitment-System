import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);

  const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY;

  if (!call || (!isMock && !interview)) return null;

  const isMeetingOwner = isMock || (localParticipant?.userId === call.state.createdBy?.id);

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    try {
      if (!isMock) await call.endCall();

      if (!isMock && interview) {
        await updateInterviewStatus({
          id: interview._id,
          status: "completed",
        });
      }

      router.push("/");
      toast.success("Meeting ended for everyone");
    } catch (error) {
      console.log(error);
      toast.error("Failed to end meeting");
    }
  };

  return (
    <Button variant={"destructive"} onClick={endCall}>
      End Meeting
    </Button>
  );
}
export default EndCallButton;
