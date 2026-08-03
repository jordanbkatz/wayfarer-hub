import React from 'react';
import { X } from 'lucide-react';

interface ExportSummaryModalProps {
  compiledMarkdown: string | null;
  setCompiledMarkdown: (val: string | null) => void;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  compiledMarkdown,
  setCompiledMarkdown,
}) => {
  if (!compiledMarkdown) return null;

  return (
    <div className="scandi-modal-overlay">
      <div className="scandi-modal-content" style={{ maxWidth: '650px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>Compiled Itinerary Summary</h3>
          <button onClick={() => setCompiledMarkdown(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '380px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
          {compiledMarkdown}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => navigator.clipboard.writeText(compiledMarkdown)} className="scandi-btn-secondary">
            Copy Markdown
          </button>
          <button onClick={() => window.print()} className="scandi-btn">
            Print Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSummaryModal;
