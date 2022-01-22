import React from 'react';

interface Props {
  borderStyle?: string;
}

export default function Border({borderStyle}: Props) {
  return (
    <div
      className={`w-full border-t border-gray-200 dark:border-gray-500 my-3 ${borderStyle}`}
    />
  );
}
