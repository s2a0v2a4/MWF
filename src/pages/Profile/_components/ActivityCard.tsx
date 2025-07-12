import React from 'react';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
interface ActivityCardProps {
  time: string;
  activity: string;
}
const ActivityCard: React.FC<ActivityCardProps> = ({ time, activity }) => (
  <div style={{
    backgroundColor: 'white',
    color: 'black',
    padding: '1rem',
    borderRadius: '12px',
    marginTop: '0.3rem',
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '170px'
  }}>
    <img
      src="/map.png"
      alt="Map"
      style={{
        borderRadius: '20%',
        width: '100px',
        height: '110px',
        objectFit: 'cover'
      }}
    />
    <div style={{ marginLeft: '2.5rem', flex: 1 }}>
      <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
        {time}
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
        {activity}
      </div>
    </div>
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      fontSize: '1rem',
      color: '#555',
      alignItems: 'center',
      paddingRight: '20px',
      minWidth: '90px',
      justifyContent: 'flex-end',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <FaThumbsUp />
        <span style={{ fontSize: '1rem', color: '#555' }}>0</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <FaComment />
        <span style={{ fontSize: '1rem', color: '#555' }}>0</span>
      </div>
    </div>
  </div>
);
export default ActivityCard;
