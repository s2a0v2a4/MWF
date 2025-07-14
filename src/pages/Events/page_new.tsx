// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { interests } from '../../data/interests';
// import useSWR from 'swr';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './page.css';

// type Event = {
//   id: string;
//   name: string;
//   position: [number, number];
//   participants: number;
//   time: string;
//   type: string;
// };

// // Alle verfügbaren Event-Typen aus den Interessen
// const TYPES = interests
//   .filter(interest => interest.category !== null)
//   .map(interest => interest.category) as string[];

// const fetcher = (url: string) => fetch(url).then(res => res.json());

// const EventsPage = () => {
//   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//   const { data: events, mutate } = useSWR<Event[]>(`${apiUrl}/api/events`, fetcher);
  
//   // Mittweida Koordinaten als Standard
//   const [form, setForm] = useState<Omit<Event, 'id'>>({
//     name: '',
//     position: [50.9866, 12.971], // Mittweida Koordinaten
//     participants: 0,
//     time: '',
//     type: ''
//   });

//   const [timeParts, setTimeParts] = useState(['', '', '', '']); // H1, H2, m1, m2
//   const [timeFocusedIndex, setTimeFocusedIndex] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const inputsRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Synchronisiere zusammengesetzte Zeit mit form.time
//   useEffect(() => {
//     if (timeParts.every(ch => ch.match(/^\d$/))) {
//       setForm(f => ({ 
//         ...f, 
//         time: `${timeParts[0]}${timeParts[1]}:${timeParts[2]}${timeParts[3]}` 
//       }));
//     } else {
//       setForm(f => ({ ...f, time: '' }));
//     }
//   }, [timeParts]);

//   // Übernehme selectedPosition aus Location-State
//   useEffect(() => {
//     const state = location.state as { selectedPosition?: [number, number] } | null;
//     if (state?.selectedPosition) {
//       setForm(f => ({
//         ...f,
//         position: state.selectedPosition!,
//       }));
//       // State zurücksetzen
//       navigate(location.pathname, { replace: true, state: null });
//     }
//   }, [location, navigate]);

//   const handleTimeChange = (index: number, value: string) => {
//     const val = value.slice(-1);
//     if (!val.match(/^\d$/) && val !== '') return;

//     const newParts = [...timeParts];
//     newParts[index] = val;
//     setTimeParts(newParts);

//     if (val !== '' && index < inputsRefs.length - 1) {
//       inputsRefs[index + 1].current?.focus();
//       setTimeFocusedIndex(index + 1);
//     }
//   };

//   const handleTimeFocus = (index: number) => {
//     setTimeFocusedIndex(index);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     if (name === 'name') {
//       setForm(f => ({ ...f, name: value }));
//     } else if (name === 'type') {
//       setForm(f => ({ ...f, type: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validierung
//       if (form.name.trim() === '') {
//         alert('Please enter an event name.');
//         return;
//       }
//       if (!TYPES.includes(form.type)) {
//         alert('Please select a valid activity.');
//         return;
//       }
//       if (!form.time.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
//         alert('Please enter the time in the correct format .');
//         return;
//       }
//       if (!form.position || (form.position[0] === 50.9866 && form.position[1] === 12.971)) {
//         alert('Please select a location on the map!');
//         return;
//       }

//       await fetch(`${apiUrl}/api/events`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
      
//       mutate();

//       // Formular zurücksetzen
//       setForm({
//         name: '',
//         position: [50.9866, 12.971],
//         participants: 0,
//         time: '',
//         type: '',
//       });
//       setTimeParts(['', '', '', '']);
//       setTimeFocusedIndex(0);
      
//       alert('Event successfully created!');
//     } catch (error) {
//       console.error('Error creating event', error);
//       alert('Error creating event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleJoin = async (id: string) => {
//     try {
//       await fetch(`${apiUrl}/api/events/${id}/join`, {
//         method: 'POST',
//       });
//       mutate();
//     } catch (error) {
//       console.error('Error joining:', error);
//       alert('Error joining. Please try again.');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Do you really want to delete this event?')) return;
    
//     try {
//       await fetch(`${apiUrl}/api/events/${id}`, {
//         method: 'DELETE',
//       });
//       mutate();
//     } catch (error) {
//       console.error('Error deleting:', error);
//       alert('FError deleting. Please try again.');
//     }
//   };

//   const handleSelectLocation = () => {
//     navigate('/map', { state: { selectMode: true, returnTo: '/events' } });
//   };

//   return (
//     <div className="events-container">
//       <div className="events-header">
//         <h1>Events in Mittweida</h1>
//         <p>Create new events or join existing events</p>
//       </div>

//       <form onSubmit={handleSubmit} className="events-form">
//         <div className="form-group">
//           <label htmlFor="name">Event Name</label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             placeholder="e.g. birthday barbecue in the park"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="type">Activity</label>
//           <select
//             id="type"
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled>
//               Select activity
//             </option>
//             {TYPES.map(t => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Number of participants</label>
//           <input
//             type="number"
//             min={0}
//             value={form.participants}
//             onChange={(e) =>
//               setForm(f => ({
//                 ...f,
//                 participants: Math.max(0, parseInt(e.target.value) || 0),
//               }))
//             }
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Uhrzeit</label>
//           <div className="time-input-wrapper">
//             {timeParts.map((ch, i) => (
//               <React.Fragment key={i}>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={ch}
//                   onChange={e => handleTimeChange(i, e.target.value)}
//                   onFocus={() => handleTimeFocus(i)}
//                   ref={inputsRefs[i]}
//                   className={`time-input ${timeFocusedIndex === i ? 'focused' : ''}`}
//                   aria-label={`Zeit Eingabe Teil ${i + 1}`}
//                 />
//                 {(i === 1) && <span className="time-separator">:</span>}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Location</label>
//           <div className="location-selector">
//             <button
//               type="button"
//               onClick={handleSelectLocation}
//               className="location-button"
//             >
//               📍 Select location on map
//             </button>
//             <span className="location-display">
//               {form.position && (form.position[0] !== 50.9866 || form.position[1] !== 12.971)
//                 ? `Gewählt: [${form.position[0].toFixed(4)}, ${form.position[1].toFixed(4)}]`
//                 : 'Noch kein Ort gewählt'}
//             </span>
//           </div>
//         </div>

//         <button 
//           type="submit" 
//           className="submit-button"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? '⏳ Erstelle Event...' : '✨ Event erstellen'}
//         </button>
//       </form>

//       <div className="events-list-section">
//         <h2>Aktuelle Events</h2>
//         {!events && <div className="loading">Lade Events...</div>}
//         {events && events.length === 0 && (
//           <div className="no-events">
//             <p>Noch keine Events vorhanden. Sei der erste und erstelle ein Event!</p>
//           </div>
//         )}
//         <ul className="events-list">
//           {events?.map(e => (
//             <li key={e.id} className="events-list-item">
//               <div className="event-info">
//                 <h3>{e.name}</h3>
//                 <div className="event-details">
//                   <span className="event-type">🏃 {e.type}</span>
//                   <span className="event-time">🕐 {e.time}</span>
//                   <span className="event-participants">👥 {e.participants} Teilnehmer</span>
//                 </div>
//                 <div className="event-location">
//                   📍 [{e.position[0].toFixed(4)}, {e.position[1].toFixed(4)}]
//                 </div>
//               </div>
//               <div className="event-actions">
//                 <button 
//                   onClick={() => handleJoin(e.id)} 
//                   className="join-button"
//                 >
//                   🤝 Beitreten
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(e.id)} 
//                   className="delete-button"
//                 >
//                   🗑️ Löschen
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default EventsPage;
