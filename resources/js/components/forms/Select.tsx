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
      className={`${inputStyle} block w-full rounded-md border border-gray-300 sm:text-sm
        `}>
      {children}
    </select>
  );
}
