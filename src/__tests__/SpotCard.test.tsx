import { render, screen } from '@testing-library/react';
import SpotCard from '../components/SpotCard';
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

describe('SpotCard Component', () => {
  test('renders place search mode by default', () => {
    render(
      <SpotCard
        activeTrip={mockTrip}
        placeInputMode="search"
        setPlaceInputMode={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        searchLoading={false}
        searchResults={[]}
        selectedSpot={null}
        setSelectedSpot={() => {}}
        handleSearchLocations={(e) => e.preventDefault()}
        newItemTitle=""
        setNewItemTitle={() => {}}
        newItemDayIndex={0}
        setNewItemDayIndex={() => {}}
        newItemTime="10:00"
        setNewItemTime={() => {}}
        newItemEndTime="11:30"
        setNewItemEndTime={() => {}}
        newItemNotes=""
        setNewItemNotes={() => {}}
        handleAddItemToItinerary={() => {}}
        customPlaceName=""
        setCustomPlaceName={() => {}}
        customPlaceAddress=""
        setCustomPlaceAddress={() => {}}
        customAddressResults={[]}
        setCustomAddressResults={() => {}}
        customAddressLoading={false}
        setSelectedCustomAddress={() => {}}
        handleSearchCustomAddress={() => {}}
      />
    );

    expect(screen.getByText('Add Activity to Schedule')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search city, attraction, museum, cafe...')).toBeInTheDocument();
  });

  test('toggles to custom place mode when mode is custom', () => {
    render(
      <SpotCard
        activeTrip={mockTrip}
        placeInputMode="custom"
        setPlaceInputMode={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        searchLoading={false}
        searchResults={[]}
        selectedSpot={null}
        setSelectedSpot={() => {}}
        handleSearchLocations={(e) => e.preventDefault()}
        newItemTitle=""
        setNewItemTitle={() => {}}
        newItemDayIndex={0}
        setNewItemDayIndex={() => {}}
        newItemTime="10:00"
        setNewItemTime={() => {}}
        newItemEndTime="11:30"
        setNewItemEndTime={() => {}}
        newItemNotes=""
        setNewItemNotes={() => {}}
        handleAddItemToItinerary={() => {}}
        customPlaceName="Secret Cabin"
        setCustomPlaceName={() => {}}
        customPlaceAddress=""
        setCustomPlaceAddress={() => {}}
        customAddressResults={[]}
        setCustomAddressResults={() => {}}
        customAddressLoading={false}
        setSelectedCustomAddress={() => {}}
        handleSearchCustomAddress={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("e.g. Grandpa's Beach Cabin or Secret Lookout")).toBeInTheDocument();
  });
});
