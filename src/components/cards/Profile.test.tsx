// src/components/Profile.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Profile from './Profile';

describe('Profile component', () => {
  it('zeigt den Nutzernamen und die Email an', () => {
    render(<Profile />);
    
    expect(screen.getByText(/Nutzername:/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Mustermann/i)).toBeInTheDocument();
    expect(screen.getByText(/max@example.com/i)).toBeInTheDocument();
  });
});
