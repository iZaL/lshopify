import React, {ReactNode} from 'react';

interface Props {
  name: string;
  autocomplete?: string;
  placeholder?: string;
  style?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  children: ReactNode;
}

export default function Select({
  name,
  autocomplete,
  placeholder,
  style,
  value,
  children,
  onChange,
  ...props
}: Props) {
  return (
    <select
      name={name}
      id={name}
      value={value}
      onChange={e => onChange(e)}
      className={`block w-full dark:bg-gray-800 hover:dark:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-2 pl-4 pr-10 
        focus:outline-none focus:blue-500 focus:border-blue-500 sm:text-sm ${style}`}>
      {children}
    </select>
  );
}
