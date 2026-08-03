import React from 'react';
import { Calendar, Clock, Pencil, Copy, Trash2 } from 'lucide-react';
import type { Trip, ItineraryItem } from '../types';
import { DAY_COLORS, formatTimeRange } from '../types';

interface ItineraryListProps {
  activeTrip: Trip;
  highlightedActivityId: string | null;
  onOpenDatePicker: (target: 'start' | 'end') => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetDayIdx: number) => void;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onEditActivity: (item: ItineraryItem) => void;
  onCopyActivity: (item: ItineraryItem) => void;
  onDeleteActivity: (itemId: string) => void;
}

export const ItineraryList: React.FC<ItineraryListProps> = ({
  activeTrip,
  highlightedActivityId,
  onOpenDatePicker,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onEditActivity,
  onCopyActivity,
  onDeleteActivity,
}) => {
  return (
    <div className="scandi-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Trip Date Controls Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--accent-sage)' }} /> Trip Calendar ({activeTrip.days.length} Days)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
            Days in your schedule are automatically calculated from your trip Start and End dates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Prominent Custom Start Date Picker Trigger */}
          <button 
            type="button"
            onClick={() => onOpenDatePicker('start')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'var(--bg-color)', 
              padding: '8px 16px', 
              borderRadius: '12px', 
              border: '1.5px solid var(--accent-sage)',
              color: 'var(--primary-text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Start:
            </span>
            <span>{activeTrip.startDate || 'Set Start Date'}</span>
          </button>

          {/* Prominent Custom End Date Picker Trigger */}
          <button 
            type="button"
            onClick={() => onOpenDatePicker('end')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'var(--bg-color)', 
              padding: '8px 16px', 
              borderRadius: '12px', 
              border: '1.5px solid #C89B7B',
              color: 'var(--primary-text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ color: '#C89B7B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              End:
            </span>
            <span>{activeTrip.endDate || 'Set End Date'}</span>
          </button>
        </div>
      </div>

      {/* CALENDAR GRID (EACH DAY IS A CALENDAR TILE) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px', 
        paddingBottom: '16px' 
      }}>
        {activeTrip.days.map((dayLabel, dayIdx) => {
          const dayItems = (activeTrip.itinerary || [])
            .filter(item => item.dayIndex === dayIdx)
            .sort((a, b) => (a.time || '23:59').localeCompare(b.time || '23:59'));

          let dateString = '';
          if (activeTrip.startDate) {
            const start = new Date(activeTrip.startDate);
            if (!isNaN(start.getTime())) {
              const d = new Date(start);
              d.setDate(d.getDate() + dayIdx);
              dateString = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            }
          }

          const isStartDay = dayIdx === 0;
          const isFinishDay = dayIdx === activeTrip.days.length - 1;

          return (
            <div 
              key={dayIdx}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, dayIdx)}
              style={{ 
                backgroundColor: 'var(--bg-color)', 
                borderRadius: '16px', 
                border: `2px solid ${isStartDay ? 'var(--accent-sage)' : isFinishDay ? '#C89B7B' : 'var(--border-color)'}`, 
                padding: '18px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease',
                minHeight: '400px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {/* Calendar Day Header */}
              <div style={{ borderBottom: `3px solid ${DAY_COLORS[dayIdx % DAY_COLORS.length]}`, paddingBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)', fontWeight: 600 }}>{dayLabel}</h3>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--card-bg)', color: 'var(--secondary-text)', border: '1px solid var(--border-color)' }}>
                    {dayItems.length} activities
                  </span>
                </div>

                {/* Calendar Marker Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {dateString && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} style={{ color: 'var(--secondary-text)' }} /> {dateString}
                    </span>
                  )}
                  {isStartDay && (
                    <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent-sage)', color: '#FFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      🚀 START
                    </span>
                  )}
                  {isFinishDay && (
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#C89B7B', color: '#FFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      🏁 END
                    </span>
                  )}
                </div>
              </div>

              {/* Activities in Calendar Day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                {dayItems.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: 'var(--secondary-text)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    Drag activities here or add above
                  </div>
                ) : (
                  dayItems.map((item) => {
                    const timeRangeStr = formatTimeRange(item.time, item.endTime);

                    return (
                      <div 
                        key={item.id}
                        id={`activity-${item.id}`}
                        className={highlightedActivityId === item.id ? 'activity-card-highlighted' : ''}
                        draggable
                        onDragStart={(e) => onDragStart(e, item.id)}
                        style={{ 
                          backgroundColor: 'var(--card-bg)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '12px', 
                          padding: '12px', 
                          cursor: 'grab', 
                          position: 'relative',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: DAY_COLORS[dayIdx % DAY_COLORS.length], display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {timeRangeStr}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button 
                              onClick={() => onEditActivity(item)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
                              title="Edit activity"
                            >
                              <Pencil size={13} />
                            </button>
                            <button 
                              onClick={() => onCopyActivity(item)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
                              title="Copy activity"
                            >
                              <Copy size={13} />
                            </button>
                            <button 
                              onClick={() => onDeleteActivity(item.id)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
                              title="Remove activity"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-text)', marginBottom: '4px' }}>
                          {item.title}
                        </h4>
                        {item.location && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📍 {item.location.name}
                          </div>
                        )}
                        {item.notes && (
                          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--secondary-text)', marginTop: '6px', borderTop: '1px dashed var(--border-color)', paddingTop: '4px' }}>
                            {item.notes}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryList;
