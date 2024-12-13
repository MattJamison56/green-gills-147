import { useState } from 'react';
import axios from 'axios';


// THIS IS COMPLETELY AN SMS TEST FILE
const SendSMS = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const handleSendSMS = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-sms', {
        to,
        message
      });
      if (response.data.success) {
        alert('SMS sent successfully!');
      } else {
        alert('Failed to send SMS.');
      }
    } catch (error) {
      alert('Error sending SMS: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Send SMS</h1>
      <input
        type="text"
        placeholder="Recipient Phone Number"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendSMS}>Send SMS</button>
    </div>
  );
};

export default SendSMS;
