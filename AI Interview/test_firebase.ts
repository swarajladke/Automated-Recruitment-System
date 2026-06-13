import { db } from "./firebase/admin";

async function run() {
  const feedbackRef = db.collection("feedback").doc();
  console.log("ID:", feedbackRef.id);
  console.log("Type:", typeof feedbackRef.id);
}

run();
