import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <input
      type="text"
      placeholder="Suche..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={{
        width: '95%',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        border: '1px solid #ccc',
        margin: '1rem auto',
        display: 'block'
      }}
    />
  );
};

export default SearchBar;
