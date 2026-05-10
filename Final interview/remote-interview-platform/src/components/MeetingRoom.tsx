"use client";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { 
  LayoutListIcon, 
  LoaderIcon, 
  UsersIcon, 
  MicIcon, 
  MicOffIcon, 
  VideoIcon, 
  VideoOffIcon, 
  PhoneOffIcon, 
  CodeIcon, 
  Settings2Icon 
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
import toast from "react-hot-toast";

function MeetingRoom() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#202124] flex items-center justify-center"><LoaderIcon className="animate-spin" /></div>}>
      <MeetingRoomContent />
    </Suspense>
  );
}

function MeetingRoomContent() {
  const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (isMock) return <MockMeetingRoom />;
  return <RealMeetingRoom />;
}

function MockMeetingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id");
  const role = searchParams.get("role") || "candidate";

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      if (!isCamOff) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setVideoStream(currentStream);
        } catch (err) {
          console.error("Camera error:", err);
          toast.error("Could not access camera");
        }
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamOff]);

  const handleFinishInterview = async () => {
    if (!candidateId) return toast.error("No candidate ID found");
    try {
      const response = await fetch("http://localhost:5001/receive-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: parseInt(candidateId), module: "coding", score: 85 }),
      });
      if (response.ok) {
        toast.success("Score synced!");
        window.location.href = "http://localhost:5173/dashboard";
      }
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem-1px)] bg-[#1a1c1e] text-white">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={30} className="relative p-4 bg-[#202124]">
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#3c4043] border border-[#5f6368] shadow-2xl">
              {!isCamOff && videoStream ? (
                <div className="relative w-full h-full">
                  <video 
                    autoPlay 
                    muted 
                    playsInline 
                    ref={(el) => { if (el) el.srcObject = videoStream; }}
                    className="w-full h-full object-cover rounded-2xl"
                    style={{ transform: role === "candidate" ? "scaleX(-1)" : "none" }}
                  />
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 z-10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    {role === "interviewer" ? "Candidate (Remote)" : "You (Candidate)"}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-[#202124] flex items-center justify-center border-2 border-[#5f6368]">
                    <VideoOffIcon className="size-10 text-[#9aa0a6]" />
                  </div>
                  <p className="font-bold">Camera is Off</p>
                </div>
              )}
            </div>

            <div className="h-20 flex items-center justify-center gap-4 bg-[#202124] rounded-2xl border border-[#3c4043] px-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-12 h-12 rounded-full ${isMicMuted ? 'bg-[#ea4335]' : 'bg-[#3c4043]'}`}
                onClick={() => setIsMicMuted(!isMicMuted)}
              >
                {isMicMuted ? <MicOffIcon className="size-5" /> : <MicIcon className="size-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-12 h-12 rounded-full ${isCamOff ? 'bg-[#ea4335]' : 'bg-[#3c4043]'}`}
                onClick={() => setIsCamOff(!isCamOff)}
              >
                {isCamOff ? <VideoOffIcon className="size-5" /> : <VideoIcon className="size-5" />}
              </Button>
              <div className="w-[1px] h-8 bg-[#3c4043]" />
              <Button 
                variant="destructive" 
                size="icon" 
                className="w-14 h-14 rounded-full bg-[#ea4335]"
                onClick={() => router.push("/")}
              >
                <PhoneOffIcon className="size-6" />
              </Button>
              <div className="w-[1px] h-8 bg-[#3c4043]" />
              
              {role === "candidate" ? (
                <Button onClick={handleFinishInterview} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-12">
                  <CodeIcon className="size-5 mr-2" />
                  Finish & Submit
                </Button>
              ) : (
                <Button onClick={() => router.push("/")} className="bg-[#ea4335] hover:bg-[#d93025] text-white rounded-xl font-bold h-12">
                  <PhoneOffIcon className="size-5 mr-2" />
                  End Interview
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[#3c4043]" />
        <ResizablePanel defaultSize={60}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function RealMeetingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id");
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div className="h-screen bg-[#202124] flex items-center justify-center"><LoaderIcon className="animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)] bg-[#1a1c1e] text-white">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={30} className="relative p-4 bg-[#202124]">
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#3c4043] border border-[#5f6368] shadow-2xl">
              {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
              {showParticipants && (
                <div className="absolute right-0 top-0 h-full w-[300px] bg-[#202124] z-50 p-4 border-l border-[#3c4043]">
                   <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
              )}
            </div>
            <div className="h-20 flex items-center justify-center gap-4 bg-[#202124] rounded-2xl border border-[#3c4043] px-6">
              <CallControls onLeave={() => router.push("/")} />
              <div className="w-[1px] h-8 bg-[#3c4043]" />
              <Button variant="ghost" onClick={() => setShowParticipants(!showParticipants)} className="bg-[#3c4043] rounded-full w-12 h-12 p-0">
                <UsersIcon className="size-5" />
              </Button>
              <EndCallButton />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[#3c4043]" />
        <ResizablePanel defaultSize={60}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MeetingRoom;
