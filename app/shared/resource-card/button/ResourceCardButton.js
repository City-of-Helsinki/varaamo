import React from 'react';
import Button from 'react-bootstrap/lib/Button';

export default function ResourceCardIcon({ className, }) {
  return (
    <Button>
      <img
        alt={alt}
        className="app-ResourceCard__info-icon"
        src={iconHome}
      />
      <span className="app-ResourceCard__info-label">
        {resource.type ? resource.type.name : '\u00A0'}
      </span>
    </Button>
  );
}
