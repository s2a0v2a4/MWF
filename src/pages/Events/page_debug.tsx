'use client';
import React from 'react';
import './page.css';

const EventsPage = () => {
  console.log('EventsPage rendering...');
  
  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Events in Mittweida</h1>
        <p>Debug: Seite lädt erfolgreich</p>
      </div>
      
      <div className="debug-box">
        <h2>🔧 Debug-Modus</h2>
        <p>Wenn du das siehst, funktioniert das grundlegende Rendering.</p>
        <p>Status: ✅ React-Komponente lädt</p>
        <p>Status: ✅ CSS wird geladen</p>
        <p>Status: ✅ Routing funktioniert</p>
      </div>
    </div>
  );
};

export default EventsPage;
