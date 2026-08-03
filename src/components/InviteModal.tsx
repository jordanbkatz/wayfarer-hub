import React from 'react';
import { UserPlus, X, Search, Users } from 'lucide-react';
import type { Trip, RegisteredUser, User } from '../types';
import { PASTEL_COLORS } from '../types';

interface InviteModalProps {
  showInviteModal: boolean;
  setShowInviteModal: (show: boolean) => void;
  friendSearchQuery: string;
  setFriendSearchQuery: (query: string) => void;
  matchingFriends: RegisteredUser[];
  activeTrip: Trip;
  user: User | null;
  tripMembersList: RegisteredUser[];
  handleInviteFriend: (friendUid: string, friendEmail: string) => void;
  handleRemoveMember: (memberUid: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  showInviteModal,
  setShowInviteModal,
  friendSearchQuery,
  setFriendSearchQuery,
  matchingFriends,
  activeTrip,
  user,
  tripMembersList,
  handleInviteFriend,
  handleRemoveMember,
}) => {
  if (!showInviteModal) return null;

  return (
    <div className="scandi-modal-overlay">
      <div className="scandi-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} style={{ color: 'var(--accent-sage)' }} /> Invite Friends to Trip
          </h3>
          <button onClick={() => setShowInviteModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '16px' }}>
          Search among registered user accounts on the platform. All trips are private by default, and only invited friends can view or edit this trip.
        </p>

        {/* Friend Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="scandi-input" 
            placeholder="Search registered friends by name or email..." 
            value={friendSearchQuery}
            onChange={(e) => setFriendSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
            autoFocus
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-text)' }} />
        </div>

        {/* Matching Registered Friends List */}
        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {matchingFriends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--secondary-text)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              {friendSearchQuery.trim() ? 'No registered friends match your search query.' : 'Type a name or email to search registered users.'}
            </div>
          ) : (
            matchingFriends.map((friend) => (
              <div 
                key={friend.uid}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 14px', 
                  backgroundColor: 'var(--bg-color)', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: friend.color || PASTEL_COLORS[0], 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#FFF', 
                    fontSize: '12px', 
                    fontWeight: 600 
                  }}>
                    {friend.displayName ? friend.displayName.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-text)' }}>{friend.displayName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>{friend.email}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleInviteFriend(friend.uid, friend.email)}
                  className="scandi-btn"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Invite Friend
                </button>
              </div>
            ))
          )}
        </div>

        {/* Current Trip Members */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} /> Active Trip Members ({activeTrip.members.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tripMembersList.map((m) => (
              <div key={m.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: m.color || PASTEL_COLORS[0] }} />
                  <span>{m.displayName} {m.uid === activeTrip.ownerId && '(Creator)'} {m.uid === user?.uid && '(You)'}</span>
                </div>
                {activeTrip.ownerId === user?.uid && m.uid !== user?.uid && (
                  <button 
                    onClick={() => handleRemoveMember(m.uid)}
                    style={{ border: 'none', background: 'none', color: 'var(--secondary-text)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowInviteModal(false)} className="scandi-btn-secondary">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default InviteModal;
