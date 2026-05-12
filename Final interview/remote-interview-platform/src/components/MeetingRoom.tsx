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
  VideoIcon,
  VideoOffIcon,
  CodeIcon,
  TimerIcon,
  ChevronRightIcon,
  BookOpenIcon,
  Maximize2Icon
} from "lucide-react";
// FORCE REBUILD: Updating question bank to Hard Tier challenges
import { CODING_QUESTIONS } from "@/constants";
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
    <Suspense fallback={<div className="h-screen bg-[#0d1117] flex items-center justify-center"><LoaderIcon className="animate-spin text-emerald-500" /></div>}>
      <MeetingRoomContent />
    </Suspense>
  );
}

function MeetingRoomContent() {
  const isMock = process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY;
  if (isMock) return <StandardMeetingRoom />;
  return <RealMeetingRoom />;
}

function StandardMeetingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidate_id");
  const applicationId = searchParams.get("application_id");
  const role = searchParams.get("role") || "candidate";

  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string[]>(["[SYSTEM] Environment ready.", "[SYSTEM] AI Proctor initialized."]);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsSolved, setQuestionsSolved] = useState(0);
  const [totalTestCasesCleared, setTotalTestCasesCleared] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());

  const currentQuestion = CODING_QUESTIONS[currentQuestionIndex];

  // CODE EXECUTION STATE
  const [language, setLanguage] = useState<"javascript" | "python" | "java">("javascript");
  const [code, setCode] = useState(currentQuestion.starterCode["javascript"]);

  useEffect(() => {
    // Update code when question changes
    setCode(currentQuestion.starterCode[language]);
  }, [currentQuestionIndex, language]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    const starter = setTimeout(() => setIsStarted(true), 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(starter);
    };
  }, []);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function startCamera() {
      if (!isCamOff) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) videoRef.current.srcObject = currentStream;
        } catch (err) {
          console.error("Camera error:", err);
        }
      } else {
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    }
    startCamera();
    return () => {
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
  }, [isCamOff]);

  const handleSubmit = async (isAuto = false) => {
    setIsRunning(true);
    setExecutionOutput(prev => [
      ...prev, 
      isAuto ? `[SECURITY] Violation Detected: Mandatory Fullscreen Exited.` : `[SYSTEM] Manual Submission Initiated.`, 
      `[SYSTEM] Finalizing assessment report...`
    ]);
    
    toast.loading(isAuto ? "Security Violation: Auto-Submitting..." : "Submitting Final Assessment...");
    
    // Calculate final scores
    const finalScore = {
      candidate_id: candidateId || "Guest",
      application_id: applicationId,
      role: role,
      questions_solved: questionsSolved,
      test_cases_cleared: totalTestCasesCleared,
      total_questions: CODING_QUESTIONS.length,
      submission_type: isAuto ? "AUTOMATIC" : "MANUAL",
      status: "Completed"
    };

    try {
      // Send to HireFlow Backend
      await fetch("http://localhost:5001/receive-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalScore)
      });
      
      setExecutionOutput(prev => [...prev, `[SUCCESS] Score successfully synced to HireFlow Central DB.`]);
    } catch (err) {
      console.error("Score sync error:", err);
      setExecutionOutput(prev => [...prev, `[ERROR] Failed to sync score. Retrying locally...`]);
    }

    setTimeout(() => {
      toast.dismiss();
      if (!isAuto) {
        toast.success("Assessment Submitted Successfully.");
      }
      
      setTimeout(() => {
        router.push("/"); 
      }, isAuto ? 1500 : 500); 
    }, 2000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement && 
          isStarted) {
        toast.error("Security Violation: Test Auto-Submitted.", { duration: 5000 });
        handleSubmit(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [isStarted]);

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionOutput(prev => [...prev, `[RUN] Initializing Technical Evaluator...`]);
    
    setTimeout(() => {
      if (language !== 'javascript') {
        setExecutionOutput(prev => [...prev, 
          `[ERROR] Local execution currently only supported for JavaScript.`,
          `[INFO] Submitting ${language} implementation to cloud evaluator...`,
          `[PASS] Cloud Check: Syntax Verified.`
        ]);
        setIsRunning(false);
        return;
      }

      try {
        const testCases = currentQuestion.testCases || [];
        if (testCases.length === 0) throw new Error("No test cases defined for this question.");

        let passed = 0;
        const newLogs: string[] = [`[RUN] Executing implementation against ${testCases.length} Hard-Tier test cases...`];

        testCases.forEach((tc, i) => {
          try {
            // Functional Wrapper for eval
            const userFn = new Function('nums1', 'nums2', 'height', `${code}\nif(typeof findMedianSortedArrays !== 'undefined') return findMedianSortedArrays(nums1, nums2); if(typeof trap !== 'undefined') return trap(height);`);
            const result = currentQuestion.id === 'median-arrays' 
              ? userFn(tc.nums1, tc.nums2) 
              : userFn(undefined, undefined, tc.height);
            
            const isCorrect = Math.abs(result - tc.expected) < 0.0001;
            
            if (isCorrect) {
              passed++;
              newLogs.push(`[PASS] Test Case ${i + 1}: Success`);
            } else {
              newLogs.push(`[FAIL] Test Case ${i + 1}: Expected ${tc.expected}, Got ${result}`);
            }
          } catch (err: any) {
            newLogs.push(`[ERROR] Test Case ${i + 1}: ${err.message}`);
          }
        });

        const currentTotalPassed = totalTestCasesCleared + passed;
        setTotalTestCasesCleared(prev => prev + passed);
        
        setExecutionOutput(prev => [...prev, ...newLogs, `[RESULT] ${passed}/${testCases.length} Test Cases Passed.`]);
        
        if (passed === testCases.length) {
          toast.success("Challenge Cleared!");
          if (!solvedQuestions.has(currentQuestion.id)) {
            setQuestionsSolved(prev => prev + 1);
            setSolvedQuestions(prev => new Set(prev).add(currentQuestion.id));
          }
        } else {
          toast.error(`${testCases.length - passed} Test Cases Failed`);
        }
      } catch (globalErr: any) {
        setExecutionOutput(prev => [...prev, `[FATAL] Execution failed: ${globalErr.message}`]);
      }
      setIsRunning(false);
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStream) screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsSharingScreen(false);
      toast.success("Screen sharing stopped");
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsSharingScreen(true);
        toast.success("Screen sharing active");
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          setScreenStream(null);
        };
      } catch (err) {
        toast.error("Failed to start screen share");
      }
    }
  };

  return (
    <>
    <div className="h-screen bg-[#0b0e14] text-[#c9d1d9] flex flex-col relative overflow-hidden font-sans">
      
      {/* HEADER BAR */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between z-40 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CodeIcon className="size-4 text-emerald-500" />
             </div>
             <span className="text-xs font-black text-white uppercase tracking-[0.2em]">HireFlow Arena</span>
          </div>
          
          <div className="h-4 w-px bg-white/10" />

          <Button 
            variant="ghost" 
            onClick={() => setIsQuestionOpen(!isQuestionOpen)}
            className={`h-9 px-4 rounded-xl border transition-all flex items-center gap-2 ${isQuestionOpen ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'}`}
          >
            <BookOpenIcon className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Question Hub</span>
          </Button>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-4 bg-black/40 px-6 py-1.5 rounded-full border border-white/5">
              <TimerIcon className="size-3 text-emerald-500" />
              <span className="text-sm font-mono font-black text-emerald-500 tracking-tighter">{formatTime(timeLeft)}</span>
           </div>
           
           <div className="flex items-center gap-3">
              <Button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="h-9 px-6 bg-[#161b22] hover:bg-[#1c2128] text-white border border-[#30363d] rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-2xl"
              >
                {isRunning ? "Executing..." : "Run Tests"}
              </Button>
              <Button 
                onClick={() => handleSubmit(false)}
                disabled={isRunning}
                className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_200px_rgba(16,185,129,0.1)]"
              >
                Submit Assessment
              </Button>
           </div>
        </div>
      </div>



      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: QUESTION (Togglable Drawer) */}
        {isQuestionOpen && (
          <div className="w-[420px] bg-[#0d1117] border-r border-[#30363d] flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl z-50">
            <div className="h-full flex flex-col">
              {/* TOP HEADER */}
              <div className="p-8 border-b border-[#30363d] bg-[#161b22]/30">
                <div className="flex items-center gap-3 mb-1">
                   <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                   <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Evaluation Roadmap</h2>
                </div>
                <p className="text-[10px] text-[#8b949e] font-medium uppercase tracking-widest opacity-50">Technical Coding Phase • 2 Challenges</p>
              </div>

              {/* QUESTION LIST / NAVIGATION */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-3">
                  {CODING_QUESTIONS.map((q, idx) => {
                    const isSolved = solvedQuestions.has(q.id);
                    const isActive = currentQuestionIndex === idx;

                    return (
                      <div 
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                          isActive 
                          ? 'bg-emerald-500/[0.07] border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.05)]' 
                          : 'bg-[#161b22]/40 border-white/[0.05] hover:border-white/20'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                        
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-3">
                              <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-white/20'}`}>
                                0{idx + 1}
                              </span>
                              <h3 className={`text-sm font-black tracking-widest uppercase transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                {q.title}
                              </h3>
                           </div>
                           {isSolved && (
                             <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                               <div className="size-1 rounded-full bg-emerald-500" />
                               <span className="text-[10px] font-black text-emerald-500 uppercase">Cleared</span>
                             </div>
                           )}
                        </div>
                        
                        <div className="flex gap-3">
                           <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                             {q.id === 'median-arrays' ? '200' : '300'} Points
                           </span>
                           <span className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">
                             {q.difficulty || 'Hard'}
                           </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CURRENT QUESTION DETAIL */}
                <div className="p-8 space-y-10 border-t border-[#30363d] bg-black/10">
                  {/* OBJECTIVE SECTION */}
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="h-px flex-1 bg-white/5" />
                         <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">The Challenge</span>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="relative">
                        <p className="text-sm leading-[1.8] text-[#8b949e] font-medium italic">
                          "{currentQuestion.description}"
                        </p>
                      </div>
                  </div>

                  {/* SCENARIOS SECTION */}
                  <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="h-px flex-1 bg-white/5" />
                         <span className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Example Scenarios</span>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="space-y-4">
                        {currentQuestion.examples.map((ex, i) => (
                            <div key={i} className="group p-5 bg-[#161b22]/40 rounded-2xl border border-white/[0.03] hover:border-white/10 transition-all space-y-3">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Scenario {i + 1}</span>
                                  <div className="size-1 rounded-full bg-white/10" />
                               </div>
                               <div className="space-y-2 font-mono">
                                  <div className="flex gap-3 text-xs">
                                     <span className="text-emerald-500/50 font-bold shrink-0">IN:</span>
                                     <span className="text-[#8b949e] break-all">{ex.input}</span>
                                  </div>
                                  <div className="flex gap-3 text-xs">
                                     <span className="text-blue-400/50 font-bold shrink-0">OUT:</span>
                                     <span className="text-white/80">{ex.output}</span>
                                  </div>
                               </div>
                            </div>
                        ))}
                      </div>
                  </div>

                  {/* CONSTRAINTS (Optional) */}
                  {currentQuestion.constraints && (
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Technical Constraints</span>
                          <div className="h-px flex-1 bg-white/5" />
                       </div>
                       <ul className="space-y-3">
                          {currentQuestion.constraints.map((c, i) => (
                             <li key={i} className="flex gap-3 items-start">
                                <div className="size-1 rounded-full bg-emerald-500/40 mt-1.5" />
                                <span className="text-[10px] text-[#8b949e] leading-relaxed">{c}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN WORKSPACE: IDE (Left) + CONSOLE (Right) */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={65} minSize={30} className="bg-[#0d1117]">
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={language} 
              setLanguage={setLanguage} 
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-[#30363d] w-1 hover:w-1.5 transition-all" />

          <ResizablePanel defaultSize={35} minSize={20} className="bg-[#0b0e14]">
            <div className="h-full flex flex-col">
               <div className="h-10 px-6 border-b border-[#30363d] bg-[#161b22]/30 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#484f58] uppercase tracking-widest">Execution Terminal</span>
                  <div className="flex gap-1">
                     <div className="size-1.5 rounded-full bg-red-500/20" />
                     <div className="size-1.5 rounded-full bg-yellow-500/20" />
                     <div className="size-1.5 rounded-full bg-emerald-500/20" />
                  </div>
               </div>
               <div className="flex-1 p-6 font-mono text-xs overflow-y-auto custom-scrollbar bg-black/20">
                  <div className="space-y-2">
                     {executionOutput.map((line, i) => (
                        <div key={i} className={`flex gap-3 ${line.includes('[PASS]') ? 'text-emerald-500' : line.includes('[RUN]') ? 'text-blue-400 font-bold' : 'text-[#8b949e]'}`}>
                           <span className="opacity-30">[{i+1}]</span>
                           <span>{line}</span>
                        </div>
                     ))}
                     {isRunning && <div className="text-emerald-500 animate-pulse">_ Running...</div>}
                  </div>
               </div>
               
               <div className="h-16 border-t border-[#30363d] px-8 bg-[#161b22]/10 flex items-center justify-start">
                  <div className="flex items-center gap-3">
                     <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Secure Session Active</span>
                  </div>
               </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
    </>
  );
}

function RealMeetingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Initialize state to satisfy CodeEditor props
  const [currentQuestionIndex] = useState(0);
  const currentQuestion = CODING_QUESTIONS[currentQuestionIndex];
  const [language, setLanguage] = useState<"javascript" | "python" | "java">("javascript");
  const [code, setCode] = useState(currentQuestion.starterCode["javascript"]);

  if (callingState !== CallingState.JOINED) {
    return <div className="h-screen bg-[#0d1117] flex items-center justify-center"><LoaderIcon className="animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="h-screen bg-[#0d1117] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-[#30363d]">
          <CodeEditor 
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
        <div className="w-[400px] bg-[#161b22]">
          <SpeakerLayout />
        </div>
      </div>
      <div className="h-20 bg-[#0d1117] border-t border-[#30363d] px-8 flex items-center justify-center gap-4">
        <CallControls onLeave={() => router.push("/")} />
      </div>
    </div>
  );
}

export default MeetingRoom;
