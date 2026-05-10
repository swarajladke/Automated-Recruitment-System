// Mock Firebase Client SDK for Demo
export const auth = {
  currentUser: { uid: "mock-user-123", email: "candidate@example.com" },
  onAuthStateChanged: (cb: any) => {
    cb({ uid: "mock-user-123", email: "candidate@example.com" });
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: { uid: "mock-user-123" } }),
  signOut: async () => {},
};

export const db = {
  // Add client-side firestore mocks if needed
};

// Placeholder config to avoid initialization errors
export const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock",
};
