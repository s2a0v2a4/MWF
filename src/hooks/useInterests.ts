import { useState, useEffect } from 'react';
import { fetchUserInterests, fetchInterestCategories, getSelectedCategoriesFromInterests } from '../data/interests';
import { API_BASE_URL } from '../config/api';

// Hook für das Laden der gespeicherten Interessen vom Backend
export const useUserInterests = () => {
  const [interests, setInterests] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInterests = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading user interests from backend...');
      const data = await fetchUserInterests();
      console.log('✅ Loaded interests:', data.interests || []);
      setInterests(data.interests || []);
    } catch (err) {
      setError('Failed to load interests');
      console.error('❌ Error loading interests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  // Refresh-Funktion für manuelle Aktualisierung
  const refreshInterests = () => {
    loadInterests();
  };

  return { interests, loading, error, refreshInterests };
};

// Hook für das Laden der verfügbaren Event-Kategorien
export const useEventCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchInterestCategories();
        setCategories(data.categories || []);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

// Hook für Events mit Interest-Filterung
export const useFilteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(true); // Standardmäßig alle Events anzeigen
  
  const { interests: userInterests, refreshInterests } = useUserInterests();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE_URL}/events`;
        
        if (!showAllEvents && userInterests.length > 0) {
          const categories = getSelectedCategoriesFromInterests(userInterests);
          if (categories.length > 0) {
            url += `?categories=${categories.join(',')}`;
          }
        }
        
        console.log('🔄 Map: Loading events from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        console.log('✅ Map: Loaded events:', data);
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
        console.error('❌ Map: Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [userInterests, showAllEvents]);

  return { 
    events, 
    loading, 
    error, 
    showAllEvents, 
    setShowAllEvents,
    userInterests,
    refreshInterests
  };
};
