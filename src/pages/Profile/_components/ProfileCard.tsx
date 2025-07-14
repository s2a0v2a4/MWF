import React from 'react';

interface ProfileCardProps {
  name: string;
  eventsJoined: number;
  eventsCreated: number;
  profileLikes: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  eventsJoined,
  eventsCreated,
  profileLikes
}) => {
  return (
    <div style={{
      backgroundColor: '#388E3C',
      width: '100%',
      padding: '1.5rem',
      borderRadius: '1rem',
      color: 'white',
      fontFamily: 'sans-serif',
    }}>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          overflow: 'hidden',
          justifySelf: 'center',
        }}>
          <img
            src="/pp.png"
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
        }}>
          {name}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '1.5rem',
        textAlign: 'center',
      }}>
        {[['Events joined', eventsJoined], ['Events created', eventsCreated], ['Profile likes', profileLikes]].map(([label, value], i) => (
          <div key={i}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
            <div style={{ fontSize: '0.9rem', color: '#eee' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
