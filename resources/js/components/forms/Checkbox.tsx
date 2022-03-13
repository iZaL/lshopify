import React from 'react';

interface Props {
  name: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: string;
}

export default function Checkbox({name, label, inputStyle, checked = false, onChange}: Props) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${inputStyle}`}
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
