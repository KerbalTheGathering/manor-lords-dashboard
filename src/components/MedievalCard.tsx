import React from 'react';

interface MedievalCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function MedievalCard({ title, children, className = '' }: MedievalCardProps) {
  return (
    <div className={`medieval-card ${className}`}>
      {title && <h3 className="medieval-card-header text-xl">{title}</h3>}
      {children}
    </div>
  );
}
