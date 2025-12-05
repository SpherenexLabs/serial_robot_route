import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOFbpbOwdren9NlNtWvRVyf4DsDf9-2H4",
  authDomain: "procart-8d2f6.firebaseapp.com",
  databaseURL: "https://procart-8d2f6-default-rtdb.firebaseio.com",
  projectId: "procart-8d2f6",
  storageBucket: "procart-8d2f6.firebasestorage.app",
  messagingSenderId: "1026838026898",
  appId: "1:1026838026898:web:56b3889e347862ca37a44b",
  measurementId: "G-RW7V299RPY"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Initialize services
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
