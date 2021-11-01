import React from 'react';

interface LabelProps {
  title: string;
  style?: string;
}

export default function Label({title, style}: LabelProps) {
  return (
    <label
      htmlFor={title}
      className={`block text-sm text-gray-900 dark:text-gray-100 ${style}`}
    >
      {title}
    </label>
  );
}
