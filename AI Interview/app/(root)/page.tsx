import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home({ searchParams }: { searchParams: { role?: string } }) {
  const user = await getCurrentUser();
  const targetRole = (await searchParams).role;

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  // Filter interviews to only show those matching the applied role (if provided)
  const filteredUserInterviews = targetRole 
    ? userInterviews?.filter(i => i.role.toLowerCase().includes(targetRole.toLowerCase()))
    : userInterviews;

  const filteredAllInterviews = targetRole
    ? allInterview?.filter(i => i.role.toLowerCase().includes(targetRole.toLowerCase()))
    : allInterview;

  const primaryInterview = filteredAllInterviews?.[0] || allInterview?.[0];

  return (
    <div className="flex flex-col gap-24 py-12">
      <section className="relative flex flex-col items-center text-center gap-10 max-w-3xl mx-auto">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col gap-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
            The Definitive <span className="text-emerald-500">AI Assessment</span> Arena
          </h1>
          <p className="text-xl text-white/50 leading-relaxed font-medium">
            Standardized behavioral evaluation for the modern recruitment cycle. 
            Objective, real-time, and data-driven.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 relative z-10">
          <Button asChild className="btn-primary px-12 py-7 text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.4)] transition-all duration-500">
            <Link href="/interview">Initiate Interview Session</Link>
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/40">
            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Vapi Core Integrated
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-12 w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-black uppercase tracking-widest text-white/90">Primary Assessment</h2>
          <p className="text-white/40 max-w-md">Standardized AI behavioral evaluation for your current application cycle.</p>
        </div>

        <div className="w-full max-w-2xl flex justify-center">
          {primaryInterview ? (
            <InterviewCard
              userId={user?.id}
              interviewId={primaryInterview.id}
              role="AI Behavioral Interview"
              type="Professional Assessment"
              techstack={[]}
              createdAt={primaryInterview.createdAt}
            />
          ) : (
            <div className="w-full p-16 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-6">
              <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <span className="text-4xl text-emerald-500 animate-pulse">!</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white">No active assessments found</h3>
                <p className="text-white/40 max-w-xs italic">Please ensure your application is active on the HireFlow portal to trigger your AI interview.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
