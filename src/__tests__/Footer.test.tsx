import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders footer with link to jordankatz.dev', () => {
    render(<Footer />);
    const linkElement = screen.getByText(/a Jordan Katz project/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute('href')).toBe('https://jordankatz.dev');
  });
});
