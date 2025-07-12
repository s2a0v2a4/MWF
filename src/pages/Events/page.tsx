// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import useSWR from 'swr';
// import { useNavigate, useLocation } from 'react-router-dom';

// type Event = {
//   id: string;
//   name: string;
//   position: [number, number];
//   participants: number;
//   time: string; // Format HH:mm
//   type: string;
// };

// const TYPES = ['Swimming', 'Picnic', 'Cycling', 'Theater', 'Hiking', 'Walking the dog'];

// const fetcher = (url: string) => fetch(url).then(res => res.json());

// const EventsPage = () => {
//   const { data: events, mutate } = useSWR<Event[]>('http://localhost:3000/api/events', fetcher);

//   const [form, setForm] = useState<Omit<Event, 'id'>>({
//     name: '',
//     position: [51.1305, 13.0807],
//     participants: 0,
//     time: '', // speichern als "HH:mm"
//     type: '',
//   });

//   // Für Zeit: wir speichern 4 einzelne Strings für HHmm, damit man einfach editieren kann
//   const [timeParts, setTimeParts] = useState(['', '', '', '']); // H1, H2, m1, m2
//   const [timeFocusedIndex, setTimeFocusedIndex] = useState(0);

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
//       setForm(f => ({ ...f, time: `${timeParts[0]}${timeParts[1]}:${timeParts[2]}${timeParts[3]}` }));
//     } else {
//       setForm(f => ({ ...f, time: '' }));
//     }
//   }, [timeParts]);

//   // Übernehme selectedPosition aus Location-State und lösche sie danach
//   useEffect(() => {
//     const state = location.state as { selectedPosition?: [number, number] } | null;
//     if (state?.selectedPosition) {
//       setForm(f => ({
//         ...f,
//         position: state.selectedPosition!,
//       }));
//       // State zurücksetzen, damit es nicht erneut gesetzt wird
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

//     if (form.name.trim() === '') {
//       alert('Bitte gib einen Event-Namen ein.');
//       return;
//     }
//     if (!TYPES.includes(form.type)) {
//       alert('Bitte wähle einen gültigen Typ aus.');
//       return;
//     }
//     if (!form.time.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
//       alert('Bitte gib die Zeit im Format HH:mm ein.');
//       return;
//     }
//     if (
//       !form.position ||
//       (form.position[0] === 51.1305 && form.position[1] === 13.0807)
//     ) {
//       alert('Bitte wähle einen Ort auf der Karte aus!');
//       return;
//     }

//     await fetch('http://localhost:3000/api/events', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//     mutate();

//     setForm({
//       name: '',
//       position: [51.1305, 13.0807],
//       participants: 0,
//       time: '',
//       type: '',
//     });
//     setTimeParts(['', '', '', '']);
//     setTimeFocusedIndex(0);
//   };

//   const handleJoin = async (id: string) => {
//     await fetch(`http://localhost:3000/api/events/${id}/join`, {
//       method: 'POST',
//     });
//     mutate();
//   };

//   const handleDelete = async (id: string) => {
//     await fetch(`http://localhost:3000/api/events/${id}`, {
//       method: 'DELETE',
//     });
//     mutate();
//   };

//   const handleSelectLocation = () => {
//     navigate('/selectlocation', { state: { form } });
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Events Upload, Join & List</h1>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           style={styles.input}
//           name="name"
//           placeholder="Titel des Events (z. B. Sommerpicknick)"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />

//         <select
//           style={{ ...styles.input, cursor: 'pointer' }}
//           name="type"
//           value={form.type}
//           onChange={handleChange}
//           required
//         >
//           <option value="" disabled>
//             Aktivität auswählen
//           </option>
//           {TYPES.map(t => (
//             <option key={t} value={t}>
//               {t}
//             </option>
//           ))}
//         </select>

