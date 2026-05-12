"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "convex/react";
import { useState, useEffect, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import useMeetingActions from "@/hooks/useMeetingActions";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { 
  ShieldCheckIcon, 
  TimerIcon, 
  FileCode2Icon, 
  CameraIcon, 
  VideoIcon, 
  CheckCircle2Icon,
  ChevronRightIcon,
  Info,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createInstantMeeting } = useMeetingActions();
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const candidateId = searchParams.get("candidate_id") || "Guest-9921";
  const role = searchParams.get("role") || "Senior Software Engineer";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setIsAuthorized(true);
      toast.success("Biometric Link Established.");
    } catch (err) {
      toast.error("Camera access denied. Authorization mandatory.");
      console.error("Camera access denied", err);
    }
  };

  useEffect(() => {
    return () => {
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    };
  }, [videoStream]);

  const handleStart = async () => {
    if (!videoStream || !agreed) return;

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed", err);
    }

    setIsStarting(true);
    toast.success("Identity Verified. Entering Arena...");
    setTimeout(() => {
      createInstantMeeting(candidateId, role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#94a3b8] flex items-center justify-center p-6 font-sans antialiased selection:bg-emerald-500/10">
      
      {/* SUBTLE BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl w-full bg-[#0d1117] rounded-2xl border-t-4 border-emerald-500 shadow-[0_30px_70px_rgba(0,0,0,0.4)] border-x border-b border-white/[0.03] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* HEADER AREA */}
        <div className="p-10 lg:p-14 pb-6">
           <div className="flex justify-between items-center mb-10">
              <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                HIREFLOW INTEGRATED
              </span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Candidate ID: {candidateId}
              </span>
           </div>
           
           <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white tracking-tight">{role}</h1>
              <p className="text-sm text-white/30 font-medium">System check and instructions for your technical evaluation.</p>
           </div>
        </div>

        {/* GUIDELINES SECTION */}
        <div className="px-10 lg:px-14 py-8 space-y-6">
           <div className="flex items-center gap-3">
              <Info className="size-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-white/90">Guidelines</h3>
           </div>
           
           <div className="space-y-4 pl-1">
              {[
                "60 Minutes | 2 Technical Challenges total duration.",
                "Calculators and external aids are strictly prohibited.",
                "Your session is being recorded via camera for proctoring."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="size-4 flex items-center justify-center">
                      <CheckCircle2Icon className="size-3.5 text-emerald-500" />
                   </div>
                   <span className="text-[13px] font-medium text-white/50">{text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* PROCTORING CHECK SECTION */}
        <div className="px-10 lg:px-14 py-8 space-y-6">
           <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-white/90">Proctoring Check</h3>
           </div>
           
           <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="size-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                    <CameraIcon className="size-5 text-white/30" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white/80">Webcam Permission</p>
                    <p className="text-[11px] text-white/20 uppercase tracking-tighter font-semibold">Required for identity verification</p>
                 </div>
              </div>
              
              <Button 
                 onClick={!isAuthorized ? startCamera : undefined}
                 className={`h-11 px-8 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                    isAuthorized 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default" 
                    : "bg-[#111827] text-white border border-white/5 hover:bg-black"
                 }`}
              >
                 {isAuthorized ? "Ready" : "Enable Camera"}
              </Button>
           </div>

           {isAuthorized && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/[0.05] bg-black shadow-2xl animate-in fade-in duration-500">
                 <video 
                    autoPlay 
                    muted 
                    playsInline 
                    ref={(el) => { if (el && videoStream) el.srcObject = videoStream; }}
                    className="w-full h-full object-cover scale-x-[-1]"
                 />
                 <div className="absolute inset-0 pointer-events-none border border-emerald-500/10" />
                 <div className="absolute bottom-6 left-6 flex items-center gap-3 px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/[0.1]">
                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">Biometric Link: Active</span>
                 </div>
              </div>
           )}
        </div>

        {/* AGREEMENT & ENTRY SECTION */}
        <div className="p-10 lg:p-14 pt-6 space-y-10">
           <div className="flex justify-center">
              <label className="flex items-center gap-4 cursor-pointer group max-w-md">
                 <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="size-5 rounded border-white/10 bg-white/5 checked:bg-emerald-500 transition-all cursor-pointer"
                 />
                 <span className="text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                    I understand that this test is proctored and my video is being recorded.
                 </span>
              </label>
           </div>

           <div className="flex justify-center">
              <Button 
                 onClick={handleStart}
                 disabled={isStarting || !isAuthorized || !agreed}
                 className="w-full max-w-sm h-14 bg-[#d1d5db] hover:bg-[#e5e7eb] text-black rounded-full font-bold text-[13px] transition-all active:scale-[0.98] disabled:bg-white/5 disabled:text-white/10 disabled:cursor-not-allowed"
              >
                 {isStarting ? (
                   <div className="flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" />
                      Initializing...
                   </div>
                 ) : (
                   "Enter Test Environment"
                 )}
              </Button>
           </div>
        </div>

      </div>
      
      {/* SYSTEM HUD FOOTER */}
      <div className="fixed bottom-8 right-8 text-[9px] font-bold text-white/5 uppercase tracking-[0.4em] pointer-events-none">
        ARENA-PROTOCOL-X
      </div>
    </div>
  );
}
