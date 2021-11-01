import React, {ReactNode} from 'react';

interface CardProps {
  children: ReactNode;
  style?: string;
}

export default function Card({children, style}: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 dark:border dark:border-gray-500  shadow p-4 space-y-4 ${style}`}
    >
      {children}
    </div>
  );
}
