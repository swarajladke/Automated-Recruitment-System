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

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createInstantMeeting } = useMeetingActions();
  const hasRedirected = useRef(false);
  const client = useStreamVideoClient();

  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  // Mock interviews instead of useQuery to prevent hang on mock.convex.cloud
  const interviews = [
    {
      _id: "mock-1" as any,
      _creationTime: Date.now(),
      streamCallId: "instant-meeting-123",
      candidateId: "mock-candidate",
      interviewerIds: ["mock-interviewer"],
      title: "Technical Interview - Frontend",
      description: "Deep dive into React and Next.js",
      status: "upcoming",
      startTime: Date.now() - 300000, // 5 minutes ago
    }
  ];
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  useEffect(() => {
    const candidateId = searchParams.get("candidate_id");
    const role = searchParams.get("role");

    if (candidateId && client && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.success(`Welcome Candidate! Initializing interview for ${role || "Position"}...`);
      createInstantMeeting(candidateId, role || undefined);
    }
  }, [searchParams, createInstantMeeting, client]);

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Active Interviews</h1>
            <p className="text-muted-foreground mt-1">Monitor and join live candidate sessions</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} isInterviewer={isInterviewer} />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
          </div>

          <div className="mt-8">
            {interviews === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
