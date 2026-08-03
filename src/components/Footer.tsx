import React from 'react';

interface FooterProps {
  style?: React.CSSProperties;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ style, className = "jordan-katz-footer" }) => {
  return (
    <footer className={className} style={style}>
      <a href="https://jordankatz.dev" target="_blank" rel="noopener noreferrer">
        a Jordan Katz project
      </a>
    </footer>
  );
};

export default Footer;
