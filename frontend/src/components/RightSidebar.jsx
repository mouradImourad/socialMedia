import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RightSidebar.css';

const RightSidebar = () => {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://v2.jokeapi.dev/joke/Any')
      .then(response => {
        const jokeData = response.data;
        if (jokeData.type === 'single') {
          setJoke(jokeData.joke);
        } else if (jokeData.type === 'twopart') {
          setJoke(`${jokeData.setup} ... ${jokeData.delivery}`);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching joke:', error);
        setJoke('Error fetching joke.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="right-sidebar">Loading joke...</div>;
  }

  return (
    <div className="right-sidebar">
      <h3>Joke of the Day</h3>
      <p>{joke}</p>
    </div>
  );
};

export default RightSidebar;
