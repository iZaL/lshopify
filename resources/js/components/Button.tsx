import React from 'react';
import classNames from 'classnames';
import {ButtonProps} from '../types';

export default function Button({
  theme = 'success',
  disabled = false,
  border = true,
  buttonStyle,
  children,
  onClick,
}: ButtonProps) {
  let themeStyle = `text-white bg-green-800 hover:bg-green-900 focus:ring-1 focus:ring-offset-2 focus:ring-green-500 focus:border-green-500`;

  switch (theme) {
    case 'error':
      themeStyle = `text-white bg-red-500 ${
        border && 'border'
      } border-red-300 hover:bg-red-700 focus:ring-1 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500`;
      break;
    case 'warning':
      themeStyle = `text-white bg-yellow-700 ${
        border && 'border'
      } border-yellow-300 hover:bg-yellow-900 focus:ring-1 focus:ring-offset-2 focus:ring-yellow-500 focus:border-yellow-500`;
      break;
    case 'clear':
      themeStyle = `dark:text-gray-100 bg-transparent`;
      break;
    case 'default':
      themeStyle = `text-gray-800 dark:text-gray-100 dark:hover:text-gray-900 ${
        border && 'border'
      } border-gray-300 hover:bg-gray-100 `;
      break;
  }

  if (disabled) {
    themeStyle = 'text-gray-300 bg-white border-none cursor-default';
  }

  return (
    <button
      onClick={disabled ? undefined : onClick ?? undefined}
      className={classNames(
        theme === 'clear' ? `` : `rounded-md py-2 px-4`,
        ` box-border block inline-flex items-center justify-center text-center text-sm focus:outline-none ${themeStyle} ${buttonStyle} `,
      )}>
      {children}
    </button>
  );
}
