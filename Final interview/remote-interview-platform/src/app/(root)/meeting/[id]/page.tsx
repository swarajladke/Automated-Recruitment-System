"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState, Suspense } from "react";

function MeetingPage() {
  const { id } = useParams();
  const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY === "mock_stream_key" || !process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isMock) {
    return (
      <Suspense fallback={<LoaderUI />}>
        <MeetingRoom />
      </Suspense>
    );
  }

  if (isCallLoading) return <LoaderUI />;

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          <Suspense fallback={<LoaderUI />}>
            <MeetingRoom />
          </Suspense>
        )}
      </StreamTheme>
    </StreamCall>
  );
}
export default MeetingPage;