//         {/* Teilnehmeranzahl mit Label und Eingabefeld */}
//         <div>
//           <label style={{ fontWeight: 'bold', marginBottom: 5, display: 'block', textAlign: 'center' }}>
//             Wie viele Personen kommen mit?
//           </label>
//           <input
//             type="number"
//             min={0}
//             style={{ ...styles.input, textAlign: 'center', maxWidth: 100, margin: '0 auto' }}
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

//         {/* Zeitfeld mit Label */}
//         <div>
//           <label style={{ fontWeight: 'bold', marginBottom: 5, display: 'block' }}>
//             Wähle eine Uhrzeit:
//           </label>
//           <div style={styles.timeWrapper}>
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
//                   style={{
//                     ...styles.timeInput,
//                     backgroundColor: timeFocusedIndex === i ? 'white' : '#ddd',
//                     color: timeFocusedIndex === i ? 'black' : '#555',
//                     borderColor: timeFocusedIndex === i ? '#007bff' : '#bbb',
//                   }}
//                   aria-label={`Time input part ${i + 1}`}
//                 />
//                 {(i === 1) && <span style={styles.timeSeparator}>:</span>}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//         <div>
//           <button
//             type="button"
//             style={{
//               ...styles.submitButton,
//               backgroundColor: '#6c63ff',
//               marginBottom: 10,
//             }}
//             onClick={handleSelectLocation}
//           >
//             Ort auf Karte wählen
//           </button>
//           <span style={{ marginLeft: 10, fontSize: 15 }}>
//             {form.position
//               ? `Gewählt: [${form.position[0].toFixed(4)}, ${form.position[1].toFixed(4)}]`
//               : 'Noch kein Ort gewählt'}
//           </span>
//         </div>

//         <button type="submit" style={styles.submitButton}>
//           Add Event
//         </button>
//       </form>

