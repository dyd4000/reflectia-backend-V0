import * as admin from "firebase-admin";

// firebase admin sdkを初期化
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
admin.initializeApp({projectId: "reflectia-bcc47"});

const db = admin.firestore();

/**
 * Firestoreにデータをシードする関数
 */
async function seedFirestore() {
  console.log("Start seeding Firestore...");
  const questionsRef = db.collection("questions");
  const seedData = [
    {
      id: "1",
      sourceOfIdeas: ["book", "conversation", "observation", "experience"],
      content: "Is this an idea?",
      tags: ["philosophy", "existentialism"],
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      id: "2",
      userID: "user_456",
      sourceOfIdeas: ["article"],
      content: "How do you learn a new programming language?",
      tags: ["technology", "learning"],
      createdAt: admin.firestore.Timestamp.now(),
    },
  ];

  for (const question of seedData) {
    try {
      await questionsRef.doc(question.id.toString()).set(question);
      console.log(`Question ${question.id} seeded.`);
    } catch (error) {
      console.error(`Failed to seed question ${question.id}.`, error);
    }
  }
  console.log("Firestore seeding completed.");
}

seedFirestore().catch(console.error);
