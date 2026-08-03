import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { Trip } from '../types';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTripTitle: string;
  setEditTripTitle: (val: string) => void;
  editTripDesc: string;
  setEditTripDesc: (val: string) => void;
  handleSaveTripDetails: () => void;
  onDeleteTrip?: (tripId: string) => void;
  activeTrip?: Trip | null;
  userUid?: string;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  isOpen,
  onClose,
  editTripTitle,
  setEditTripTitle,
  editTripDesc,
  setEditTripDesc,
  handleSaveTripDetails,
  onDeleteTrip,
  activeTrip,
  userUid,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const isCreator = activeTrip && userUid && activeTrip.ownerId === userUid;

  const handleConfirmDeleteClick = () => {
    if (onDeleteTrip && activeTrip) {
      onDeleteTrip(activeTrip.id);
      setShowConfirmDelete(false);
    }
  };

  return (
    <>
      <div className="scandi-modal-overlay">
        <div className="scandi-modal-content" style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-text)' }}>Edit Trip Details</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', marginBottom: '6px' }}>
                Trip Title
              </label>
              <input
                type="text"
                className="scandi-input"
                value={editTripTitle}
                onChange={(e) => setEditTripTitle(e.target.value)}
                placeholder="Trip title..."
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', marginBottom: '6px' }}>
                Trip Description
              </label>
              <textarea
                className="scandi-input"
                value={editTripDesc}
                onChange={(e) => setEditTripDesc(e.target.value)}
                placeholder="Trip description..."
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              {isCreator && onDeleteTrip && activeTrip ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#D9534F',
                    border: '1px solid #D9534F',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} /> Delete Trip
                </button>
              ) : <div />}
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onClose} className="scandi-btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveTripDetails} className="scandi-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scandi Confirmation Popup for Deleting Trip */}
      {showConfirmDelete && (
        <div className="scandi-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="scandi-modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FDF2F2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <AlertTriangle size={24} style={{ color: '#D9534F' }} />
            </div>
            
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-text)', marginBottom: '8px' }}>
              Delete Journey?
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', lineHeight: 1.5, marginBottom: '24px' }}>
              Are you sure you want to delete <strong>"{activeTrip?.title}"</strong>? This will permanently remove the itinerary and chat history for all trip members.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowConfirmDelete(false)} 
                className="scandi-btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDeleteClick} 
                className="scandi-btn"
                style={{ flex: 1, backgroundColor: '#D9534F' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTripModal;


