"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  profileImage,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messagesArray: any[]) => {
      console.log("handleGenerateFeedback");

      if (messagesArray.length === 0) {
        console.log("No transcript found!");
        router.push("/");
        return;
      }

      const result = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messagesArray,
        feedbackId,
      });

      if (result.success && result.feedbackId) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback:", result);
        alert("Failed to score interview. Result payload: " + JSON.stringify(result));
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

    if (type === "generate" && workflowId) {
      await vapi.start(workflowId, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      // Fallback to the hardcoded interviewer assistant if no workflow ID is provided
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      } else if (type === "generate") {
        formattedQuestions = "- Tell me about yourself.\n- What are your strengths?\n- Why do you want this job?";
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Session Header Banner */}
      <div className="w-full flex justify-between items-center bg-[#064e3b]/20 border border-[#10b981]/20 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-2.5 bg-[#10b981] animate-pulse rounded-full shadow-[0_0_10px_#10b981]" />
          <span className="text-[#10b981] font-black text-xs tracking-widest uppercase">HireFlow AI Verified Session</span>
        </div>
        <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Active Assessment</span>
      </div>

      <div className="call-view grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* AI Interviewer Card */}
        <div className="group relative flex flex-col items-center justify-center p-12 h-[450px] bg-gradient-to-br from-[#064e3b]/40 to-[#08090d] rounded-3xl border-2 border-[#10b981]/30 shadow-2xl transition-all duration-500 hover:border-[#10b981]/60">
          <div className="absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          <div className="relative z-10 flex items-center justify-center bg-gradient-to-tr from-[#10b981] to-white/80 rounded-full size-[140px] shadow-[0_0_50px_rgba(16,185,129,0.2)]">
             <div className="bg-[#08090d] size-[132px] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#10b981]/20 shadow-inner">
               <Image
                 src="/robot.png"
                 alt="AI Robot Avatar"
                 width={110}
                 height={110}
                 className="object-contain opacity-90 group-hover:scale-110 transition-transform duration-700"
               />
             </div>
            {isSpeaking && <span className="absolute inset-0 animate-ping rounded-full bg-[#10b981]/40" />}
          </div>
          <h3 className="relative z-10 text-2xl font-bold text-white mt-8 tracking-tight">AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="group flex flex-col items-center justify-center p-12 h-[450px] bg-[#0f172a]/20 backdrop-blur-sm rounded-3xl border-2 border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10">
          <div className="relative flex items-center justify-center rounded-full size-[140px] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-800">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Candidate Profile"
                width={140}
                height={140}
                className="object-cover size-full group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex items-center justify-center size-full bg-gradient-to-br from-slate-700 to-slate-900">
                <svg className="size-20 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mt-8 tracking-tight">
            {(!userName || userName.toLowerCase().includes('demo')) ? "You" : userName}
          </h3>
        </div>
      </div>

      {/* Transcript Visualization */}
      {messages.length > 0 && (
        <div className="w-full bg-[#0f172a]/40 border border-white/5 p-8 rounded-3xl shadow-inner backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center min-h-12 px-5">
            <p
              key={lastMessage}
              className={cn(
                "text-xl text-center text-white/90 leading-relaxed font-medium italic",
                "animate-fadeIn"
              )}
            >
              "{lastMessage}"
            </p>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="w-full flex justify-center pt-4">
        {callStatus !== "ACTIVE" ? (
          <button 
            className="group relative px-12 py-4 bg-[#10b981] hover:bg-[#059669] text-black font-black uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] active:scale-95" 
            onClick={() => handleCall()}
          >
            <div className={cn(
              "absolute inset-0 animate-ping rounded-full bg-[#10b981] opacity-20",
              callStatus !== "CONNECTING" && "hidden"
            )} />
            <span className="relative flex items-center gap-2">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Initiate Assessment" : "Connecting..."}
            </span>
          </button>
        ) : (
          <button 
            className="px-12 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.5)] active:scale-95" 
            onClick={() => handleDisconnect()}
          >
            Terminate Session
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
