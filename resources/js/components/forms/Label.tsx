import React from 'react';

interface LabelProps {
  title: string;
  labelStyle?: string;
}

export default function Label({title, labelStyle}: LabelProps) {
  return (
    <label
      htmlFor={title}
      className={`block text-sm text-gray-900 ${labelStyle}`}>
      {title}
    </label>
  );
}
