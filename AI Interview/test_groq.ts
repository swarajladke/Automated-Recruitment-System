import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";


async function run() {
  try {
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

      Transcript: candidate: Hello.`,
    });
    console.log("TEXT:", text);
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    console.log("PARSED:", parsed);
  } catch (e: any) {
    console.error("ERROR:", e);
  }
}

run();
