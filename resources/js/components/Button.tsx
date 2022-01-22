import React, {ReactNode} from 'react';
import classNames from 'classnames';

interface Props {
  buttonStyle?: string;
  onClick?: () => void;
  theme?: 'success' | 'error' | 'warning' | 'default' | 'clear';
  border?: boolean;
  rounded?: boolean;
  children?: ReactNode;
}

export default function Button({
  theme = 'success',
  border = true,
  buttonStyle,
  children,
  onClick,
}: Props) {
  let themeStyle = `text-white bg-green-700 hover:bg-green-900 focus:ring-1 focus:ring-offset-2 focus:ring-green-500 focus:border-green-500`;

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

  return (
    <button
      onClick={onClick ?? undefined}
      className={classNames(
        theme === 'clear' ? `` : `py-2 px-4 rounded-md`,
        ` box-border block inline-flex text-sm text-center justify-center items-center focus:outline-none ${themeStyle} ${buttonStyle} `,
      )}>
      {children}
    </button>
  );
}
