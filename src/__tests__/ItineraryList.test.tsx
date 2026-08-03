import { render, screen } from '@testing-library/react';
import ItineraryList from '../components/ItineraryList';
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
  itinerary: [
    {
      id: 'item-1',
      title: 'Gamla Stan Tour',
      dayIndex: 0,
      time: '10:00',
      endTime: '12:00',
      location: {
        name: 'Gamla Stan',
        formattedAddress: 'Old Town, Stockholm',
        lat: 59.3257,
        lng: 18.0719
      }
    }
  ],
  restaurants: []
};

describe('ItineraryList Component', () => {
  test('renders trip days and scheduled activity item', () => {
    render(
      <ItineraryList
        activeTrip={mockTrip}
        highlightedActivityId={null}
        onOpenDatePicker={() => {}}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onDrop={() => {}}
        onDragStart={() => {}}
        onEditActivity={() => {}}
        onCopyActivity={() => {}}
        onDeleteActivity={() => {}}
      />
    );

    expect(screen.getByText(/Trip Calendar/i)).toBeInTheDocument();
    expect(screen.getByText('Gamla Stan Tour')).toBeInTheDocument();
    const gamlaStanElements = screen.getAllByText(/Gamla Stan/i);
    expect(gamlaStanElements.length).toBeGreaterThan(0);
  });
});
