import React from 'react';

interface TextAreaProps {
  name: string;
  autocomplete?: string;
  placeholder?: string;
  style?: string;
  onChange: any;
  value?: string;
}

export default function TextArea({
  name,
  autocomplete,
  placeholder,
  style,
  ...props
}: TextAreaProps) {
  return (
    <div className='mt-1 flex rounded-md shadow-sm'>
      <textarea
        name={name}
        id={name}
        autoComplete={autocomplete ? autocomplete : ''}
        placeholder={placeholder}
        className={`dark:bg-gray-800 block w-full border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:blue-500 focus:border-blue-500 sm:text-sm ${style}`}
        {...props}
      />
    </div>
  );
}
