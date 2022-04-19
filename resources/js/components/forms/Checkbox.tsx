import React from 'react';
import classNames from 'classnames';

interface Props {
  type?:'radio' | 'checkbox';
  name?: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: string;
  labelStyle?: string;
}

export default function Checkbox({
  type = 'checkbox',
  name,
  label,
  inputStyle,
  labelStyle,
  checked = false,
  onChange,
}: Props) {
  return (
    <div className="relative inline-flex items-center space-x-2">
      <input
        id={name}
        name={name}
        type={type}
        checked={checked}
        className={classNames(
          {'focus:shadow-outline h-4 w-4 rounded border-gray-500 text-indigo-500 focus:outline-none': type==='checkbox'},
          inputStyle,
        )}
        onChange={onChange}
      />
      {label && (
        <div className="text-sm">
          <label htmlFor="comments" className={labelStyle}>
            {label}
          </label>
        </div>
      )}
    </div>
  );
}
