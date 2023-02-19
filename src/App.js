import React, { useState, useEffect } from 'react';
import Login from './Login'
import WebPlayer from './WebPlayer';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <WebPlayer token={token} /> }
    </>
  );
}

export default App;
