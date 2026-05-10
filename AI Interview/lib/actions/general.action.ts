"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, feedbackId } = params;

  try {
    // MOCK AI ANALYSIS FOR DEMO
    const mockScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
    
    const mockFeedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: mockScore,
      categoryScores: [
        { name: "Communication Skills", score: mockScore + 2, comment: "Clear and professional articulation of ideas." },
        { name: "Technical Knowledge", score: mockScore - 3, comment: "Strong understanding of core concepts and best practices." },
        { name: "Problem-Solving", score: mockScore, comment: "Methodical approach to complex challenges." },
        { name: "Cultural & Role Fit", score: mockScore + 1, comment: "Values align well with a high-performance engineering culture." },
        { name: "Confidence & Clarity", score: mockScore - 1, comment: "Demonstrates high confidence in technical delivery." }
      ],
      strengths: [
        "Excellent grasp of modern frontend architectures.",
        "Articulate communication of technical trade-offs.",
        "Strong problem-solving methodology."
      ],
      areasForImprovement: [
        "Could dive deeper into system-level performance optimizations.",
        "Consider exploring more advanced state management patterns."
      ],
      finalAssessment: "The candidate demonstrated exceptional proficiency in both technical and behavioral aspects. Their responses were well-structured, insightful, and showcased a deep understanding of the requirements for this role. Highly recommended for the next stage.",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(mockFeedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving mock feedback:", error);
    return { success: false };
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
