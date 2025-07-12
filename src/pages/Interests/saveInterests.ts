import { apiCall } from '../../config/api';

export async function saveInterests(interests: number[]) {
  console.log('Saving interests:', interests);
  
  const response = await apiCall('/interests', {
    method: 'POST',
    body: JSON.stringify({ interests }),
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(`HTTP ${response.status}: ${result.error || result.message || 'Unknown error'}`);
  }
  
  const result = await response.json();
  console.log('Successfully saved interests:', result);
  return result;
}
