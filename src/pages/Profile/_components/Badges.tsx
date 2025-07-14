import React from 'react';
import { FaStar, FaHeart, FaCalendar, FaUser } from 'react-icons/fa';

const badgeStyle = {
  width: '60px',
  height: '60px',
  backgroundImage: 'url("/sechseck-Photoroom(1).jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6E6E6E',
  fontSize: '2rem',
  borderRadius: '100px',
};

const Badges = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-around', 
    // marginTop: '1.5rem', 
    width: '100%',
    background: 'linear-gradient(135deg, #FFD700 0%, #F57F17 100%)',
    padding: '1rem 0',
    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
  }}>
    {[FaStar, FaHeart, FaCalendar, FaUser].map((Icon, i) => (
      <div key={i} style={badgeStyle}><Icon /></div>
    ))}
  </div>
);

export default Badges;
