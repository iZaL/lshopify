import React from 'react';

interface Props {
  text: string;
}

export default function PageHeader({text}: Props) {
  return (
    <div className='flex items-center'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
        {text}
      </h1>
    </div>
  );
}
