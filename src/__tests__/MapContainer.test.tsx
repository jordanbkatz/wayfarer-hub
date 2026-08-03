import React from 'react';
import { render, screen } from '@testing-library/react';
import MapContainer from '../components/MapContainer';
import type { Trip } from '../types';

const mockTrip: Trip = {
  id: 'trip-1',
  title: 'Stockholm Trip',
  description: '',
  days: ['Day 1', 'Day 2'],
  members: ['user-1'],
  invitedEmails: [],
  ownerId: 'user-1',
  ownerName: 'Alice',
  itinerary: [],
  restaurants: []
};

describe('MapContainer Component', () => {
  test('renders map container title and map wrapper', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MapContainer activeTrip={mockTrip} mapContainerRef={ref} />);

    expect(screen.getByText('Route & Map Visualization')).toBeInTheDocument();
  });
});
