import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/Map/page';
import ProfilePage from './pages/Profile/page';
import EventsPage from './pages/Events/page'; 
import SelectLocation from './pages/Events/map';
import NameInputPage from './pages/Login/page';
import InterestSelectionPage from './pages/Interests/page';
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/selectlocation" element={<SelectLocation />} />
          <Route path="/login" element={<NameInputPage />} />
          <Route path="/interests" element={<InterestSelectionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
