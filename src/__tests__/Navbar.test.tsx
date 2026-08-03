import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import type { Trip } from '../types';

const mockTrip: Trip = {
  id: 'trip-1',
  title: 'Stockholm Summer',
  description: 'Exploring the archipelagos',
  days: ['Day 1', 'Day 2'],
  members: ['user-1'],
  invitedEmails: [],
  ownerId: 'user-1',
  ownerName: 'Alice',
  itinerary: [],
  restaurants: []
};

describe('Navbar Component', () => {
  test('renders Dashboard Navbar with display name and sign out button', () => {
    const handleSignOut = jest.fn();
    render(
      <Navbar
        mode="dashboard"
        displayName="Alice"
        userColor="#8E9E86"
        onDisplayNameChange={() => {}}
        onSaveDisplayName={() => {}}
        onSignOut={handleSignOut}
      />
    );

    expect(screen.getByText('Wayfarer Hub')).toBeInTheDocument();
    const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
    expect(signOutBtn).toBeInTheDocument();
    fireEvent.click(signOutBtn);
    expect(handleSignOut).toHaveBeenCalledTimes(1);
  });

  test('renders Workspace Navbar with trip title and tabs', () => {
    const handleTabChange = jest.fn();
    render(
      <Navbar
        mode="workspace"
        activeTrip={mockTrip}
        userUid="user-1"
        displayName="Alice"
        presenceList={[]}
        activeTab="itinerary"
        onNavigateBack={() => {}}
        onNavigateTab={handleTabChange}
        onEditTripDetails={() => {}}
        onOpenInviteModal={() => {}}
        onCompileItinerary={() => {}}
      />
    );

    expect(screen.getByText('Stockholm Summer')).toBeInTheDocument();
    expect(screen.getByText('Itinerary')).toBeInTheDocument();
    expect(screen.getByText('Route Map')).toBeInTheDocument();
    expect(screen.getByText('Group Chat')).toBeInTheDocument();

    const routeTab = screen.getByRole('button', { name: /Route Map/i });
    fireEvent.click(routeTab);
    expect(handleTabChange).toHaveBeenCalledWith('route');
  });
});
