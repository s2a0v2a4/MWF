import React from 'react';

const mockUser = {
  username: 'Max Mustermann',
  email: 'max@example.com',
};

const Profile: React.FC = () => {
  return (
    <div>
      <h1>Profil</h1>
      <p>Nutzername: {mockUser.username}</p>
      <p>Email: {mockUser.email}</p>
    </div>
  );
};

export default Profile;
