import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCTaGamI2OKAqab1ugQx24l8niqP17KaDY",
  authDomain: "chatroom-4da5f.firebaseapp.com",
  projectId: "chatroom-4da5f",
  storageBucket: "chatroom-4da5f.appspot.com",
  messagingSenderId: "480740222003",
  appId: "1:480740222003:web:d4ea04d51c0e034c88ef46",
  measurementId: "G-LH2ZRQW9DE",
  databaseURL: "https://chatroom-4da5f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;