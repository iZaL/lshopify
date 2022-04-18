import React from 'react';

interface Props {
  borderStyle?: string;
}

export default function Border({borderStyle}: Props) {
  return (
    <div className={`my-3 w-full border-t border-gray-200 ${borderStyle}`} />
  );
}
