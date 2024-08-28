// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const YouTubeWidget = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//           params: {
//             part: 'snippet',
//             maxResults: 5,
//             q: 'latest news', 
//             key: 'AIzaSyAqLTZyHKB2qCa51CSsOaJH0PZZF8jQ_PU', 
//           },
//         });
//         setVideos(response.data.items);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching videos.');
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   if (loading) return <div>Loading videos...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="card shadow-sm">
//       <div className="card-body">
//         <h5 className="card-title">YouTube Videos</h5>
//         <ul className="list-group">
//           {videos.map((video) => (
//             <li key={video.id.videoId} className="list-group-item">
//               <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
//                 {video.snippet.title}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default YouTubeWidget;
