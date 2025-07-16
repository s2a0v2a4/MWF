'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createEvent, getEvents, joinEvent, type FrontendEvent, type BackendEvent } from '../../config/api';

type FrontendEventCreate = {
  name: string;
  type: string;
  participants: number;
  time: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
};
import './page.css';

type Event = FrontendEvent;

const EventsPage = () => {
  console.log('EventsPage rendering...');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'Walking',
    participants: 1,
    time: '',
    date: '',
    position: null as [number, number] | null
  });

  const [timeParts, setTimeParts] = useState(['', '', '', '']); // H1, H2, m1, m2
  const [timeFocusedIndex, setTimeFocusedIndex] = useState(0);

  const inputsRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const state = location.state as { selectedPosition?: [number, number] } | null;
    if (
      state?.selectedPosition &&
      Array.isArray(state.selectedPosition) &&
      state.selectedPosition.length === 2 &&
      typeof state.selectedPosition[0] === 'number' &&
      typeof state.selectedPosition[1] === 'number'
    ) {
      setForm(f => ({
        ...f,
        position: state.selectedPosition,
      }));
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);
  
  const loadEventsFromBackend = async () => {
    try {
      setIsLoadingEvents(true);
      console.log('🔄 Loading events from backend...');
      
      const backendEvents = await getEvents();
      console.log('📊 Backend events received:', backendEvents);
      console.log('📊 Number of events received:', backendEvents.length);
      
      const convertedEvents: Event[] = backendEvents.map((event: BackendEvent) => ({
        id: event.id?.toString() || Math.random().toString(),
        name: event.title,
        position: [50.9866, 12.971] as [number, number], // Dummy position, as backend doesn't store geo data yet
        participants: event.participants || 0,
        time: event.time,
        type: event.type || 'Walking'
      }));
      
      console.log('🔄 Converted events:', convertedEvents);
      console.log('🔄 Number of converted events:', convertedEvents.length);
      
      setEvents(convertedEvents);
      
    } catch (error) {
      console.error('❌ Error loading events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };
  
  useEffect(() => {
    loadEventsFromBackend();
  }, []);

  const handleJoinEvent = async (eventId: string) => {
    try {
      console.log('🤝 Joining event:', eventId);
      await joinEvent(eventId);
      await loadEventsFromBackend();
      console.log('✅ Successfully joined event and reloaded list');
    } catch (error) {
      console.error('❌ Error joining event:', error);
      alert('Failed to join event. Please try again.');
    }
  };

  useEffect(() => {
    if (timeParts.every(ch => ch.match(/^\d$/))) {
      setForm(f => ({ 
        ...f, 
        time: `${timeParts[0]}${timeParts[1]}:${timeParts[2]}${timeParts[3]}` 
      }));
    } else {
      setForm(f => ({ ...f, time: '' }));
    }
  }, [timeParts]);

  const handleTimeChange = (index: number, value: string) => {
    const val = value.slice(-1);
    if (!val.match(/^\d$/) && val !== '') return;

    const newParts = [...timeParts];
    newParts[index] = val;
    setTimeParts(newParts);

    if (val !== '' && index < inputsRefs.length - 1) {
      inputsRefs[index + 1].current?.focus();
      setTimeFocusedIndex(index + 1);
    }
  };

  const handleTimeFocus = (index: number) => {
    setTimeFocusedIndex(index);
  };

  const handleSelectLocation = () => {
    navigate('/selectlocation');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.position) {
      alert('⚠️ Please select a location on the map first! This is a required field.');
      return;
    }
    // Zusätzliche Typprüfung für Position
    if (
      !Array.isArray(form.position) ||
      form.position.length !== 2 ||
      typeof form.position[0] !== 'number' ||
      typeof form.position[1] !== 'number'
    ) {
      alert('⚠️ Position ist ungültig. Bitte wähle eine gültige Position auf der Karte.');
      return;
    }
    if (form.name.trim() === '') {
      alert('⚠️ Please enter an event name.');
      return;
    }
    if (!form.time.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
      alert('⚠️ Please enter a valid time in HH:mm format.');
      return;
    }
    if (!form.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      alert('⚠️ Please enter a valid date in YYYY-MM-DD format.');
      return;
    }
    try {
      // Explizit latitude/longitude an createEvent übergeben, nicht mehr position
      const payload: FrontendEventCreate = {
        name: form.name,
        type: form.type,
        participants: form.participants,
        time: form.time,
        date: form.date,
        latitude: form.position ? form.position[0] : null,
        longitude: form.position ? form.position[1] : null,
      };
      console.log('🚀 Creating event with data:', payload);
      await createEvent(payload as any);
      console.log('✅ Event successfully created:');
      alert(`✅ Event "${form.name}" successfully created!`);
      await loadEventsFromBackend();
      setForm({
        name: '',
        type: 'Walking',
        participants: 1,
        time: '',
        date: '',
        position: null
      });
      setTimeParts(['', '', '', '']);
      setTimeFocusedIndex(0);
      navigate('/map');
    } catch (error) {
      console.error('❌ Error creating event:', error);
      alert(`❌ Error creating event:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Events in Mittweida</h1>
        <div style={{marginTop: '15px'}}>
          {/* Admin Panel button removed */}
        </div>
      </div>

      {/* Event form with all required fields */}
      <form onSubmit={handleSubmit} className="events-form">
        <h2>Create New Event</h2>
        <div className="form-group">
          <label className="required-label">📍 Select Location (Required):</label>
          <div className="location-selector">
            <button
              type="button"
              onClick={handleSelectLocation}
              className={`location-button ${!form.position ? 'location-required' : 'location-selected'}`}
            >
              {form.position 
                ? `✅ Location selected: [${form.position[0].toFixed(4)}, ${form.position[1].toFixed(4)}]`
                : '🗺️ Select location on map (REQUIRED)'
              }
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="required-label">Event Name (Required):</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="e.g. Summer Festival in the Park"
            className="events-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Activity:</label>
          <select 
            title="Choose an activity"
            value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className="events-input"
          >
            <option value="Walking">🚶 Walking</option>
            <option value="Picnic">🧺 Picnic</option>
            <option value="Cycling">🚴 Cycling</option>
            <option value="Swimming">🏊 Swimming</option>
            <option value="Theater">🎭 Theater</option>
            <option value="Hiking">🥾 Hiking</option>
          </select>
        </div>
        <div className="form-group">
          <label>How many people will join?</label>
          <div className="participants-selector">
            <button
              type="button"
              onClick={() => setForm({...form, participants: Math.max(1, form.participants - 1)})}
              className="participants-btn"
            >
              ➖
            </button>
            <span className="participants-display">
              👥 {form.participants} {form.participants === 1 ? 'person' : 'people'}
            </span>
            <button
              type="button"
              onClick={() => setForm({...form, participants: form.participants + 1})}
              className="participants-btn"
            >
              ➕
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="required-label">Date (Required):</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="events-input"
            required
            pattern="\d{4}-\d{2}-\d{2}"
            title="Please enter a date in the format YYYY-MM-DD"
          />
        </div>
        <div className="form-group">
          <label className="required-label">Time (Required):</label>
          <div className="time-input-wrapper">
            {timeParts.map((ch, i) => (
              <React.Fragment key={i}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={ch}
                  onChange={e => handleTimeChange(i, e.target.value)}
                  onFocus={() => handleTimeFocus(i)}
                  ref={inputsRefs[i]}
                  className={`time-input ${timeFocusedIndex === i ? 'focused' : ''}`}
                  title={`Time input part ${i + 1}`}
                />
                {(i === 1) && <span className="time-separator">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button 
          type="submit"
          className="submit-button"
        >
          ✨ Create Event
        </button>
      </form>
      <div className="events-list-section">
        <h2>Current Events {isLoadingEvents && '(Loading...)'}</h2>
        <div className="events-list">
          {isLoadingEvents ? (
            <div className="loading-message">
              🔄 Loading events from backend...
            </div>
          ) : events.length === 0 ? (
            <div className="no-events-message">
              📭 No events available yet.<br/>
              <small>Create the first event or check if the backend is running on <code>localhost:5000</code>.</small>
            </div>
          ) : (
            <>
              <div className="events-debug" style={{marginBottom: '10px', padding: '5px', background: '#f0f0f0', fontSize: '12px'}}>
                📊 Showing {events.length} events from backend (http://localhost:5000/api/events)
              </div>
              {events.map(event => (
              <div key={event.id} className="events-list-item">
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <p>📅 {event.date ? (() => { const d = event.date.split('-'); return d.length === 3 ? `${d[2]}.${d[1]}.${d[0]}` : event.date; })() : 'n/a'} • 🏃 {event.type} • 🕐 {event.time} • 👥 {event.participants} participants</p>
                  <p>📍 Mittweida [{event.latitude?.toFixed(3) ?? 'n/a'}, {event.longitude?.toFixed(3) ?? 'n/a'}]</p>
                  <small className="event-id">Backend-ID: {event.id}</small>
                </div>
                <div className="event-actions">
                  <button 
                    className="join-button"
                    onClick={() => event.id ? handleJoinEvent(event.id) : alert('Event ID not available')}
                  >
                    🤝 Join
                  </button>
                </div>
              </div>
            ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
