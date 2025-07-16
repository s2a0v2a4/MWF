import useSWR from 'swr';
import { deleteEvent, type BackendEvent } from '../../config/api';
import './EventAdmin.css';
const fetcher = async (url: string): Promise<BackendEvent[]> => {
  console.log('SWR Fetcher: Fetching from:', url);
  const response = await fetch(url);
  console.log('SWR Fetcher: Response status:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('SWR Fetcher: Error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  console.log('SWR Fetcher: Successfully fetched', data.length, 'events');
  return data;
};
const EventAdmin = () => {
  const {
    data: events,
    error: swrError,
    isLoading,
    mutate
  } = useSWR<BackendEvent[]>('http://localhost:5000/api/events', fetcher, {
    refreshInterval: 30000, // Auto-refresh alle 30 Sekunden
    revalidateOnFocus: true, // Revalidate wenn Fenster Fokus bekommt
    dedupingInterval: 5000, // Deduplication interval
    errorRetryCount: 3, // Retry 3 mal bei Fehlern
    onError: (err) => {
      console.error('SWR Error:', err);
    },
    onSuccess: (data) => {
      console.log('SWR Success: Loaded', data?.length || 0, 'events');
    }
  });
  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm(`Are you sure you want to delete event with ID ${eventId}?`)) {
      return;
    }
    try {
      console.log('Deleting event:', eventId);
      await deleteEvent(eventId);
      console.log('Event deleted successfully');
      await mutate();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Failed to delete event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    await mutate();
  };
  const testDirectFetch = async () => {
    try {
      console.log('Testing direct fetch...');
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      console.log('Direct fetch result:', data);
      alert(`Direct fetch successful! Found ${data.length} events`);
    } catch (err) {
      console.error('Direct fetch failed:', err);
      alert(`Direct fetch failed: ${err}`);
    }
  };
  return (
    <div className="event-admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Event Administration</h1>
          <p>Manage events from backend (http://localhost:5000/api/events)</p>
          <div className="admin-actions">
            <button 
              onClick={handleRefresh} 
              className="refresh-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh Events (SWR)'}
            </button>
            <button 
              onClick={testDirectFetch}
              className="refresh-btn test-fetch-btn"
              disabled={isLoading}
            >
              Test Direct Fetch
            </button>
          </div>
        </div>
        {swrError && (
          <div className="error-message">
            {swrError.message}
          </div>
        )}
        <div className="events-overview">
          <h2>Backend Events Overview</h2>
          
          {isLoading ? (
            <div className="loading-message">
              Loading events from backend...
            </div>
          ) : !events || events.length === 0 ? (
            <div className="no-events-message">
              No events found in backend.<br/>
              <small>Backend URL: <code>http://localhost:5000/api/events</code></small>
            </div>
          ) : (
            <>
              <div className="events-stats">
                <div className="stat-item">
                  <strong>Total Events:</strong> {events?.length || 0}
                </div>
                <div className="stat-item">
                  <strong>Backend URL:</strong> http://localhost:5000/api/events
                </div>
              </div>
              <div className="events-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Time</th>
                      <th>Participants</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events?.map((event) => (
                      <tr key={event.id}>
                        <td className="event-id">
                          <strong>#{event.id}</strong>
                        </td>
                        <td className="event-title">
                          {event.title}
                        </td>
                        <td className="event-category">
                          <span className="category-badge">
                            {event.category}
                          </span>
                        </td>
                        <td className="event-type">
                          {event.type || 'N/A'}
                        </td>
                        <td className="event-time">
                          {event.time}
                        </td>
                        <td className="event-participants">
                          {event.participants || 0}
                        </td>
                        <td className="event-description">
                          <div className="description-text">
                            {event.description}
                          </div>
                        </td>
                        <td className="event-actions">
                          <button 
                            onClick={() => event.id && handleDeleteEvent(event.id)}
                            className="delete-btn"
                            title="Delete this event"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="admin-info">
          <h3>Information</h3>
          <ul>
            <li><strong>Backend URL:</strong> http://localhost:5000/api/events</li>
            <li><strong>Delete API:</strong> DELETE /api/events/:id</li>
            <li><strong>Auto-refresh:</strong> Events reload after deletion</li>
            <li><strong>Safety:</strong> Confirmation required before deletion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default EventAdmin;
export type BackendEvent = {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  type: string;
  participants: number;
  latitude: number;              
  longitude: number;             
}
type FrontendEvent = {
  name: string;
  description?: string;
  category?: string;
  time: string;
  type: string;
  participants?: number;
  position: [number, number];
}
const typeToCategoryMap: Record<string, string> = {
  'Walking': 'Sport',
  'Cycling': 'Sport',
  'Swimming': 'Sport',
  'Hiking': 'Sport',
  'Theater': 'Culture',
  'Picnic': 'Social'
};
export const mapToBackendFormat = (frontendEvent: FrontendEvent): Omit<BackendEvent, 'id'> => ({
  title: frontendEvent.name,
  description: frontendEvent.description || `${frontendEvent.type} Event in Mittweida`,
  category: frontendEvent.category || typeToCategoryMap[frontendEvent.type] || 'Sport',
  time: frontendEvent.time,
  type: frontendEvent.type,
  participants: frontendEvent.participants || 0,
  latitude: frontendEvent.position[0],   // GPS aus position array
  longitude: frontendEvent.position[1]   // GPS aus position array
})