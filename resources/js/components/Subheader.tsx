import React from 'react';

interface Props {
  text: string;
  headerStyle?: string;
}

export default function Subheader({text, headerStyle}: Props) {
  return (
    <h1 className={`text-md font-semibold text-gray-900 ${headerStyle}`}>
      {text}
    </h1>
  );
}
