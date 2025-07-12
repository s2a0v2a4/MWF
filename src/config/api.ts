const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api'
}

export const API_BASE_URL = getApiUrl()

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  
  console.log(`🔗 API Call: ${options.method || 'GET'} ${url}`)
  
  return fetch(url, { ...defaultOptions, ...options })
}
