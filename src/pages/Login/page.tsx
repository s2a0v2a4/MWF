import React from 'react';
import { useNavigate } from 'react-router-dom';

const NameInputPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Write your name here</h1>
      <input
        type="text"
        placeholder="Your name"
        className="border p-2 mb-4 block w-full max-w-xs"
      />
      <br>
      </br>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Select
      </button>
    </div>
  );
};

export default NameInputPage;

