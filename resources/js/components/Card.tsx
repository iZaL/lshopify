import React, {ReactNode} from 'react';

interface CardProps {
  children: ReactNode;
  cardStyle?: string;
}

export default function Card({children, cardStyle}: CardProps) {
  return (
    <div
      className={`space-y-4 rounded-lg bg-white p-4 shadow dark:border  dark:border-gray-500 dark:bg-gray-800 dark:text-gray-200 ${cardStyle}`}>
      {children}
    </div>
  );
}
