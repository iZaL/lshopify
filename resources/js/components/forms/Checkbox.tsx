import React from 'react';

interface Props {
  name: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: string;
}

export default function Checkbox({
  name,
  label,
  inputStyle,
  checked = false,
  onChange,
}: Props) {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${inputStyle}`}
          checked={checked}
          onChange={onChange}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="">
            {label}
          </label>
        </div>
      )}
    </div>
  );
}
