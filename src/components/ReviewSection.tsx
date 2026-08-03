import React from 'react';
import { MessageSquare, Pencil, Trash2, Send } from 'lucide-react';
import type { ChatMessage, User } from '../types';
import { formatMessageTime } from '../types';

interface ReviewSectionProps {
  chats: ChatMessage[];
  user: User | null;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  editingChatId: string | null;
  setEditingChatId: (id: string | null) => void;
  editingChatText: string;
  setEditingChatText: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleSaveEditMessage: (chatId: string) => void;
  handleDeleteMessage: (chatId: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  chats,
  user,
  newMessage,
  setNewMessage,
  editingChatId,
  setEditingChatId,
  editingChatText,
  setEditingChatText,
  handleSendMessage,
  handleSaveEditMessage,
  handleDeleteMessage,
  chatEndRef,
}) => {
  return (
    <div className="scandi-card" style={{ flex: 1, minHeight: '0', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
      
      {/* Chat Room Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg)' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-text)' }}>
          <MessageSquare size={18} style={{ color: 'var(--accent-sage)' }} /> Trip Journal Chat
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
          {chats.length} messages
        </span>
      </div>

      {/* Chat Messages List */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-color)' }}>
        {chats.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--secondary-text)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Start typing to discuss itinerary spots, hotels, flights, or ideas!
          </div>
        ) : (
          chats.map((msg) => {
            const isMe = msg.userId === user?.uid;
            return (
              <div 
                key={msg.id}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: msg.userColor, fontWeight: 600, fontSize: '0.9rem' }}>{msg.userName}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>{formatMessageTime(msg.createdAt)}</span>
                  {isMe && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingChatId(msg.id);
                          setEditingChatText(msg.text);
                        }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
                        title="Edit message"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
                        title="Delete message"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                {editingChatId === msg.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', minWidth: '240px' }}>
                    <input
                      type="text"
                      className="scandi-input"
                      value={editingChatText}
                      onChange={(e) => setEditingChatText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditMessage(msg.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      autoFocus
                      style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditingChatId(null)} className="scandi-btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEditMessage(msg.id)} className="scandi-btn" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                        Save Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    backgroundColor: isMe ? 'var(--primary-text)' : 'var(--card-bg)', 
                    color: isMe ? 'var(--bg-color)' : 'var(--primary-text)', 
                    border: isMe ? 'none' : '1px solid var(--border-color)',
                    padding: '12px 16px', 
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                    {msg.editedAt && (
                      <span style={{ fontSize: '0.7rem', opacity: 0.7, fontStyle: 'italic', marginLeft: '6px' }}>(edited)</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Submission Form */}
      <form onSubmit={handleSendMessage} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          className="scandi-input" 
          placeholder="Write a message to your trip collaborators..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="scandi-btn">
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
