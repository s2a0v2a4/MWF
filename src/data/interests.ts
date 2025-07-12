// Mapping between Frontend interests and Backend categories
export const interestMapping = {
  1: { name: 'Hiking', icon: '🥾', category: null }, // Technology -> no events
  2: { name: 'Swimming', icon: '🏊‍♀️', category: 'Sport' },
  3: { name: 'Cycling', icon: '🚴‍♂️', category: 'Sport' },
  4: { name: 'Picnic', icon: '🧺', category: null }, // no events
  5: { name: 'Theater', icon: '🎭', category: 'Kunst' },
  6: { name: 'Dogs', icon: '🐕', category: null }, // no events
  7: { name: 'Music', icon: '🎵', category: 'Musik' },
  8: { name: 'Cooking', icon: '👨‍🍳', category: null }, // no events
  9: { name: 'Reading', icon: '📚', category: 'Kunst' },
  10: { name: 'Photography', icon: '📸', category: 'Kunst' },
  11: { name: 'Gaming', icon: '🎮', category: null }, // no events
  12: { name: 'Art', icon: '🎨', category: 'Kunst' },
  13: { name: 'Travel', icon: '✈️', category: null }, // no events
  14: { name: 'Yoga', icon: '🧘‍♀️', category: 'Sport' },
  15: { name: 'Dancing', icon: '💃', category: 'Sport' },
  16: { name: 'Fitness', icon: '💪', category: 'Sport' },
  17: { name: 'Movies', icon: '🎬', category: 'Kunst' },
  18: { name: 'Coffee', icon: '☕', category: null }, // no events
};

export const interests = Object.entries(interestMapping).map(([id, data]) => ({
  id: parseInt(id),
  name: data.name,
  icon: data.icon,
  category: data.category
}));

// Backend-API Helpers
export const fetchUserInterests = async () => {
  const response = await fetch('/api/interests');
  if (!response.ok) throw new Error('Failed to fetch interests');
  return response.json();
};

export const fetchInterestCategories = async () => {
  const response = await fetch('/api/interests/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const getSelectedCategoriesFromInterests = (selectedInterestIds: number[]): string[] => {
  return selectedInterestIds
    .map(id => interestMapping[id as keyof typeof interestMapping]?.category)
    .filter(category => category !== null) as string[];
};
