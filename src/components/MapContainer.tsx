import React from 'react';
import type { Trip } from '../types';

interface MapContainerProps {
  activeTrip: Trip;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const MapContainer: React.FC<MapContainerProps> = ({ activeTrip, mapContainerRef }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-text)' }}>Route & Map Visualization</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
            Visualizing itinerary stops and route connections across {activeTrip.days.length} days.
          </p>
        </div>
      </div>

      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="no-hover" 
        style={{ flex: 1, width: '100%', minHeight: '0', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}
      />
    </div>
  );
};

export default MapContainer;
