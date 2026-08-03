import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewSection from '../components/ReviewSection';

describe('ReviewSection Component', () => {
  test('renders empty chat message prompt when no messages exist', () => {
    render(
      <ReviewSection
        chats={[]}
        user={{ uid: 'user-1', email: 'alice@example.com' } as any}
        newMessage=""
        setNewMessage={() => {}}
        editingChatId={null}
        setEditingChatId={() => {}}
        editingChatText=""
        setEditingChatText={() => {}}
        handleSendMessage={(e) => e.preventDefault()}
        handleSaveEditMessage={() => {}}
        handleDeleteMessage={() => {}}
        chatEndRef={React.createRef()}
      />
    );

    expect(screen.getByText(/Trip Journal Chat/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write a message to your trip collaborators.../i)).toBeInTheDocument();
  });
});
