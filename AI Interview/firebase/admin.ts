// Mock Firebase Admin SDK for Demo
export const auth = {
  verifySessionCookie: async () => ({ uid: "mock-user-123" }),
  createSessionCookie: async () => "mock-session-cookie",
  getUserByEmail: async () => ({ uid: "mock-user-123", email: "candidate@example.com" }),
};

export const db = {
  collection: (name: string) => ({
    doc: (id?: string) => ({
      get: async () => ({
        exists: true,
        id: id || "mock-doc-id",
        data: () => {
          if (name === "users") return { name: "Demo Candidate", email: "candidate@example.com" };
          if (name === "interviews") return { 
            role: "Frontend Developer", 
            type: "Technical", 
            questions: ["What is React?", "Explain Hooks"], 
            techstack: ["React", "Next.js"],
            finalized: true
          };
          return {};
        },
      }),
      set: async () => ({ success: true }),
      update: async () => ({ success: true }),
    }),
    where: function() { return this; },
    orderBy: function() { return this; },
    limit: function() { return this; },
    get: async () => {
      const docs = [
        {
          id: "mock-id-1",
          data: () => {
            if (name === "interviews") return {
              role: "Frontend Developer",
              type: "Technical",
              techstack: ["React", "Next.js", "Tailwind CSS"],
              finalized: true,
              createdAt: new Date().toISOString(),
              userId: "mock-user-123"
            };
            if (name === "feedback") return {
              interviewId: "mock-id-1",
              userId: "mock-user-123",
              totalScore: 88,
              createdAt: new Date().toISOString()
            };
            return {};
          }
        }
      ];
      return { empty: false, docs };
    },
  }),
};
