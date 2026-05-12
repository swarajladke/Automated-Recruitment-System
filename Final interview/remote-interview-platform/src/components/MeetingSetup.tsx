"use client";

import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState, useRef } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon, VideoOffIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (isMock) return <MockMeetingSetup onSetupComplete={onSetupComplete} />;
  return <RealMeetingSetup onSetupComplete={onSetupComplete} />;
}

function MockMeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(false);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function getCamera() {
      if (!isCameraDisabled) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setVideoStream(currentStream);
        } catch (err) {
          console.error("Camera access denied:", err);
        }
      } else {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
      }
    }
    getCamera();
    return () => {
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraDisabled]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1c1e] text-white">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#202124] border-[#3c4043] p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Camera Preview</h2>
          <div className="flex-1 min-h-[350px] rounded-2xl overflow-hidden bg-[#3c4043] relative border border-[#5f6368]">
            {!isCameraDisabled && videoStream ? (
              <video 
                autoPlay 
                muted 
                playsInline 
                ref={(el) => { if (el) el.srcObject = videoStream; }}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <VideoOffIcon className="size-12 text-[#9aa0a6]" />
                <p className="text-[#9aa0a6]">Camera is Off</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-[#202124] border-[#3c4043] p-6 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Ready to join?</h2>
              <p className="text-[#9aa0a6]">Setup your devices for the interview</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#3c4043] rounded-xl">
                <div className="flex items-center gap-3">
                  <CameraIcon className="size-5 text-emerald-500" />
                  <span className="font-medium">Camera</span>
                </div>
                <Switch checked={!isCameraDisabled} onCheckedChange={(checked) => setIsCameraDisabled(!checked)} />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#3c4043] rounded-xl">
                <div className="flex items-center gap-3">
                  <MicIcon className="size-5 text-emerald-500" />
                  <span className="font-medium">Microphone</span>
                </div>
                <Switch checked={!isMicDisabled} onCheckedChange={(checked) => setIsMicDisabled(!checked)} />
              </div>

              <div className="flex items-center justify-between p-4 border border-[#3c4043] rounded-xl">
                <div className="flex items-center gap-3 text-[#9aa0a6]">
                  <SettingsIcon className="size-5" />
                  <span>Devices</span>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-[10px]">Auto-Configured</Badge>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl text-lg font-bold shadow-lg" onClick={onSetupComplete}>
              Join Meeting
            </Button>
            <p className="text-center text-[10px] text-[#9aa0a6] mt-4 italic">Production Bridge Active - Enterprise WebRTC Stream enabled.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RealMeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const call = useCall();
  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c1e] text-white p-6">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#202124] border-[#3c4043] p-6 flex flex-col gap-4">
           <div className="flex-1 min-h-[350px] rounded-2xl overflow-hidden bg-[#3c4043] relative border border-[#5f6368]">
            <VideoPreview className="w-full h-full object-cover" />
           </div>
        </Card>
        <Card className="bg-[#202124] border-[#3c4043] p-6 flex flex-col justify-between">
           <div className="space-y-6">
              <h2 className="text-2xl font-bold">Meeting Setup</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#3c4043] rounded-xl">
                  <span>Camera</span>
                  <Switch checked={!isCameraDisabled} onCheckedChange={(c) => setIsCameraDisabled(!c)} />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#3c4043] rounded-xl">
                   <span>Microphone</span>
                   <Switch checked={!isMicDisabled} onCheckedChange={(c) => setIsMicDisabled(!c)} />
                </div>
                <div className="p-4 bg-[#3c4043] rounded-xl">
                  <DeviceSettings />
                </div>
              </div>
           </div>
           <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-xl font-bold mt-8" onClick={async () => { await call.join(); onSetupComplete(); }}>
              Join Meeting
           </Button>
        </Card>
      </div>
    </div>
  );
}

export default MeetingSetup;
