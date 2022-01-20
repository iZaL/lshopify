import React from 'react';

interface Props {
  text: string;
  style?: string;
}

export default function Subheader({text, style}: Props) {
  return (
    <h1
      className={`text-md font-semibold text-gray-900 dark:text-gray-50 ${style}`}>
      {text}
    </h1>
  );
}
