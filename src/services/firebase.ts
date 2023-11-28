import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  databaseURL: import.meta.env.VITE_FIREBASE_REALTIME_DATABASE,
});

const db = getDatabase(firebaseApp);

export const isLiveRef = ref(db, "livestream");
