import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsWidget = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's location (country code)
    const fetchNews = async (countryCode = 'us') => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines`,
          {
            params: {
              country: countryCode, // Use the country code here
              apiKey: '94067b0d27db4e48b40a5f366b4f57fd', // Your News API key
            },
          }
        );
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        setError('Error fetching news.');
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Here we would typically use a reverse geocoding API to convert lat/lon to a country code
          // For simplicity, let's assume we have a function that converts this (this part needs integration)
          const countryCode = 'us'; // Replace with actual logic for getting country code based on lat/lon
          fetchNews(countryCode);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          fetchNews(); // Default to 'us' if location fails
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      fetchNews(); // Default to 'us' if geolocation is not supported
    }
  }, []);

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Latest News</h5>
        <ul className="list-group">
          {news.map((article, index) => (
            <li key={index} className="list-group-item">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsWidget;