//       <ul style={styles.list}>
//         {events?.map(e => (
//           <li key={e.id} style={styles.listItem}>
//             <div>
//               <strong>{e.name}</strong> ({e.type}) — {e.participants} participants at {e.time}
//               <br />
//               Location: [{e.position[0].toFixed(4)}, {e.position[1].toFixed(4)}]
//             </div>
//             <div>
//               <button onClick={() => handleJoin(e.id)} style={styles.joinButton}>
//                 Join Event
//               </button>
//               <button onClick={() => handleDelete(e.id)} style={styles.deleteButton}>
//                 Delete Event
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     color: '#000',
//     maxWidth: 600,
//     margin: '40px auto',
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     backgroundColor: '#f9f9f9',
//     padding: 30,
//     borderRadius: 12,
//     boxShadow: '0 0 25px rgba(0,0,0,0.1)',
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#222',
//     fontWeight: '900',
//     fontSize: 28,
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 15,
//   },
//   input: {
//     padding: '12px 15px',
//     fontSize: 16,
//     borderRadius: 8,
//     border: '1.5px solid #ccc',
//     outline: 'none',
//     transition: 'border-color 0.3s ease',
//   },
//   participantsWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 20,
//   },
//   participantsButton: {
//     backgroundColor: '#6c63ff',
//     border: 'none',
//     borderRadius: '50%',
//     width: 36,
//     height: 36,
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     userSelect: 'none',
//     transition: 'background-color 0.2s ease',
//   },
//   participantsNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     width: 40,
//     textAlign: 'center',
//   },
//   timeWrapper: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 10,
//   },
//   timeInput: {
//     width: 30,
//     height: 30,
//     fontSize: 20,
//     textAlign: 'center',
//     borderRadius: 6,
//     border: '1.5px solid #bbb',
//     outline: 'none',
//   },
//   timeSeparator: {
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   submitButton: {
//     backgroundColor: '#6c63ff',
//     color: 'white',
//     borderRadius: 10,
//     border: 'none',
//     padding: '12px 20px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     fontSize: 16,
//     transition: 'background-color 0.3s ease',
//   },
//   list: {
//     marginTop: 40,
//     padding: 0,
//     listStyle: 'none',
//   },
//   listItem: {
//     marginBottom: 20,
//     backgroundColor: 'white',
//     padding: 18,
//     borderRadius: 10,
//     boxShadow: '0 0 10px rgba(0,0,0,0.05)',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   joinButton: {
//     backgroundColor: '#6c63ff',
//     border: 'none',
//     padding: '8px 14px',
//     borderRadius: 6,
//     cursor: 'pointer',
//     color: 'white',
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   deleteButton: {
//     backgroundColor: '#ff4b4b',
//     border: 'none',
//     padding: '8px 14px',
//     borderRadius: 6,
//     cursor: 'pointer',
//     color: 'white',
//     fontWeight: 'bold',
//   },
// };

// export default EventsPage;


















 











'use client';
import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useNavigate, useLocation } from 'react-router-dom';
type Event = {
  id: string;
  name: string;
  position: [number, number];
  participants: number;
  time: string;
  type: string;
};
const TYPES = ['Swimming', 'Picnic', 'Cycling', 'Theater', 'Hiking', 'Walking the dog'];
const fetcher = (url: string) => fetch(url).then(res => res.json());
const EventsPage = () => {
  const { data: events, mutate } = useSWR<Event[]>('http://localhost:3000/api/events', fetcher);
  const [form, setForm] = useState<Omit<Event, 'id'>>({ name: '', position: [50.9866, 12.971], participants: 0, time: '', type: '' });
  const [timeParts, setTimeParts] = useState(['', '', '', '']);
  const [timeFocusedIndex, setTimeFocusedIndex] = useState(0);
  const inputsRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setForm(f => ({ ...f, time: timeParts.every(ch => ch.match(/^\d$/)) ? `${timeParts[0]}${timeParts[1]}:${timeParts[2]}${timeParts[3]}` : '' }));
  }, [timeParts]);
  useEffect(() => {
    const state = location.state as { selectedPosition?: [number, number] } | null;
    if (state?.selectedPosition) {
      setForm(f => ({ ...f, position: state.selectedPosition }));
      navigate('/events', { replace: true, state: null });
    }
  }, [location, navigate]);
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
  const handleParticipantsChange = (delta: number) => {
    setForm(f => ({ ...f, participants: Math.max(0, f.participants + delta) }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSelectLocation = () => navigate('/selectlocation');
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!form.position || (form.position[0] === 51.1305 && form.position[1] === 13.0807)) return alert('Please select a location on the map first!');
  //   if (form.name.trim() === '') return alert('Please enter a name for the event.');
  //   if (!TYPES.includes(form.type)) return alert('Please select a valid activity.');
  //   if (!form.time.match(/^([01]\d|2[0-3]):[0-5]\d$/)) return alert('Please enter a valid time in HH:mm format.');
  //   await fetch('http://localhost:3000/api/events', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(form),
  //   });
  //   mutate();
  //   setForm({ name: '', position: [51.1305, 13.0807], participants: 0, time: '', type: '' });
  //   setTimeParts(['', '', '', '']);
  //   setTimeFocusedIndex(0);
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.position || (form.position[0] === 51.1305 && form.position[1] === 13.0807)) return alert('Please select a location on the map first!');
  if (form.name.trim() === '') return alert('Please enter a name for the event.');
  if (!TYPES.includes(form.type)) return alert('Please select a valid activity.');
  if (!form.time.match(/^([01]\d|2[0-3]):[0-5]\d$/)) return alert('Please enter a valid time in HH:mm format.');
  await fetch('http://localhost:3000/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  mutate();
  setForm({ name: '', position: [51.1305, 13.0807], participants: 0, time: '', type: '' });
  setTimeParts(['', '', '', '']);
  setTimeFocusedIndex(0);
  navigate('/map');
};
  const handleJoin = async (id: string) => {
    await fetch(`http://localhost:3000/api/events/${id}/join`, { method: 'POST' });
    mutate();
  };
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/api/events/${id}`, { method: 'DELETE' });
    mutate();
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create an Event</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>1. Select location (required first step to do)</label>
        <button type="button" onClick={handleSelectLocation} style={styles.submitButton}>Select location</button>
        <span style={{ fontSize: 14, color: form.position[0] === 51.1305 && form.position[1] === 13.0807 ? 'red' : 'green' }}>
          {form.position[0] === 51.1305 && form.position[1] === 13.0807 ? 'No location selected' : `Selected: [${form.position[0].toFixed(4)}, ${form.position[1].toFixed(4)}]`}
        </span>
        <label style={styles.label}>2. Event name</label>
        <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="E.g. birthday party" />
        <label style={styles.label}>3. activity</label>
        <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
          <option value="">Choose activity</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <label style={styles.label}>4. Number of participants</label>
        <div style={styles.participantsWrapper}>
          <button type="button" onClick={() => handleParticipantsChange(-1)} style={styles.participantsButton}>-</button>
          <span style={styles.participantsNumber}>{form.participants}</span>
          <button type="button" onClick={() => handleParticipantsChange(1)} style={styles.participantsButton}>+</button>
        </div>
        <label style={styles.label}>5. Time </label>
        <div style={styles.timeWrapper}>
          {timeParts.map((ch, i) => (
            <React.Fragment key={i}>
              <input
                type="text" inputMode="numeric" maxLength={1} value={ch}
                onChange={e => handleTimeChange(i, e.target.value)}
                onFocus={() => setTimeFocusedIndex(i)} ref={inputsRefs[i]}
                style={{
                  ...styles.timeInput,
                  backgroundColor: timeFocusedIndex === i ? 'white' : '#ddd',
                  color: timeFocusedIndex === i ? 'black' : '#555',
                  borderColor: timeFocusedIndex === i ? '#007bff' : '#bbb',
                }}
              />
              {i === 1 && <span style={styles.timeSeparator}>:</span>}
            </React.Fragment>
          ))}
        </div>
        <button type="submit" disabled={form.position[0] === 51.1305 && form.position[1] === 13.0807} style={styles.submitButton}>Upload event</button>
      </form>
      <ul style={styles.list}>
        {events?.map(e => (
          <li key={e.id} style={styles.listItem}>
            <div>
              <strong>{e.name}</strong> ({e.type}) — {e.participants} people at {e.time}<br />
              Location: [{e.position[0].toFixed(4)}, {e.position[1].toFixed(4)}]
            </div>
            <div>
              <button onClick={() => handleJoin(e.id)} style={styles.joinButton}>Join</button>
              <button onClick={() => handleDelete(e.id)} style={styles.deleteButton}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
  input: { padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' },
  participantsWrapper: { display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' },
  participantsButton: { fontSize: 20, width: 30, height: 30, borderRadius: '50%', border: '1px solid #333', cursor: 'pointer' },
  participantsNumber: { fontSize: 18, minWidth: 30, textAlign: 'center' },
  timeWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 },
  timeInput: { width: 30, height: 30, fontSize: 20, textAlign: 'center', borderRadius: 4, border: '1px solid #bbb' },
  timeSeparator: { fontSize: 20, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#007bff', color: 'white', padding: '10px 15px', fontSize: 16, borderRadius: 5, border: 'none', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, marginTop: 30 },
  listItem: { padding: 10, border: '1px solid #ccc', marginBottom: 10, borderRadius: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  joinButton: { backgroundColor: '#28a745', border: 'none', padding: '6px 10px', borderRadius: 4, color: 'white', cursor: 'pointer', marginRight: 5 },
  deleteButton: { backgroundColor: '#dc3545', border: 'none', padding: '6px 10px', borderRadius: 4, color: 'white', cursor: 'pointer' },
};
export default EventsPage;