import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeftSidebar.css';

const LeftSidebar = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const getWeatherEmoji = (weatherCondition) => {
    if (weatherCondition.includes('rain')) return '🌧️';
    if (weatherCondition.includes('cloud')) return '☁️';
    if (weatherCondition.includes('clear')) return '☀️';
    if (weatherCondition.includes('snow')) return '❄️';
    return '🌤️';  // Default emoji for other weather conditions
  };

  useEffect(() => {
    const API_KEY = '642f5e4bfc02c258e68242c4549917e9';  // Replace with your OpenWeatherMap API key
    const city = 'London';  // Or any other city you'd like to display

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(response => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="weather">Loading weather...</div>;
  }

  const weatherCondition = weather.weather[0].description;
  const weatherEmoji = getWeatherEmoji(weatherCondition);

  return (
    <div className="sidebar">
      <div className="weather sidebar-widget">
        <h3 className="widget-title">Weather in {weather.name}</h3>
        <div className="emoji">{weatherEmoji}</div>
        <div className="widget-info weather-temperature">{weather.main.temp}°C</div>
        <p className="widget-info weather-description">{weatherCondition}</p>
      </div>
    </div>
  );
};

export default LeftSidebar;
