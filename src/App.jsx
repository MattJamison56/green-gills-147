import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThresholdProvider } from './ThresholdContext';
import MainApp from './MainApp';
import { NotificationProvider } from './NotificationContext';

function App() {
  return (
    <>
      {/* Threshold Provider allows the transfer of information from the settings page down to the dashboard */}
      <NotificationProvider>
      <ThresholdProvider>
        <MainApp />
        <ToastContainer />
      </ThresholdProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
