import React, {ReactNode} from 'react';

interface Props {
  name: string;
  autocomplete?: string;
  placeholder?: string;
  inputStyle?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  children: ReactNode;
}

export default function Select({
  name,
  inputStyle,
  value,
  children,
  onChange,
}: Props) {
  return (
    <select
      name={name}
      id={name}
      value={value}
      onChange={e => onChange(e)}
      className={`focus:blue-500 block w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 shadow-sm focus:border-blue-500 focus:outline-none
        dark:border-gray-500 dark:bg-gray-800 hover:dark:bg-gray-500 sm:text-sm ${inputStyle}`}>
      {children}
    </select>
  );
}
