'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createEvent, getEvents, joinEvent, type FrontendEvent, type BackendEvent } from '../../config/api';
import './page.css';

type Event = FrontendEvent;

const EventsPage = () => {
  console.log('EventsPage rendering...');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // State für Events (nur Backend-Events)
  const [events, setEvents] = useState<Event[]>([]);
  
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'Walking',
    participants: 1,
    time: '',
    date: '',  // ✅ New: Date in format YYYY-MM-DD
    position: null as [number, number] | null
  });

  // Time input state (HH:mm in separate fields)
  const [timeParts, setTimeParts] = useState(['', '', '', '']); // H1, H2, m1, m2
  const [timeFocusedIndex, setTimeFocusedIndex] = useState(0);

  const inputsRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Take selectedPosition from Location-State
  useEffect(() => {
    const state = location.state as { selectedPosition?: [number, number] } | null;
    if (state?.selectedPosition) {
      setForm(f => ({
        ...f,
        position: state.selectedPosition!,
      }));
      // Reset state
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);
  
  // 🔄 Load Events from Backend
  const loadEventsFromBackend = async () => {
    try {
      setIsLoadingEvents(true);
      console.log('🔄 Loading events from backend...');
      
      const backendEvents = await getEvents();
      console.log('📊 Backend events received:', backendEvents);
      console.log('📊 Number of events received:', backendEvents.length);
      
      // Convert Backend-Events to Frontend-Format (simplified, as position is missing)
      const convertedEvents: Event[] = backendEvents.map((event: BackendEvent) => ({
        id: event.id?.toString() || Math.random().toString(),
        name: event.title,
        position: [50.9866, 12.971] as [number, number], // Dummy position, as backend doesn't store geo data yet
        participants: event.participants || 0,
        time: event.time,
        date: event.date || new Date().toISOString().split('T')[0], // ✅ Take date or today's date as fallback
        type: event.type || 'Walking'
      }));
      
      console.log('🔄 Converted events:', convertedEvents);
      console.log('🔄 Number of converted events:', convertedEvents.length);
      
      // Show only Backend-Events
      setEvents(convertedEvents);
      
    } catch (error) {
      console.error('❌ Error loading events:', error);
      // Don't show alert, only console log
    } finally {
      setIsLoadingEvents(false);
    }
  };
  
  // Load Events on first component load
  useEffect(() => {
    loadEventsFromBackend();
  }, []);

  // 🤝 Handle Join Event
  const handleJoinEvent = async (eventId: string) => {
    try {
      console.log('🤝 Joining event:', eventId);
      
      // Call backend to join event
      await joinEvent(eventId);
      
      // Reload events to get updated participant count
      await loadEventsFromBackend();
      
      console.log('✅ Successfully joined event and reloaded list');
    } catch (error) {
      console.error('❌ Error joining event:', error);
      alert('Failed to join event. Please try again.');
    }
  };

  // Synchronize composed time with form.time
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
    
    // Validation - Position is required!
    if (!form.position) {
      alert('⚠️ Please select a location on the map first! This is a required field.');
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
    
    if (!form.date) {
      alert('⚠️ Please select a date for the event.');
      return;
    }
    
    // Check that the date is not in the past
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('⚠️ Please select a date that is today or in the future.');
      return;
    }
    
    try {
      console.log('🚀 Creating event with data:', form);
      console.log('🔍 Form participants value:', form.participants, 'Type:', typeof form.participants);
      console.log('🔍 Full form object:', JSON.stringify(form, null, 2));
      
      // Send event to backend
      const newEvent = await createEvent(form as FrontendEvent);
      
      console.log('✅ Event successfully created:', newEvent);
      alert(`✅ Event "${form.name}" successfully created!\n🆔 Event-ID: ${newEvent.id}\n📍 Category: ${newEvent.category}`);
      
      // Reload events to show the new event
      await loadEventsFromBackend();
      
      // Reset form
      setForm({
        name: '',
        type: 'Walking',
        participants: 1,
        time: '',
        date: '',  // ✅ Also reset date
        position: null
      });
      setTimeParts(['', '', '', '']);
      setTimeFocusedIndex(0);
      
      // ✅ Back to Map page after successful event creation
      console.log('🗺️ Navigating back to map...');
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
        <p>Create new events or join existing events</p>
      </div>

      {/* Event form with all required fields */}
      <form onSubmit={handleSubmit} className="events-form">
        <h2>Create New Event</h2>
        
        {/* 1. REQUIRED FIELD: Select location (top priority) */}
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

        {/* 2. Event Name */}
        <div className="form-group">
          <label className="required-label">Event Name (Required):</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="e.g. Summer festival in the park"
            className="events-input"
            required
          />
        </div>

        {/* 3. Activity */}
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

        {/* 4. Number of participants */}
        <div className="form-group">
          <label>How many people are joining?</label>
          <div className="participants-selector">
            <button
              type="button"
              onClick={() => setForm({...form, participants: Math.max(1, form.participants - 1)})}
              className="participants-btn"
            >
              ➖
            </button>
            <span className="participants-display">
              👥 {form.participants} {form.participants === 1 ? 'Person' : 'People'}
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

        {/* 5. Time */}
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
          <small className="time-hint">Format: HH:mm (e.g. 14:30)</small>
        </div>

        {/* 6. Date */}
        <div className="form-group">
          <label className="required-label">Date (Required):</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            className="events-input"
            min={new Date().toISOString().split('T')[0]}
            title="Choose the event date"
            required
          />
          <small className="date-hint">Format: YYYY-MM-DD (minimum: today)</small>
        </div>

        <button 
          type="submit"
          className="submit-button"
        >
          ✨ Create Event
        </button>
      </form>

      {/* Event List */}
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
                  <p>🏃 {event.type} • � {event.date} • �🕐 {event.time} • 👥 {event.participants} participants</p>
                  <p>📍 Mittweida [{event.position[0].toFixed(3)}, {event.position[1].toFixed(3)}]</p>
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
