import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', interactive = false, onClick }) => {
  return (
    <div 
      className={`card ${interactive ? 'card--interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, children, className = '' }) => (
  <div className={`card__header ${className}`}>
    {title ? <h3 className="card__title">{title}</h3> : null}
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>
    {children}
  </div>
);
