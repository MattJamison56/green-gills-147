import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";

export const authenticateUser = async () => {
  try {
    const email = "mjamiso1@uci.edu"; // Replace with your email
    const password = "565656";       // Replace with your password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential.user; // Return the authenticated user
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error; // Rethrow the error for handling in MainApp
  }
};
