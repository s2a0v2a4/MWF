// import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { useEffect, useRef, useState } from 'react';
// import './_components/MapPage.css';

// const activityIcons = {
//   Swimming: '/icons/outline/swimming.svg',
//   Picnic: '/icons/outline/picnic.svg',
//   Cycling: '/icons/outline/cycling.svg',
//   Theater: '/icons/outline/theater.svg',
//   Hiking: '/icons/outline/hiking.svg',
//   Dog: '/icons/outline/dog.svg',
// };

// const activityColors = {
//   Swimming: '#007BFF',
//   Picnic: '#28A745',
//   Cycling: '#2ECC71',
//   Theater: '#FF4136',
//   Hiking: '#1E8449',
//   Dog: '#117A65',
// };

// const FlyToActivity = ({ position }: { position: [number, number] | null }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (position) {
//       map.flyTo(position, 16, { duration: 1.5 });
//     }
//   }, [position, map]);
//   return null;
// };

// // Neu: MapClickHandler schließt aktive Activity beim Klick auf Map
// const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
//   useMapEvent('click', () => {
//     onClick();
//   });
//   return null;
// };

// type Activity = {
//   id: string;
//   position: [number, number];
//   name: string;
//   people: number;
//   time: string;
//   type: string;
//   comments: string[];
// };

// type View = 'explore' | 'foryou';

// const MapPage = () => {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
//   const [savedActivities, setSavedActivities] = useState<string[]>([]);
//   const [view, setView] = useState<View>('explore');
//   const [commentInput, setCommentInput] = useState('');
//   const [filterTime, setFilterTime] = useState<string>('');
//   const [filterPeople, setFilterPeople] = useState<number | ''>('');
//   const [showFilters, setShowFilters] = useState(false);

//   const markerRefs = useRef<(L.Marker | null)[]>([]);

//   useEffect(() => {
//     document.title = 'Map | Explore Mittweida';

//     const baseLat = 51.1305;
//     const baseLng = 13.0807;
//     const baseActivities: Activity[] = [
//       { id: '1', position: [baseLat, baseLng], name: 'Swimming', people: 3, time: 'now', type: 'Swimming', comments: [] },
//       { id: '2', position: [51.1312, 13.0815], name: 'Picnic', people: 7, time: 'now there', type: 'Picnic', comments: [] },
//       { id: '3', position: [51.132, 13.078], name: 'Cycling', people: 1, time: 'tomorrow', type: 'Cycling', comments: [] },
//       { id: '4', position: [51.133, 13.079], name: 'Theater', people: 13, time: 'another time', type: 'Theater', comments: [] },
//       { id: '5', position: [51.1345, 13.076], name: 'Hiking', people: 8, time: 'now', type: 'Hiking', comments: [] },
//       { id: '6', position: [51.135, 13.077], name: 'Walking the dog', people: 1, time: 'now there', type: 'Dog', comments: [] },
//     ];

//     const types = Object.keys(activityIcons);
//     for (let i = 7; i <= 26; i++) {
//       const latOffset = (Math.random() - 0.5) * 0.01;
//       const lngOffset = (Math.random() - 0.5) * 0.01;
//       const type = types[Math.floor(Math.random() * types.length)];
//       baseActivities.push({
//         id: `${i}`,
//         position: [baseLat + latOffset, baseLng + lngOffset],
//         name: type + ' Event #' + i,
//         people: Math.floor(Math.random() * 15),
//         time: ['now', 'tomorrow', 'in 2 days'][Math.floor(Math.random() * 3)],
//         type,
//         comments: [],
//       });
//     }

//     setActivities(baseActivities);
//     setFilteredActivities(baseActivities);

//     const saved = localStorage.getItem('savedActivities');
//     if (saved) setSavedActivities(JSON.parse(saved));
//   }, []);

//   const applyFilters = (query: string, time: string, people: number | '') => {
//     let filtered = activities;

//     if (query.trim()) {
//       filtered = filtered.filter(
//         (a) =>
//           a.name.toLowerCase().includes(query.toLowerCase()) ||
//           a.type.toLowerCase().includes(query.toLowerCase())
//       );
//     }

//     if (time) {
//       filtered = filtered.filter((a) => a.time === time);
//     }

//     if (people !== '') {
//       filtered = filtered.filter((a) => a.people >= people);
//     }

//     setFilteredActivities(filtered);

//     if (filtered.length > 0) {
//       setActiveActivity(filtered[0]);
//       setTimeout(() => {
//         const ref = markerRefs.current[activities.findIndex(a => a.id === filtered[0].id)];
//         if (ref) ref.openPopup();
//       }, 300);
//     } else {
//       setActiveActivity(null);
//     }
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     applyFilters(query, filterTime, filterPeople);
//   };

//   const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const time = e.target.value;
//     setFilterTime(time);
//     applyFilters(searchQuery, time, filterPeople);
//   };

//   const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     const people = val === '' ? '' : Number(val);
//     setFilterPeople(people);
//     applyFilters(searchQuery, filterTime, people);
//   };

//   const clearFilters = () => {
//     setSearchQuery('');
//     setFilterTime('');
//     setFilterPeople('');
//     setFilteredActivities(activities);
//     setActiveActivity(null);
//   };

//   const toggleSaveActivity = (id: string) => {
//     const newSaved = savedActivities.includes(id)
//       ? savedActivities.filter((sid) => sid !== id)
//       : [...savedActivities, id];
//     setSavedActivities(newSaved);
//     localStorage.setItem('savedActivities', JSON.stringify(newSaved));
//   };

