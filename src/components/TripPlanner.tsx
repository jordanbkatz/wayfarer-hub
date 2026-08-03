import React from 'react';
import { Compass, Plus, Users, ArrowRight, X, Trash2 } from 'lucide-react';
import type { Trip, User } from '../types';

interface TripPlannerProps {
  user: User | null;
  trips: Trip[];
  showCreateTrip: boolean;
  setShowCreateTrip: (show: boolean) => void;
  newTripTitle: string;
  setNewTripTitle: (val: string) => void;
  newTripDesc: string;
  setNewTripDesc: (val: string) => void;
  newTripDaysCount: number;
  setNewTripDaysCount: (val: number) => void;
  newTripStartDate: string;
  setNewTripStartDate: (val: string) => void;
  newTripEndDate: string;
  setNewTripEndDate: (val: string) => void;
  handleCreateTrip: (e: React.FormEvent) => void;
  onNavigateToTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  successMsg?: string;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  user,
  trips,
  showCreateTrip,
  setShowCreateTrip,
  newTripTitle,
  setNewTripTitle,
  newTripDesc,
  setNewTripDesc,
  newTripDaysCount,
  setNewTripDaysCount,
  newTripStartDate,
  setNewTripStartDate,
  newTripEndDate,
  setNewTripEndDate,
  handleCreateTrip,
  onNavigateToTrip,
  onDeleteTrip,
  successMsg
}) => {
  return (
    <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-text)', lineHeight: 1.1 }}>
            Your Shared Journeys
          </h2>
        </div>
        
        <button onClick={() => setShowCreateTrip(true)} className="scandi-btn">
          <Plus size={16} /> Plan a New Trip
        </button>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#EDF5ED', color: '#5A8E5A', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '24px' }}>
          {successMsg}
        </div>
      )}

      {/* Trip Cards Grid */}
      {trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '640px', margin: '0 auto', boxShadow: '0 10px 30px var(--shadow-color)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-sage-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Compass size={36} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-text)', marginBottom: '8px' }}>
            No Journeys Yet
          </h3>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            You don't have any trips yet! Create a new trip to start building your itinerary, or have a friend share a trip with you by inviting <strong>{user?.email || 'your email'}</strong>.
          </p>
          <button onClick={() => setShowCreateTrip(true)} className="scandi-btn" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <Plus size={18} /> Plan a New Trip
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {trips.map((trip) => (
            <div 
              key={trip.id} 
              className="scandi-card" 
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-sage)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {trip.days.length} Days Trip
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', backgroundColor: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px' }}>
                    🔒 Private Trip
                  </span>
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--primary-text)' }}>{trip.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginBottom: '16px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {trip.description || 'Collaborative itinerary journal.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {trip.members.length} {trip.members.length === 1 ? 'Explorer' : 'Explorers'}
                </div>

                <button 
                  onClick={() => onNavigateToTrip(trip)}
                  className="scandi-btn"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Open Trip <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Trip */}
      {showCreateTrip && (
        <div className="scandi-modal-overlay">
          <div className="scandi-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Plan New Journey</h3>
              <button onClick={() => setShowCreateTrip(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                  Trip Destination / Name
                </label>
                <input 
                  type="text" 
                  className="scandi-input" 
                  placeholder="e.g. Stockholm Summer Odyssey" 
                  value={newTripTitle} 
                  onChange={(e) => setNewTripTitle(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea 
                  className="scandi-input" 
                  placeholder="Brief notes on planned routes or goal..." 
                  rows={3} 
                  value={newTripDesc} 
                  onChange={(e) => setNewTripDesc(e.target.value)} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                    Start Date (Calendar)
                  </label>
                  <input 
                    type="date" 
                    className="scandi-input" 
                    value={newTripStartDate} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewTripStartDate(val);
                      if (val && newTripEndDate) {
                        const s = new Date(val);
                        const ed = new Date(newTripEndDate);
                        if (!isNaN(s.getTime()) && !isNaN(ed.getTime()) && ed >= s) {
                          setNewTripDaysCount(Math.ceil(Math.abs(ed.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                        }
                      }
                    }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                    End Date (Calendar)
                  </label>
                  <input 
                    type="date" 
                    className="scandi-input" 
                    value={newTripEndDate} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewTripEndDate(val);
                      if (newTripStartDate && val) {
                        const s = new Date(newTripStartDate);
                        const ed = new Date(val);
                        if (!isNaN(s.getTime()) && !isNaN(ed.getTime()) && ed >= s) {
                          setNewTripDaysCount(Math.ceil(Math.abs(ed.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                        }
                      }
                    }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                  Duration (Days)
                </label>
                <input 
                  type="number" 
                  min={1} 
                  max={30} 
                  className="scandi-input" 
                  value={newTripDaysCount} 
                  onChange={(e) => setNewTripDaysCount(parseInt(e.target.value) || 1)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateTrip(false)} className="scandi-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="scandi-btn">
                  Create Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default TripPlanner;
