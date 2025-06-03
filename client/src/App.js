import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Make a GET request to your backend server
    axios.get('http://localhost:5000/')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error connecting to backend:', error);
        setMessage('Failed to connect to backend');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>CampusConnect</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
