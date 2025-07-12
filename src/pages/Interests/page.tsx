import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { apiCall } from '../../config/api';
import { interests } from '../../data/interests';
import './InterestSelection.css';

export default function InterestSelectionPage() {
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // SWR-basierte Mutation Funktion für das Speichern der Interessen
  const saveInterests = async (interestsToSave: number[]) => {
    console.log('🔄 SWR Mutation: Saving interests:', interestsToSave);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall('/interests', {
        method: 'POST',
        body: JSON.stringify({ interests: interestsToSave }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(`HTTP ${response.status}: ${result.error || result.message || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('✅ SWR Mutation: Successfully saved interests:', result);
      
      // SWR Cache für Interests invalidieren
      await mutate('http://localhost:5000/api/interests');
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (id: number) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(interestId => interestId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError(new Error('Please select at least one interest.'));
      return;
    }

    try {
      await saveInterests(selectedInterests);
      // Setze Flag für Map-Seite, dass Interessen geändert wurden
      localStorage.setItem('interestsChanged', 'true');
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error saving interests:', err);
      // Error wird bereits in saveInterests gesetzt
    }
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Erfolgreich gespeichert!</h2>
          <p>Ihre Interessen wurden erfolgreich übermittelt.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="interest-page">
      <div className="container">
        <h1>Select Your Interests</h1>
        <p className="subtitle">Select at least one interest</p>
        
        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}

        {!error && selectedInterests.length === 0 && (
          <div className="validation-message">
            Please select at least one interest.
          </div>
        )}

        <div className="interests-grid">
          {interests.map(({ id, name, icon }) => {
            const isSelected = selectedInterests.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleInterest(id)}
                className={`interest-card ${isSelected ? 'selected' : ''}`}
                disabled={isLoading}
              >
                <div className="interest-icon">{icon}</div>
                <div className="interest-name">{name}</div>
              </button>
            );
          })}
        </div>

        <div className="action-section">
          <div className="selected-count">
            {selectedInterests.length} Interesse{selectedInterests.length !== 1 ? 'n' : ''} ausgewählt
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedInterests.length === 0}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Speichern...
              </>
            ) : (
              'Interessen speichern'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
