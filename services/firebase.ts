import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCgoihYkeyL9aSdJmQXIKYEnUSW2EvYuUQ",
  authDomain: "myapp-backend-106b2.firebaseapp.com",
  projectId: "myapp-backend-106b2",
  storageBucket: "myapp-backend-106b2.firebasestorage.app",
  messagingSenderId: "597814607058",
  appId: "1:597814607058:web:3193f145eb430e9bc5010b",
  measurementId: "G-2TNLX9VY7M"
};

export const isConfigured = true;

let app;
let auth: firebase.auth.Auth | undefined;
let db: firebase.firestore.Firestore | undefined;

try {
  // Ensure we don't initialize duplicate apps (hot reload safety)
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }

  // Initialize Services
  auth = firebase.auth();
  db = firebase.firestore();

} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { auth, db };