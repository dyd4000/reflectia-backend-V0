import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

console.log("🔥API called!");
admin.initializeApp();
console.log("Firebase Admin SDK initialized.");

if (process.env.FUNCTIONS_EMULATOR) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

// デバッグ用のAPI
export const helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!! I'm Deployed using GitHub Actions");
});

// firestoreのデータを取得するAPI
export const getQuestions = onRequest(async (req, res) => {
  console.log("🔥 getQuestions API called!");
  console.log("Create Firestore Client...");
  const db = admin.firestore();

  try {
    console.log("Fetching questions from Firestore...");
    const snapShot = await db.collection("questions").get();
    logger.info(`Fetched questions: ${snapShot.docs.length}`);
    if (snapShot.empty) {
      console.log("No matching documents.");
      res.status(404).json({message: "No questions found"});
      return;
    }
    const questions = snapShot.docs.map((doc) => ({
      id: doc.id, // ← 🔥 ドキュメントIDを含める
      ...doc.data(),
    }));

    console.log("Fetched questions:", questions);
    logger.info(`Questions: ${JSON.stringify(questions, null, 2)}`);

    // CORSヘッダーを追加（開発用に * で許可）
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    const errorMessage = (error instanceof Error) ?
     error.message : "Unknown error";
    res.status(500).json(
      {error: `Failed to fetch questions: ${errorMessage}`});
  }
});
