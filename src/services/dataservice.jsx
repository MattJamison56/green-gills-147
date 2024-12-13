// Just fetches the specific data from the database and returns it as a usable object
// Used in MainApp.jsx to pull data from the parent component and disperse it downward to the children

import { database } from '../firebase-config';
import { ref, onValue, query, orderByKey, limitToLast } from "firebase/database";


/**
 * Fetches the last 'limit' number of entries from a specific Firebase Realtime Database path.
 * @param {string} dataRef - The path in the database to fetch data from.
 * @param {function} callback - A callback function to handle the fetched data.
 * @param {number} limit - The number of latest entries to fetch (default is 10).
 * @returns {function} - A function to unsubscribe from the data listener.
 */

export const fetchData = (dataRef, callback, limit = 10) => {
  // Create a reference to the desired path
  const dataReference = ref(database, dataRef);

  // Create a query to order by key and limit to last 'limit' entries
  const dataQuery = query(dataReference, orderByKey(), limitToLast(limit));

  // Set up the listener
  const unsubscribe = onValue(dataQuery, (snapshot) => {
    const data = snapshot.val();
    //console.log(`Data fetched from ${dataRef}:`, data); // Debugging log
    const organizedData = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        organizedData.push({
          id: key,
          ...data[key]
        });
      });

      // Optional: Sort the data if necessary
      // Assuming the keys are push keys and inherently ordered
      // If you need to sort by timestamp, adjust accordingly
      organizedData.sort((a, b) => {
        // Convert timestamp strings to Date objects for comparison
        return new Date(a.timestamp || a.datetime) - new Date(b.timestamp || b.datetime);
      });
    } else {
      console.warn(`No data found at path: ${dataRef}`); // Warn if path is empty
    }

    callback(organizedData);
  });

  return unsubscribe;
};
