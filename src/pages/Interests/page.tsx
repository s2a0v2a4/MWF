import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveInterests } from './saveInterests';
import './InterestSelection.css';

const interests = [
  { id: 1, name: 'Wandern', icon: '🥾' },
  { id: 2, name: 'Schwimmen', icon: '🏊‍♀️' },
  { id: 3, name: 'Radfahren', icon: '🚴‍♂️' },
  { id: 4, name: 'Picknick', icon: '🧺' },
  { id: 5, name: 'Theater', icon: '🎭' },
  { id: 6, name: 'Hunde', icon: '🐕' },
  { id: 7, name: 'Musik', icon: '🎵' },
  { id: 8, name: 'Kochen', icon: '👨‍🍳' },
  { id: 9, name: 'Lesen', icon: '📚' },
  { id: 10, name: 'Fotografie', icon: '📸' },
  { id: 11, name: 'Gaming', icon: '🎮' },
  { id: 12, name: 'Kunst', icon: '🎨' },
  { id: 13, name: 'Reisen', icon: '✈️' },
  { id: 14, name: 'Yoga', icon: '🧘‍♀️' },
  { id: 15, name: 'Tanzen', icon: '💃' },
  { id: 16, name: 'Fitness', icon: '💪' },
  { id: 17, name: 'Filme', icon: '🎬' },
  { id: 18, name: 'Kaffee', icon: '☕' },
];

export default function InterestSelectionPage() {
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleInterest = (id: number) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(interestId => interestId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError('Bitte wählen Sie mindestens ein Interesse aus.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveInterests(selectedInterests);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error saving interests:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
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
        <h1>Wählen Sie Ihre Interessen</h1>
        <p className="subtitle">Mindestens ein Interesse auswählen</p>
        
        {error && (
          <div className="error-message">
            {error}
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
