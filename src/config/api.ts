const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api'  // Backend Port 5000
}

export const API_BASE_URL = getApiUrl()

console.log('🔧 API Configuration:')
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 PROD mode:', import.meta.env.PROD)
console.log('🔧 Final API_BASE_URL:', API_BASE_URL)

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  
  console.log(`🔗 API Call: ${options.method || 'GET'} ${url}`)
  console.log(`🔗 API Base URL: ${API_BASE_URL}`)
  console.log(`🔗 Full URL: ${url}`)
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    console.log(`📡 Response status: ${response.status} ${response.statusText}`)
    return response
  } catch (error) {
    console.error(`❌ Network error for ${url}:`, error)
    throw error
  }
}

const typeToCategoryMap: Record<string, string> = {
  'Walking': 'Sport',
  'Picnic': 'Sport', 
  'Concert': 'Musik',
  'Exhibition': 'Kunst',
  'Sports': 'Sport',
  'Cycling': 'Sport',
  'Swimming': 'Sport',
  'Hiking': 'Sport',
  'Theater': 'Kunst'
}

// Frontend Event Type
export type FrontendEvent = {
  id?: string;
  name: string;
  position: [number, number];
  participants: number;
  time: string;
  type: string;
  description?: string;         
  category?: string;            
}

// Backend Event Type 
export type BackendEvent = {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  type: string;
  participants: number;
  latitude: number;              //  Echte GPS-Koordinaten vom Backend
  longitude: number;             //  Echte GPS-Koordinaten vom Backend
}

// 🔄 Frontend → Backend Mapping
export const mapToBackendFormat = (frontendEvent: FrontendEvent): Omit<BackendEvent, 'id'> => ({
  title: frontendEvent.name,
  description: frontendEvent.description || `${frontendEvent.type} Event in Mittweida`, // Use provided or generate description
  category: frontendEvent.category || typeToCategoryMap[frontendEvent.type] || 'Sport',
  time: frontendEvent.time,
  type: frontendEvent.type,
  participants: frontendEvent.participants,  // Direkt verwenden ohne Fallback
  latitude: frontendEvent.position[0],   // GPS-Koordinaten aus position array
  longitude: frontendEvent.position[1]  
})

// Event API 
export const createEvent = async (eventData: FrontendEvent): Promise<BackendEvent> => {
  console.log('🔍 Frontend Event Data before mapping:', eventData);
  console.log('🔍 Participants value:', eventData.participants, 'Type:', typeof eventData.participants);
  
  const backendData = mapToBackendFormat(eventData)
  
  console.log('🔄 Mapping Frontend → Backend:', { frontendEvent: eventData, backendEvent: backendData })
  console.log('🔍 Backend participants value:', backendData.participants, 'Type:', typeof backendData.participants);
  
  const response = await apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(backendData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Event creation failed: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log('✅ Event created successfully:', result)
  return result
}

export const getEvents = async (): Promise<BackendEvent[]> => {
  console.log('🔄 getEvents: Starting to fetch events...')
  
  // Add cache-busting timestamp
  const timestamp = new Date().getTime();
  const response = await apiCall(`/events?t=${timestamp}`)
  
  console.log('📡 getEvents: Response received:', {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries())
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ getEvents: Failed response:', errorText)
    throw new Error(`Failed to fetch events: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  console.log('✅ getEvents: Raw data received:', data)
  console.log('✅ getEvents: Data type:', typeof data)
  console.log('✅ getEvents: Is array:', Array.isArray(data))
  
  // Handle both array and single object responses
  let events: BackendEvent[] = []
  if (Array.isArray(data)) {
    events = data
  } else if (data && typeof data === 'object') {
    // If backend returns a single event object, wrap it in an array
    console.log('⚠️ getEvents: Backend returned single object, wrapping in array')
    events = [data]
  } else {
    console.warn('⚠️ getEvents: Unexpected data format, returning empty array')
  }
  
  console.log('✅ getEvents: Final events array:', events)
  console.log('✅ getEvents: Events count:', events.length)
  console.log('✅ getEvents: Event IDs:', events.map(e => e.id).join(', '))
  return events
}

// Join Event
export const joinEvent = async (eventId: string | number): Promise<BackendEvent> => {
  const response = await apiCall(`/events/${eventId}/join`, {
    method: 'POST'
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to join event: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log('✅ Successfully joined event:', result)
  return result
}

// Delete Event Function
export const deleteEvent = async (eventId: string | number): Promise<void> => {
  const response = await apiCall(`/events/${eventId}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to delete event: ${response.status} - ${errorText}`)
  }
  
  console.log('✅ Successfully deleted event:', eventId)
}
