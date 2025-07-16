'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const center: [number, number] = [50.9866, 12.9716];
const LocationSelector = ({ onSelect }: { onSelect: (pos: [number, number]) => void }) => {
  useMapEvents({ click: e => onSelect([e.latlng.lat, e.latlng.lng]) });
  return null;
};
 



const SelectLocation = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const navigate = useNavigate();
  const handleSave = () => {
    if (!position) return alert('Please select a location on the map first!');
    navigate('/events', { state: { selectedPosition: position } });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        zIndex: 1000, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 16px',
        borderRadius: 8, fontSize: 16, textAlign: 'center', maxWidth: '90%',
      }}>
        Please select a location for the activity
      </div>
      <MapContainer center={center} zoom={14} scrollWheelZoom zoomControl={false} attributionControl={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationSelector onSelect={setPosition} />
        {position && <Marker position={position} />}
      </MapContainer>
      <button onClick={handleSave} style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none',
        borderRadius: 8, fontSize: 16, cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
        Save location & go back
      </button>
    </div>
  );
};

export default SelectLocation;