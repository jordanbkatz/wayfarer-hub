import React from 'react';
import { Pencil, X } from 'lucide-react';
import type { ItineraryItem, Trip } from '../types';

interface EditActivityModalProps {
  editingActivity: ItineraryItem | null;
  setEditingActivity: (item: ItineraryItem | null) => void;
  activeTrip: Trip | null;
  handleSaveEditActivity: () => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  editingActivity,
  setEditingActivity,
  activeTrip,
  handleSaveEditActivity,
}) => {
  if (!editingActivity) return null;

  return (
    <div className="scandi-modal-overlay">
      <div className="scandi-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pencil size={20} style={{ color: 'var(--accent-sage)' }} /> Edit Activity
          </h3>
          <button onClick={() => setEditingActivity(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Activity Title</label>
            <input 
              type="text" 
              className="scandi-input" 
              value={editingActivity.title} 
              onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Location Name</label>
            <input 
              type="text" 
              className="scandi-input" 
              value={editingActivity.location?.name || ''} 
              onChange={(e) => setEditingActivity({ 
                ...editingActivity, 
                location: { ...editingActivity.location, name: e.target.value, formattedAddress: editingActivity.location?.formattedAddress || e.target.value, lat: editingActivity.location?.lat || 0, lng: editingActivity.location?.lng || 0 } 
              })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Location Address</label>
            <input 
              type="text" 
              className="scandi-input" 
              value={editingActivity.location?.formattedAddress || ''} 
              onChange={(e) => setEditingActivity({ 
                ...editingActivity, 
                location: { ...editingActivity.location, formattedAddress: e.target.value, name: editingActivity.location?.name || '', lat: editingActivity.location?.lat || 0, lng: editingActivity.location?.lng || 0 } 
              })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Schedule Day</label>
              <select 
                className="scandi-input" 
                value={editingActivity.dayIndex} 
                onChange={(e) => setEditingActivity({ ...editingActivity, dayIndex: parseInt(e.target.value) })}
                style={{ padding: '8px 8px', fontSize: '0.8rem' }}
              >
                {activeTrip?.days.map((dayLabel, idx) => (
                  <option key={idx} value={idx}>{dayLabel}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Start Time</label>
              <input 
                type="time" 
                className="scandi-input" 
                value={editingActivity.time || '10:00'} 
                onChange={(e) => setEditingActivity({ ...editingActivity, time: e.target.value })}
                style={{ padding: '8px 8px', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>End Time</label>
              <input 
                type="time" 
                className="scandi-input" 
                value={editingActivity.endTime || '11:30'} 
                onChange={(e) => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
                style={{ padding: '8px 8px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Itinerary Notes</label>
            <textarea 
              className="scandi-input" 
              rows={3} 
              value={editingActivity.notes || ''} 
              onChange={(e) => setEditingActivity({ ...editingActivity, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={() => setEditingActivity(null)} className="scandi-btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveEditActivity} className="scandi-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;
