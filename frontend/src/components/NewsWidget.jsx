import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsWidget = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async (countryCode = 'us') => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines`,
          {
            params: {
              country: countryCode,
              apiKey: '94067b0d27db4e48b40a5f366b4f57fd',
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

          const countryCode = 'us';
          fetchNews(countryCode);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          fetchNews();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      fetchNews();
    }
  }, []);

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card shadow-sm" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <div className="card-body">
        <h5 className="card-title">Latest News</h5>
        <ul className="list-group list-group-flush">
          {news.slice(0, 5).map((article, index) => (
            <li key={index} className="list-group-item">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-dark">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="text-center mt-3">
          <a
            href="https://newsapi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            More News
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsWidget;
