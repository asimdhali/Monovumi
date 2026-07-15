import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPFJBrIrJdxsRu9dItUAGzM69MoTiGZqo",
  authDomain: "monovumi-461f9.firebaseapp.com",
  projectId: "monovumi-461f9",
  storageBucket: "monovumi-461f9.firebasestorage.app",
  messagingSenderId: "101960462287",
  appId: "1:101960462287:web:2c1f899ff139d2acc76cba",
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
