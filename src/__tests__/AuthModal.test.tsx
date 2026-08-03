import { render, screen } from '@testing-library/react';
import AuthModal from '../components/AuthModal';

describe('AuthModal Component', () => {
  test('renders full-screen sign in view correctly', () => {
    render(
      <AuthModal
        isModal={false}
        isSignUp={false}
        email="test@example.com"
        password="password123"
        displayName=""
        errorMsg=""
        onToggleSignUp={() => {}}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onDisplayNameChange={() => {}}
        onAuthSubmit={(e) => e.preventDefault()}
        onGoogleSignIn={() => {}}
      />
    );

    expect(screen.getByText('Sign in to access your trip itineraries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('renders sign up view when isSignUp is true', () => {
    render(
      <AuthModal
        isModal={false}
        isSignUp={true}
        email=""
        password=""
        displayName="Astrid"
        errorMsg=""
        onToggleSignUp={() => {}}
        onEmailChange={() => {}}
        onPasswordChange={() => {}}
        onDisplayNameChange={() => {}}
        onAuthSubmit={(e) => e.preventDefault()}
        onGoogleSignIn={() => {}}
      />
    );

    expect(screen.getByText('Create an account to start planning journeys')).toBeInTheDocument();
    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });
});
