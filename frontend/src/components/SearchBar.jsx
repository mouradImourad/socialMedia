// src/components/SearchBar.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        if (query.length > 2) {
            axios.get(`/api/v1/search?query=${query}`)
                .then(response => setResults(response.data))
                .catch(error => console.error('Error fetching search results:', error));
        }
    };

    return (
        <div className="search-bar">
            <input 
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="Search for users or posts..."
            />
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map(result => (
                        <li key={result.id}>{result.name || result.content}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
