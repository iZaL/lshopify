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
    <div className="mt-1 flex rounded-md shadow-sm">
      <textarea
        name={name}
        id={name}
        autoComplete={autocomplete ? autocomplete : ''}
        placeholder={placeholder}
        className={`focus:blue-500 block w-full rounded-md border border-gray-300 py-2 px-4 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-500 dark:bg-gray-800 sm:text-sm ${style}`}
        {...props}
      />
    </div>
  );
}
