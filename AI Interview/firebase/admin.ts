// Mock Firebase Admin SDK for Demo

let mockFeedbacks: any[] = [];
let mockInterviews: any[] = [
  {
    id: "mock-id-1",
    role: "Software Engineer",
    type: "Technical",
    techstack: ["React", "Python", "System Design"],
    finalized: true,
    createdAt: new Date().toISOString(),
    userId: "system-generated"
  }
];

export const auth = {
  verifySessionCookie: async () => ({ uid: "mock-user-123" }),
  createSessionCookie: async () => "mock-session-cookie",
  getUserByEmail: async () => ({ uid: "mock-user-123", email: "candidate@example.com" }),
};

export const db = {
  collection: (name: string) => {
    const queryObj = {
      _filters: [] as any[],
      where: function(field: string, op: string, val: any) {
        this._filters.push({field, op, val});
        return this;
      },
      orderBy: function() { return this; },
      limit: function() { return this; },
      get: async function() {
        let source = name === 'feedback' ? mockFeedbacks : mockInterviews;
        let filtered = source;
        for (const f of this._filters) {
          if (f.op === '==') filtered = filtered.filter(item => item[f.field] === f.val);
          if (f.op === '!=') filtered = filtered.filter(item => item[f.field] !== f.val);
        }
        const docs = filtered.map(item => ({
          id: item.id || "mock-id-1",
          data: () => item
        }));
        return { empty: docs.length === 0, docs };
      },
      doc: function(id?: string) {
        const docId = id || Math.random().toString(36).substring(7);
        return {
          id: docId,
          get: async () => {
            let source = name === 'feedback' ? mockFeedbacks : mockInterviews;
            let item = source.find(x => x.id === docId);
            if (!item) {
              if (name === "users") item = { name: "Demo Candidate", email: "candidate@example.com" };
              if (name === "interviews") item = { 
                role: "Frontend Developer", 
                type: "Technical", 
                questions: ["What is React?", "Explain Hooks"], 
                techstack: ["React", "Next.js"],
                finalized: true
              };
            }
            return {
              exists: true,
              id: docId,
              data: () => item || {}
            };
          },
          set: async (data: any) => {
            let source = name === 'feedback' ? mockFeedbacks : mockInterviews;
            const idx = source.findIndex(x => x.id === docId);
            if (idx >= 0) {
              source[idx] = { ...data, id: docId };
            } else {
              source.push({ ...data, id: docId });
            }
            return { success: true };
          },
          update: async (data: any) => {
            let source = name === 'feedback' ? mockFeedbacks : mockInterviews;
            const idx = source.findIndex(x => x.id === docId);
            if (idx >= 0) {
              source[idx] = { ...source[idx], ...data };
            }
            return { success: true };
          }
        };
      }
    };
    return queryObj;
  }
};
