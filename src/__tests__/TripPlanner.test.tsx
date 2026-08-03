import { render, screen, fireEvent } from '@testing-library/react';
import TripPlanner from '../components/TripPlanner';
import type { Trip } from '../types';

const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Stockholm Journey',
    description: 'Summer tour',
    days: ['Day 1', 'Day 2', 'Day 3'],
    members: ['user-1'],
    invitedEmails: [],
    ownerId: 'user-1',
    ownerName: 'Alice',
    itinerary: [],
    restaurants: []
  }
];

describe('TripPlanner Component', () => {
  test('renders user journeys grid and trip title', () => {
    const handleNavigate = jest.fn();
    render(
      <TripPlanner
        user={{ uid: 'user-1', email: 'alice@example.com' } as any}
        trips={mockTrips}
        showCreateTrip={false}
        setShowCreateTrip={() => {}}
        newTripTitle=""
        setNewTripTitle={() => {}}
        newTripDesc=""
        setNewTripDesc={() => {}}
        newTripDaysCount={3}
        setNewTripDaysCount={() => {}}
        newTripStartDate=""
        setNewTripStartDate={() => {}}
        newTripEndDate=""
        setNewTripEndDate={() => {}}
        handleCreateTrip={(e) => e.preventDefault()}
        onNavigateToTrip={handleNavigate}
      />
    );

    expect(screen.getByText('Your Shared Journeys')).toBeInTheDocument();
    expect(screen.getByText('Stockholm Journey')).toBeInTheDocument();
    const openTripBtn = screen.getByRole('button', { name: /Open Trip/i });
    fireEvent.click(openTripBtn);
    expect(handleNavigate).toHaveBeenCalledWith(mockTrips[0]);
  });
});
