import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/Map/page';
import ProfilePage from './pages/Profile/page';
import EventsPage from './pages/Events/page'; 
import SimpleEventsPage from './pages/Events/page-simple';
import EventAdmin from './pages/EventAdmin/page';
import SelectLocation from './pages/Events/map';
import NameInputPage from './pages/Login/page';
import InterestSelectionPage from './pages/Interests/page';

// Simple fallback component for debugging
const DebugPage = () => (
  <div style={{padding: '20px', color: 'black', background: 'white'}}>
    <h1>Debug Page</h1>
    <p>If you see this, the routing works!</p>
    <a href="/map">Go to Map</a> | <a href="/events">Go to Events</a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin" element={<EventAdmin />} />
          <Route path="/selectlocation" element={<SelectLocation />} />
          <Route path="/login" element={<NameInputPage />} />
          <Route path="/interests" element={<InterestSelectionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
