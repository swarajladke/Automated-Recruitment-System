import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-full max-w-2xl group transition-all duration-500 hover:scale-[1.01]">
      <div className="card-interview bg-[#0f172a]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute -top-32 -right-32 size-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {/* Type Badge - Now Relative and Professional */}
            <div
              className={cn(
                "w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                badgeColor
              )}
            >
              {normalizedType}
            </div>

            {/* Interview Role */}
            <h3 className="text-3xl font-black text-white leading-tight tracking-tighter group-hover:text-emerald-400 transition-colors capitalize">
              {role}
            </h3>
          </div>

          {/* Date & Score */}
          <div className="flex items-center gap-6 mt-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <Image src="/calendar.svg" width={16} height={16} alt="Date" className="opacity-60" />
              </div>
              <span className="text-xs font-bold text-white/40 tracking-wider uppercase">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <Image src="/star.svg" width={16} height={16} alt="Score" />
              </div>
              <span className="text-sm font-black text-emerald-500">{feedback?.totalScore || "--"}<span className="text-[10px] text-white/20 ml-1">/100</span></span>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="text-sm leading-relaxed text-white/50 mt-6 font-medium line-clamp-3">
            {feedback?.finalAssessment ||
              "Official AI assessment for your current application. Complete this session to progress to the next stage of the recruitment process."}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-auto pt-4">
          <DisplayTechIcons techStack={techstack} />

          <Button asChild className="btn-primary px-6 py-5 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Analyze Report" : "Begin Session"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
