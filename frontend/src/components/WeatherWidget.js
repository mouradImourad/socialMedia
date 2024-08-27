import React, { useEffect, useState } from 'react';
import { useOpenWeather } from 'react-open-weather';

const WeatherWidget = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });

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
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: '60189698549cddb1ae785bad285aa7e6',  
    lat: location.lat,
    lon: location.lon,
    lang: 'en',
    unit: 'imperial', 
  });

  return (
    <div>
      {isLoading && <p>Loading weather data...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
      {data && (
        <div>
          <h3>{data.name}</h3>
          <p>{data.weather[0].description}</p>
          <p>Temperature: {data.main.temp}°C</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
