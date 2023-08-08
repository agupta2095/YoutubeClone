// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged, 
    User
} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "yt-clone-akgu.firebaseapp.com",
  projectId: "yt-clone-akgu",
  appId: "1:204028752318:web:0fd8f77cfb7661c88609ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs out the user.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
   return auth.signOut();
}

/**
 * Triggers a callback when user auth state changes
 * @returns A function to unsubsrcibe callback
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}