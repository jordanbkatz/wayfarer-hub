import React from 'react';
import { MapPin } from 'lucide-react';
import type { Trip } from '../types';

interface SpotCardProps {
  activeTrip: Trip;
  placeInputMode: 'search' | 'custom';
  setPlaceInputMode: (mode: 'search' | 'custom') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLoading: boolean;
  searchResults: any[];
  selectedSpot: any | null;
  setSelectedSpot: (spot: any | null) => void;
  handleSearchLocations: (e: React.FormEvent) => void;
  newItemTitle: string;
  setNewItemTitle: (title: string) => void;
  newItemDayIndex: number;
  setNewItemDayIndex: (day: number) => void;
  newItemTime: string;
  setNewItemTime: (time: string) => void;
  newItemEndTime: string;
  setNewItemEndTime: (time: string) => void;
  newItemNotes: string;
  setNewItemNotes: (notes: string) => void;
  handleAddItemToItinerary: () => void;
  // Custom place props
  customPlaceName: string;
  setCustomPlaceName: (name: string) => void;
  customPlaceAddress: string;
  setCustomPlaceAddress: (addr: string) => void;
  customAddressResults: any[];
  setCustomAddressResults: (results: any[]) => void;
  customAddressLoading: boolean;
  setSelectedCustomAddress: (item: any) => void;
  handleSearchCustomAddress: (query: string) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  activeTrip,
  placeInputMode,
  setPlaceInputMode,
  searchQuery,
  setSearchQuery,
  searchLoading,
  searchResults,
  selectedSpot,
  setSelectedSpot,
  handleSearchLocations,
  newItemTitle,
  setNewItemTitle,
  newItemDayIndex,
  setNewItemDayIndex,
  newItemTime,
  setNewItemTime,
  newItemEndTime,
  setNewItemEndTime,
  newItemNotes,
  setNewItemNotes,
  handleAddItemToItinerary,
  customPlaceName,
  setCustomPlaceName,
  customPlaceAddress,
  setCustomPlaceAddress,
  customAddressResults,
  setCustomAddressResults,
  customAddressLoading,
  setSelectedCustomAddress,
  handleSearchCustomAddress,
}) => {
  return (
    <div className="scandi-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} style={{ color: 'var(--accent-sage)' }} /> Add Activity to Schedule
        </h4>
        
        {/* Place Mode Toggle: Search vs Custom */}
        <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-color)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setPlaceInputMode('search')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: placeInputMode === 'search' ? 'var(--card-bg)' : 'transparent',
              color: placeInputMode === 'search' ? 'var(--primary-text)' : 'var(--secondary-text)',
              boxShadow: placeInputMode === 'search' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Search Place
          </button>
          <button
            type="button"
            onClick={() => setPlaceInputMode('custom')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: placeInputMode === 'custom' ? 'var(--card-bg)' : 'transparent',
              color: placeInputMode === 'custom' ? 'var(--primary-text)' : 'var(--secondary-text)',
              boxShadow: placeInputMode === 'custom' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Custom Place
          </button>
        </div>
      </div>

      {placeInputMode === 'search' ? (
        <>
          {/* Location Geocode Search */}
          <form onSubmit={handleSearchLocations} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input 
              type="text" 
              className="scandi-input" 
              placeholder="Search city, attraction, museum, cafe..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="scandi-btn" style={{ whiteSpace: 'nowrap' }}>
              {searchLoading ? 'Searching...' : 'Search Place'}
            </button>
          </form>

          {/* Location Results List */}
          {searchResults.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', maxHeight: '160px', overflowY: 'auto', marginBottom: '12px', padding: '4px' }}>
              {searchResults.map((spot, index) => (
                <div 
                  key={index} 
                  onClick={() => {
                    setSelectedSpot(spot);
                    setNewItemTitle(spot.name);
                  }}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    backgroundColor: selectedSpot === spot ? 'var(--accent-sage-light)' : 'transparent',
                    fontSize: '0.85rem',
                    borderBottom: index < searchResults.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <strong>{spot.name}</strong> <span style={{ color: 'var(--secondary-text)', fontSize: '0.75rem' }}>({spot.category})</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{spot.formattedAddress}</div>
                </div>
              ))}
            </div>
          )}

          {selectedSpot && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', padding: '16px', border: '1px solid var(--accent-sage)', borderRadius: '12px', backgroundColor: 'rgba(142, 158, 134, 0.05)' }}>
              <div style={{ fontSize: '0.9rem' }}>
                Selected Location: <strong>{selectedSpot.name}</strong> 📍 {selectedSpot.formattedAddress}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Activity Name</label>
                  <input 
                    type="text" 
                    className="scandi-input" 
                    value={newItemTitle} 
                    onChange={(e) => setNewItemTitle(e.target.value)} 
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Schedule Day</label>
                  <select 
                    className="scandi-input" 
                    value={newItemDayIndex} 
                    onChange={(e) => setNewItemDayIndex(parseInt(e.target.value))}
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    {activeTrip.days.map((dayLabel, idx) => (
                      <option key={idx} value={idx}>{dayLabel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Start Time</label>
                  <input 
                    type="time" 
                    className="scandi-input" 
                    value={newItemTime} 
                    onChange={(e) => setNewItemTime(e.target.value)} 
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>End Time</label>
                  <input 
                    type="time" 
                    className="scandi-input" 
                    value={newItemEndTime} 
                    onChange={(e) => setNewItemEndTime(e.target.value)} 
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Itinerary Notes (Optional)</label>
                <input 
                  type="text" 
                  className="scandi-input" 
                  placeholder="e.g. Bring camera / Guided tour ticket reserved (optional)" 
                  value={newItemNotes} 
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedSpot(null)} className="scandi-btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button onClick={handleAddItemToItinerary} className="scandi-btn" style={{ padding: '6px 18px', fontSize: '0.85rem' }}>
                  Add to Day {newItemDayIndex + 1}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Custom Place Mode Form */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Custom Place Name *</label>
              <input 
                type="text" 
                className="scandi-input" 
                placeholder="e.g. Grandpa's Beach Cabin or Secret Lookout" 
                value={customPlaceName} 
                onChange={(e) => {
                  setCustomPlaceName(e.target.value);
                  if (!newItemTitle) setNewItemTitle(e.target.value);
                }} 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Address / Location Search & Validation</label>
              <input 
                type="text" 
                className="scandi-input" 
                placeholder="Type address to search & validate..." 
                value={customPlaceAddress} 
                onChange={(e) => handleSearchCustomAddress(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              {customAddressLoading && (
                <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '4px' }}>Searching address database...</div>
              )}
              {customAddressResults.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', maxHeight: '160px', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                  {customAddressResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCustomPlaceAddress(item.formattedAddress);
                        setSelectedCustomAddress(item);
                        setCustomAddressResults([]);
                      }}
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem', borderBottom: idx < customAddressResults.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                    >
                      📍 <strong>{item.name}</strong> - <span style={{ color: 'var(--secondary-text)' }}>{item.formattedAddress}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Activity Display Name</label>
              <input 
                type="text" 
                className="scandi-input" 
                placeholder="e.g. Evening BBQ & Sunset" 
                value={newItemTitle} 
                onChange={(e) => setNewItemTitle(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Schedule Day</label>
              <select 
                className="scandi-input" 
                value={newItemDayIndex} 
                onChange={(e) => setNewItemDayIndex(parseInt(e.target.value))}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                {activeTrip.days.map((dayLabel, idx) => (
                  <option key={idx} value={idx}>{dayLabel}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Start Time</label>
              <input 
                type="time" 
                className="scandi-input" 
                value={newItemTime} 
                onChange={(e) => setNewItemTime(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>End Time</label>
              <input 
                type="time" 
                className="scandi-input" 
                value={newItemEndTime} 
                onChange={(e) => setNewItemEndTime(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Itinerary Notes (Optional)</label>
            <input 
              type="text" 
              className="scandi-input" 
              placeholder="e.g. Park near gate 2, key code 4821 (optional)" 
              value={newItemNotes} 
              onChange={(e) => setNewItemNotes(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={handleAddItemToItinerary} className="scandi-btn" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Add Custom Activity to Day {newItemDayIndex + 1}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotCard;
