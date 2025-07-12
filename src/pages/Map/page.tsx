import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./_components/MapPage.css";
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
const activityIcons: Record<string, string> = {
  Swimming: '/icons/outline/swimming.svg',
  Picnic: '/icons/outline/picnic.svg',
  Cycling: '/icons/outline/cycling.svg',
  Theater: '/icons/outline/theater.svg',
  Hiking: '/icons/outline/hiking.svg',
  Dog: '/icons/outline/dog.svg',
};
const activityColors: Record<string, string> = {
  Swimming: '#007BFF',
  Picnic: '#28A745',
  Cycling: '#2ECC71',
  Theater: '#FF4136',
  Hiking: '#1E8449',
  Dog: '#117A65',
};
type Activity = {
  id: string;
  position: [number, number];
  name: string;
  people: number;
  time: string;
  type: string;
};
const tags = ['Swimming', 'Picnic', 'Cycling', 'Theater', 'Hiking', 'Dog'];
const createIcon = (activity: Activity) => {
  const color = activityColors[activity.type] || '#555';
  const icon = activityIcons[activity.type] || '';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex; align-items: center; background: rgba(255,255,255,0.95); padding: 2px 6px 2px 2px; border-radius: 20px;  box-shadow: 0 2px 6px rgba(0,0,0,0.12); font-family: sans-serif; font-size: 13px; font-weight: 500; color: #333;  white-space: nowrap;
      ">
        <div style="
          background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        ">
          <img src="${icon}" style="width: 14px; height: 14px; filter: brightness(0) invert(1);" />
        </div>
        <span style="margin-left: 6px;">${activity.name}</span>
      </div>
    `,
    iconSize: [null, null],
    iconAnchor: [0, 20],
    popupAnchor: [0, -20],
  });
};
const LOCAL_STORAGE_KEY = 'savedEvents';
const fetcher = (url: string) => fetch(url).then(res => res.json());
const MapPage = () => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'explore' | 'safe'>('explore');
  const [saved, setSaved] = useState<Activity[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const markerRefs = useRef<(L.Marker | null)[]>([]);
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );
  const { data: activitiesRaw, mutate } = useSWR<Activity[]>('http://localhost:3000/api/events', fetcher);
  // Mappe participants auf people
  const activities = Array.isArray(activitiesRaw)
    ? activitiesRaw.map((e: any) => ({
        ...e,
        people: e.participants,
      }))
    : [];
  // Load saved events from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        setSaved([]);
      }
    }
    // Load joinedIds from localStorage
    const joinedRaw = localStorage.getItem('joinedEvents');
    if (joinedRaw) {
      try {
        setJoinedIds(JSON.parse(joinedRaw));
      } catch {
        setJoinedIds([]);
      }
    }
  }, []);
  // Save to localStorage when saved changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    localStorage.setItem('joinedEvents', JSON.stringify(joinedIds));
  }, [joinedIds]);
  const filtered = activities.filter(
    (a) =>
      (search.trim() === '' ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedTag || a.type === selectedTag)
  );
  const isSaved = (id: string) => saved.some((e) => e.id === id);
  const handleSave = (activity: Activity) => {
    if (!isSaved(activity.id)) {
      setSaved((prev) => [...prev, activity]);
    }
  };
  const handleRemove = (id: string) => {
    setSaved((prev) => prev.filter((e) => e.id !== id));
  };
  // Join-Button: Nur einmal pro Event, persistiert im LocalStorage
  const hasJoined = (id: string) => joinedIds.includes(id);
  const handleJoin = async (id: string) => {
    if (hasJoined(id)) return;
    await fetch(`http://localhost:3000/api/events/${id}/join`, { method: 'POST' });
    setJoinedIds((prev) => [...prev, id]);
    mutate();
  };
  // Klick außerhalb schließt das Menü
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);
  // Darkmode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  return (
    <div className={`map-container ${darkMode ? 'darkmode' : ''}`}>
      <nav className={`top-nav ${darkMode ? 'darkmode' : ''}`}>
        <div className="nav-content">
          <span className={`nav-title ${darkMode ? 'darkmode' : ''}`}>
            Mittweida Events Map
          </span>
          <input
            type="text"
            placeholder="Suche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`search-input ${darkMode ? 'darkmode' : ''}`}
          />
          <div className="profile-relative">
            <button
              onClick={() => setProfileMenuOpen((v) => !v)}
              className={`profile-button ${darkMode ? 'darkmode' : ''}`}
              aria-label="Profil Menü öffnen"
            >
              <span role="img" aria-label="Profil">👤</span>
            </button>
            {profileMenuOpen && (
              <div
                ref={profileMenuRef}
                className={`profile-menu ${darkMode ? 'darkmode' : ''}`}
              >
                <MenuItem label="Visit Profile" icon="👤" onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }} />
                <MenuItem label="Settings" icon="⚙️" onClick={() => { setProfileMenuOpen(false); alert('Einstellungen öffnen (Demo)'); }} />
                <MenuItem label="Presentation & Design " icon="🎨" onClick={() => { setProfileMenuOpen(false); alert('Designoptionen öffnen (Demo)'); }} />
                <MenuItem label="Help & Feedback" icon="❓" onClick={() => { setProfileMenuOpen(false); window.open('mailto:hilfe@example.com'); }} />
                <MenuItem
                  label={darkMode ? 'White Mode' : 'Dark Mode'}
                  icon={darkMode ? '🌞' : '🌙'}
                  onClick={() => { setDarkMode((d) => !d); setProfileMenuOpen(false); }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="tags-container">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`tag-button ${selectedTag === tag ? 'selected' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </nav>
      <nav className={`bottom-nav ${darkMode ? 'darkmode' : ''}`}>
        <button
          onClick={() => setActiveNav('explore')}
          className={`nav-button ${activeNav === 'explore' ? 'active' : ''}`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveNav('safe')}
          className={`nav-button ${activeNav === 'safe' ? 'active' : ''}`}
        >
          Safe
        </button>
        <button
          onClick={() => navigate('/events')}
          className="create-event-button"
        >
          <span className="create-event-icon">➕</span> Create Event
        </button>
      </nav>
      <div className="main-content">
        {activeNav === 'explore' ? (
          <MapContainer
            center={[50.9866, 12.9716]}
            zoom={14}
            className="map-container-leaflet"
            scrollWheelZoom={true}
            dragging={true}
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((activity, i) => (
              <React.Fragment key={activity.id}>
                <Circle
                  center={activity.position}
                  radius={80 + activity.people * 18}
                  pathOptions={{
                    color: activityColors[activity.type] || '#6c63ff',
                    fillColor: activityColors[activity.type] || '#6c63ff',
                    fillOpacity: 0.18,
                    opacity: 0.5,
                  }}
                  interactive={false}
                  className="event-blink-circle"
                />
                <Marker
                  position={activity.position}
                  icon={createIcon(activity)}
                  ref={(el) => { markerRefs.current[i] = el; }}
                >
                  <Popup>
                    <div className="popup-content">
                      <span className="popup-event-name">{activity.name}</span>
                      <br />
                      👥 {activity.people} Persons
                      <br />
                      🕒 {activity.time}
                      <br />
                      <span className="popup-event-type">{activity.type}</span>
                      <br />
                      <button
                        onClick={() => handleSave(activity)}
                        disabled={isSaved(activity.id)}
                        className="popup-save-button"
                      >
                        {isSaved(activity.id) ? 'Saved' : 'Save event'}
                      </button>
                      <button
                        onClick={() => handleJoin(activity.id)}
                        disabled={hasJoined(activity.id)}
                        className="popup-join-button"
                      >
                        {hasJoined(activity.id) ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        ) : (
          <div className="saved-events-container">
            <h2 className="saved-events-title">Gespeicherte Events</h2>
            {saved.length === 0 ? (
              <p className="no-events-message">You have not saved any events yet. </p>
            ) : (
              <ul className="events-list">
                {saved.map((e) => (
                  <li key={e.id} className="event-item">
                    <div className="event-info">
                      <span className="event-name">{e.name}</span> <span className="event-type">({e.type})</span>
                      <br />
                      👥 {e.people} Persons<br />
                      🕒 {e.time}
                    </div>
                    <button
                      onClick={() => handleRemove(e.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// MenüItem-Komponente
function MenuItem({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="menu-item"
      onMouseDown={e => e.preventDefault()}
    >
      <span className="menu-item-icon">{icon}</span>
      {label}
    </button>
  );
}
export default MapPage;


