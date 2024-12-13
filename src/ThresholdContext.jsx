/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { database } from './firebase-config';
import { ref, onValue, set } from 'firebase/database';

const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  const [thresholds, setThresholds] = useState({
    temp_high: 0, 
    temp_low: 0,
    tds_high: 0,
    ph_low: 0,
    ph_high: 0
    // Add other thresholds as needed
  });

  const updateThresholdsInDatabase = (updatedThresholds) => {
    const thresholdsRef = ref(database, 'thresholds');
    set(thresholdsRef, updatedThresholds);
  };

  const handleThresholdsChange = (newThresholds) => {
    setThresholds(newThresholds);
    updateThresholdsInDatabase(newThresholds);
  };

  const saveThresholds = (updatedThresholds) => {
    const thresholdsRef = ref(database, 'thresholds');
    set(thresholdsRef, updatedThresholds);
  };

  useEffect(() => {
    const thresholdsRef = ref(database, 'thresholds');
    onValue(thresholdsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setThresholds(data);
      }
    });
  }, []);

  return (
    <ThresholdContext.Provider value={{ thresholds, setThresholds: handleThresholdsChange, saveThresholds }}>
      {children}
    </ThresholdContext.Provider>
  );
};

export const useThresholdContext = () => useContext(ThresholdContext);
