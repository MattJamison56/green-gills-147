/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useThresholdContext } from './ThresholdContext';
import { useNotificationContext } from './NotificationContext';
import PageContainer from './components/pagecontainer/pagecontainer';
import { fetchData } from './services/dataservice';
import { checkThresholds } from './services/thresholdservice';
import { authenticateUser } from './firebase-auth';

const MainApp = () => {
  const [data, setData] = useState({ temp: [], ph: [], tds: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const { thresholds } = useThresholdContext();
  const { addNotification } = useNotificationContext();

  // Ref to track already notified breach IDs
  const notifiedIds = useRef(new Set());

  // Authenticate user on load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        //console.log("Authenticating user...");
        await authenticateUser();
        //console.log("User authenticated.");
        setIsAuthenticated(true); // Mark authentication success
      } catch (error) {
        console.error("Authentication failed:", error.message);
      } finally {
        setLoading(false); // Stop loading whether auth succeeds or fails
      }
    };

    initializeApp();
  }, []);

  // Set up database listeners if authenticated
  useEffect(() => {
    if (!isAuthenticated) return; // Wait for authentication
    //console.log("Setting up database listeners...");

    const dataRefs = [
      { name: "temp", path: "pond1/temperatureData" },
      { name: "ph", path: "pond1/phData" },
      { name: "tds", path: "pond1/tdsData" }
    ];

    const dataListeners = {};

    dataRefs.forEach((dataRef) => {
      const unsubscribe = fetchData(dataRef.path, (loadedRows) => {
        setData(prevData => {
          const newData = {
            ...prevData,
            [dataRef.name]: loadedRows
          };
          return newData;
        });
      }, 100);

      dataListeners[dataRef.name] = unsubscribe;
    });

    return () => {
      Object.values(dataListeners).forEach(unsubscribe => unsubscribe());
    };
  }, [isAuthenticated]);

  // Check thresholds when data changes
  useEffect(() => {
    Object.keys(data).forEach(key => {
      checkThresholds(data[key], thresholds, addNotification, notifiedIds.current);
    });
  }, [data, thresholds]);

  if (loading) return <div>Loading...</div>; // Show a loading screen if not ready
  if (!isAuthenticated) return <div>Authentication failed. Please check credentials.</div>;

  return <PageContainer data={data} />;
};

export default MainApp;