//   const addComment = () => {
//     if (!activeActivity || !commentInput.trim()) return;
//     const newActivities = activities.map((a) =>
//       a.id === activeActivity.id
//         ? { ...a, comments: [...a.comments, commentInput.trim()] }
//         : a
//     );
//     setActivities(newActivities);
//     setFilteredActivities(newActivities);
//     setActiveActivity({
//       ...activeActivity,
//       comments: [...activeActivity.comments, commentInput.trim()],
//     });
//     setCommentInput('');
//   };

//   const displayedActivities =
//     view === 'explore'
//       ? filteredActivities
//       : activities.filter((a) => savedActivities.includes(a.id));

//   const createIcon = (activity: Activity) => {
//     const color = activityColors[activity.type] || '#555';
//     const icon = activityIcons[activity.type] || '';
//     return L.divIcon({
//       className: '',
//       html: `
//         <div style="
//           display: flex;
//           align-items: center;
//           background: rgba(255, 255, 255, 0.9);
//           padding: 2px 6px 2px 2px;
//           border-radius: 20px;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//           font-family: sans-serif;
//           font-size: 13px;
//           font-weight: 500;
//           color: #333;
//           white-space: nowrap;
//         ">
//           <div style="
//             background-color: ${color};
//             width: 28px;
//             height: 28px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             flex-shrink: 0;
//           ">
//             <img src="${icon}" style="width: 14px; height: 14px; filter: brightness(0) invert(1);" />
//           </div>
//           <span style="margin-left: 6px;">${activity.name}</span>
//         </div>
//       `,
//       iconSize: [null, null],
//       iconAnchor: [0, 20],
//       popupAnchor: [0, -20],
//     });
//   };

//   return (
//     <div className="map-wrapper">
//       {view === 'explore' && (
//         <div className="search-container">
//           <div className="search-wrapper">
//             <img src="/icons/ui/search.svg" alt="Search" className="search-icon" />
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search here"
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//             {searchQuery && (
//               <button className="clear-button" onClick={() => handleSearch('')}>
//                 ✕
//               </button>
//             )}
//           </div>

//           <button onClick={() => setShowFilters(!showFilters)} style={{ marginTop: 8 }}>
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>

//           {showFilters ? (
//             <div className="filter-container" style={{ marginTop: 10, display: 'flex', gap: '10px', alignItems: 'center' }}>
//               <select value={filterTime} onChange={handleTimeChange} style={{ padding: '6px' }}>
//                 <option value="">All Times</option>
//                 <option value="now">Now</option>
//                 <option value="now there">Now There</option>
//                 <option value="tomorrow">Tomorrow</option>
//                 <option value="in 2 days">In 2 Days</option>
//                 <option value="another time">Another Time</option>
//               </select>
//               <input
//                 type="number"
//                 min={0}
//                 placeholder="Min People"
//                 value={filterPeople === '' ? '' : filterPeople}
//                 onChange={handlePeopleChange}
//                 style={{ width: '100px', padding: '6px' }}
//               />
//               <button onClick={clearFilters} style={{ padding: '6px 12px', cursor: 'pointer' }}>
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="filter-tags" style={{ marginTop: 10 }}>
//               {Object.keys(activityIcons).map((tag, i) => (
//                 <div key={i} className="tag" onClick={() => handleSearch(tag)}>
//                   {tag}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <div style={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
//         <MapContainer
//           center={[51.1305, 13.0807]}
//           zoom={14}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <MapClickHandler onClick={() => setActiveActivity(null)} />
//           <TileLayer
//             attribution="© OpenStreetMap"
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {activeActivity && <FlyToActivity position={activeActivity.position} />}
//           {displayedActivities.map((activity, i) => (
//             <Marker
//               key={activity.id}
//               position={activity.position}
//               icon={createIcon(activity)}
//               ref={(el) => (markerRefs.current[i] = el)}
//               eventHandlers={{
//                 click: () => setActiveActivity(activity),
//               }}
//             >
//               <Popup>
//                 <div>
//                   <strong>{activity.name}</strong>
//                   <br />
//                   👥 {activity.people} people
//                   <br />
//                   🕒 {activity.time}
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       {activeActivity && (
//         <div className="activity-detail">
//           <h2>{activeActivity.name}</h2>
//           <p><strong>Type:</strong> {activeActivity.type}</p>
//           <p><strong>People:</strong> {activeActivity.people}</p>
//           <p><strong>Time:</strong> {activeActivity.time}</p>

//           <button
//             className={`btn-save ${savedActivities.includes(activeActivity.id) ? 'saved' : ''}`}
//             onClick={() => toggleSaveActivity(activeActivity.id)}
//           >
//             {savedActivities.includes(activeActivity.id) ? 'Saved ✓' : 'Save Activity'}
//           </button>

//           <h3>Comments</h3>
//           <div className="comments-list">
//             {activeActivity.comments.length === 0 && <em>No comments yet</em>}
//             {activeActivity.comments.map((c, i) => (
//               <p key={i} className="comment">{c}</p>
//             ))}
//           </div>

//           <textarea
//             placeholder="Add a comment"
//             value={commentInput}
//             onChange={(e) => setCommentInput(e.target.value)}
//           />
//           <button onClick={addComment} className="btn-add-comment">
//             Add Comment
//           </button>
//         </div>
//       )}

//       <div className="bottom-nav">
//         <button
//           className={view === 'explore' ? 'active' : ''}
//           onClick={() => {
//             setView('explore');
//             setActiveActivity(null); // schließt Detailanzeige beim View-Wechsel
//           }}
//         >
//           Explore
//         </button>
//         <button className={view === 'foryou' ? 'active' : ''} onClick={() => setView('foryou')}>
//           For You
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MapPage;
