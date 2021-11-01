import React from 'react';

interface Props {
  style?: string;
}

export default function Border({style}: Props) {
  return (
    <div
      className={`w-full border-t border-gray-200 dark:border-gray-500 my-3 ${style}`}
    />
  );
}
