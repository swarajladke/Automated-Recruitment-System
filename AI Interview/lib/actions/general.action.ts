"use server";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { z } from "zod";

export async function createFeedback(params: any) {
  const { interviewId, userId, feedbackId, transcript } = params;

  try {
    if (!transcript || transcript.length === 0) {
      return { success: false, error: "No transcript available to score." };
    }

    console.log("Analyzing transcript with Groq...");
    const transcriptText = transcript.map((m: any) => `${m.role}: ${m.content}`).join("\n");
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Analyze the following interview transcript and provide professional feedback based on the candidate's performance. 
      You MUST return your response as a raw, valid JSON object matching this structure EXACTLY (do not wrap in markdown tags):
      {
        "totalScore": 85,
        "communicationScore": 90,
        "communicationComment": "Clear and concise",
        "technicalScore": 80,
        "technicalComment": "Good understanding",
        "problemSolvingScore": 85,
        "problemSolvingComment": "Structured approach",
        "culturalFitScore": 90,
        "culturalFitComment": "Great team player",
        "confidenceScore": 85,
        "confidenceComment": "Spoke confidently",
        "strengths": "Communication, Problem Solving",
        "areasForImprovement": "Deep technical knowledge",
        "finalAssessment": "Strong candidate."
      }

      Transcript: ${transcriptText}`,
    });

    let finalExtractedData;
    try {
      finalExtractedData = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    } catch (e) {
      console.error("Failed to parse JSON from Groq:", text);
      return { success: false, error: "AI returned invalid JSON formatting." };
    }

    const finalFeedback = {
      interviewId: interviewId || "mock-interview-id",
      userId: userId || "anonymous",
      totalScore: finalExtractedData.totalScore || 0,
      categoryScores: [
        { name: "Communication Skills", score: finalExtractedData.communicationScore || 0, comment: finalExtractedData.communicationComment || "" },
        { name: "Technical Knowledge", score: finalExtractedData.technicalScore || 0, comment: finalExtractedData.technicalComment || "" },
        { name: "Problem Solving", score: finalExtractedData.problemSolvingScore || 0, comment: finalExtractedData.problemSolvingComment || "" },
        { name: "Cultural Fit", score: finalExtractedData.culturalFitScore || 0, comment: finalExtractedData.culturalFitComment || "" },
        { name: "Confidence and Clarity", score: finalExtractedData.confidenceScore || 0, comment: finalExtractedData.confidenceComment || "" },
      ],
      strengths: typeof finalExtractedData.strengths === "string" ? finalExtractedData.strengths.split(",").map((s: string) => s.trim()) : finalExtractedData.strengths || [],
      areasForImprovement: typeof finalExtractedData.areasForImprovement === "string" ? finalExtractedData.areasForImprovement.split(",").map((s: string) => s.trim()) : finalExtractedData.areasForImprovement || [],
      finalAssessment: finalExtractedData.finalAssessment || "",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(finalFeedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error: any) {
    console.error("CRITICAL ERROR IN createFeedback:", error);
    return { success: false, error: error?.message || String(error) };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
