import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setError("Error getting user's location.");
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeather = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat: location.lat,
                lon: location.lon,
                units: 'metric',
                appid: '60189698549cddb1ae785bad285aa7e6', 
              },
            }
          );
          setWeatherData(response.data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching weather data.');
          setLoading(false);
        }
      };
      fetchWeather();
    }
  }, [location]);

  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {weatherData ? (
        <div>
          <h3>{weatherData.name}</h3>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {weatherData.main.temp}°C</p>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
};

export default WeatherWidget;
