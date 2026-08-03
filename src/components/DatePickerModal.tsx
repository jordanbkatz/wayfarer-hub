import React from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trip } from '../types';
import { MONTH_NAMES } from '../types';

interface DatePickerModalProps {
  datePickerTarget: 'start' | 'end' | null;
  setDatePickerTarget: (target: 'start' | 'end' | null) => void;
  pickerYear: number;
  setPickerYear: (yr: number) => void;
  pickerMonth: number;
  setPickerMonth: (m: number) => void;
  activeTrip: Trip | null;
  handleUpdateTripDates: (start: string, end: string) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  datePickerTarget,
  setDatePickerTarget,
  pickerYear,
  setPickerYear,
  pickerMonth,
  setPickerMonth,
  activeTrip,
  handleUpdateTripDates,
}) => {
  if (!datePickerTarget) return null;

  return (
    <div className="scandi-modal-overlay">
      <div className="scandi-modal-content" style={{ maxWidth: '420px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: datePickerTarget === 'start' ? 'var(--accent-sage)' : '#C89B7B' }} />
            Select Trip {datePickerTarget === 'start' ? 'Start' : 'End'} Date
          </h3>
          <button onClick={() => setDatePickerTarget(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Month & Year Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: 'var(--bg-color)', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            type="button"
            onClick={() => {
              if (pickerMonth === 0) {
                setPickerMonth(11);
                setPickerYear(pickerYear - 1);
              } else {
                setPickerMonth(pickerMonth - 1);
              }
            }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="serif-font" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-text)' }}>
            {MONTH_NAMES[pickerMonth]} {pickerYear}
          </span>
          <button 
            type="button"
            onClick={() => {
              if (pickerMonth === 11) {
                setPickerMonth(0);
                setPickerYear(pickerYear + 1);
              } else {
                setPickerMonth(pickerMonth + 1);
              }
            }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day of Week Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>{d}</span>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {(() => {
            const firstDayIdx = new Date(pickerYear, pickerMonth, 1).getDay();
            const totalDaysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
            const cells = [];

            for (let i = 0; i < firstDayIdx; i++) {
              cells.push(<div key={`pad-${i}`} />);
            }

            for (let day = 1; day <= totalDaysInMonth; day++) {
              const mStr = String(pickerMonth + 1).padStart(2, '0');
              const dStr = String(day).padStart(2, '0');
              const fullDateStr = `${pickerYear}-${mStr}-${dStr}`;

              const isStart = activeTrip?.startDate === fullDateStr;
              const isEnd = activeTrip?.endDate === fullDateStr;

              cells.push(
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (datePickerTarget === 'start') {
                      handleUpdateTripDates(fullDateStr, activeTrip?.endDate || fullDateStr);
                    } else {
                      handleUpdateTripDates(activeTrip?.startDate || fullDateStr, fullDateStr);
                    }
                    setDatePickerTarget(null);
                  }}
                  style={{
                    padding: '10px 0',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: (isStart || isEnd) ? 700 : 500,
                    cursor: 'pointer',
                    backgroundColor: isStart ? 'var(--accent-sage)' : isEnd ? '#C89B7B' : 'var(--bg-color)',
                    color: (isStart || isEnd) ? '#FFF' : 'var(--primary-text)',
                    boxShadow: (isStart || isEnd) ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {day}
                </button>
              );
            }
            return cells;
          })()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setDatePickerTarget(null)} className="scandi-btn-secondary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
