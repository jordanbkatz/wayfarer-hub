import React from 'react';
import { Compass, LogOut, Pencil, Calendar, Map as MapIcon, MessageSquare, UserPlus, FileText } from 'lucide-react';
import type { Trip, LivePresence } from '../types';
import { PASTEL_COLORS } from '../types';

interface DashboardNavbarProps {
  mode: 'dashboard';
  displayName: string;
  userColor?: string;
  onDisplayNameChange: (name: string) => void;
  onSaveDisplayName: (name: string) => void;
  onSignOut: () => void;
}

interface WorkspaceNavbarProps {
  mode: 'workspace';
  activeTrip: Trip;
  userUid?: string;
  displayName: string;
  userColor?: string;
  presenceList: LivePresence[];
  activeTab: 'itinerary' | 'route' | 'chat';
  compiling?: boolean;
  onNavigateBack: () => void;
  onNavigateTab: (tab: 'itinerary' | 'route' | 'chat') => void;
  onEditTripDetails: () => void;
  onOpenInviteModal: () => void;
  onCompileItinerary: () => void;
}

export type NavbarProps = DashboardNavbarProps | WorkspaceNavbarProps;

export const Navbar: React.FC<NavbarProps> = (props) => {
  if (props.mode === 'dashboard') {
    const { displayName, userColor, onDisplayNameChange, onSaveDisplayName, onSignOut } = props;
    return (
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Compass size={28} style={{ color: 'var(--accent-sage)' }} />
            <h1 style={{ fontSize: '1.6rem', color: 'var(--primary-text)' }}>Wayfarer Hub</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: userColor || PASTEL_COLORS[0], 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#FFF', 
                fontSize: '14px', 
                fontWeight: 600 
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  const val = e.target.value;
                  onDisplayNameChange(val);
                  if (val.trim()) {
                    onSaveDisplayName(val.trim());
                  }
                }}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--primary-text)',
                  fontWeight: 600,
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  width: '120px'
                }}
                placeholder="Display Name"
              />
              <button onClick={onSignOut} className="scandi-btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const { 
    activeTrip, 
    userUid, 
    displayName, 
    userColor, 
    presenceList, 
    activeTab, 
    compiling, 
    onNavigateBack, 
    onNavigateTab, 
    onEditTripDetails, 
    onOpenInviteModal, 
    onCompileItinerary 
  } = props;

  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        {/* Back button & Trip Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onNavigateBack} className="scandi-btn-secondary" style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
            ← Dashboard
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-text)', fontWeight: 500 }}>{activeTrip.title}</h2>
              {userUid === activeTrip.ownerId && (
                <button 
                  onClick={onEditTripDetails} 
                  className="scandi-btn-secondary" 
                  style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  title="Edit Trip Title & Description"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
              <span style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', backgroundColor: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px' }}>
                🔒 Private Trip
              </span>
            </div>
            {activeTrip.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>{activeTrip.description}</p>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION BUTTONS */}
        <nav className="scandi-tab-nav">
          <button 
            onClick={() => onNavigateTab('itinerary')} 
            className={`scandi-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          >
            <Calendar size={15} /> Itinerary
          </button>
          <button 
            onClick={() => onNavigateTab('route')} 
            className={`scandi-tab-btn ${activeTab === 'route' ? 'active' : ''}`}
          >
            <MapIcon size={15} /> Route Map
          </button>
          <button 
            onClick={() => onNavigateTab('chat')} 
            className={`scandi-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={15} /> Group Chat
          </button>
        </nav>

        {/* Right Header Actions: Members, Invite Friend, Compile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Live Presence / Members Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Active user avatar */}
              <div 
                title={`${displayName} (You)`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: userColor || PASTEL_COLORS[0], 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#FFF', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  border: '2px solid #FFF',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>

              {/* Online Presence Avatars */}
              {presenceList.map((friend) => (
                <div 
                  key={friend.id}
                  title={`${friend.userName} (Online now)`}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: friend.userColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#FFF', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    border: '2px solid #FFF',
                    marginLeft: '-8px',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  {friend.userName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Invite Friend Modal Button */}
          <button 
            onClick={onOpenInviteModal} 
            className="scandi-btn" 
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem' }}
          >
            <UserPlus size={14} /> Invite Friend
          </button>

          <button 
            onClick={onCompileItinerary} 
            className="scandi-btn-secondary" 
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem' }}
          >
            {compiling ? 'Compiling...' : <><FileText size={14} /> Export Summary</>}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
