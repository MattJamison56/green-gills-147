import { ref, get } from "firebase/database";
import { database } from '../firebase-config';

const testConnection = async () => {
  const testRef = ref(database, "/pond1");
  try {
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log("Database connected successfully!");
      console.log("Data at /pond1:", snapshot.val());
    } else {
      console.warn("Database connected, but no data found at /pond1.");
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export default testConnection;
