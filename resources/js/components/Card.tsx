import React, {ReactNode} from 'react';

interface CardProps {
  children: ReactNode;
  cardStyle?: string;
}

export default function Card({children, cardStyle}: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 dark:border dark:border-gray-500  shadow p-4 space-y-4 ${cardStyle}`}>
      {children}
    </div>
  );
}
