import React, {ReactNode} from 'react';

interface CardProps {
  children: ReactNode;
  cardStyle?: string;
}

export default function Card({children, cardStyle}: CardProps) {
  return (
    <div className={`space-y-4 rounded-lg bg-white p-4 shadow ${cardStyle}`}>
      {children}
    </div>
  );
}
