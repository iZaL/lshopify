import React, {ReactNode} from 'react';

interface Props {
  name: string;
  type?:string;
  autocomplete?: string;
  placeholder?: string;
  inputStyle?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  leftComponentOnClick?: ReactNode;
  rightComponentOnClick?: () => void;
  // [x: string]: any;
}

const Button = ({
  children,
  onClick,
  position = 'right',
}: {
  children: ReactNode;
  onClick?: any;
  position?: 'left' | 'right';
}) => {
  return (
    <button
      className={`absolute inset-y-0 ${
        position === 'right' ? 'right-0' : 'left-0'
      } px-3 focus:outline-none focus:none focus:border-none ${
        !onClick && 'pointer-events-none'
      }  `}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default function InputText({
  name,
  autocomplete,
  placeholder,
  inputStyle,
  leftComponent,
  rightComponent,
  rightComponentOnClick,
  leftComponentOnClick,
  type,
  ...props
}: Props) {
  return (
    <div className="relative rounded-md shadow-sm ">
      {leftComponent && (
        <Button onClick={leftComponentOnClick} position="left">
          {leftComponent}
        </Button>
      )}
      <input
        type={type ? type:'text'}
        name={name}
        id={name}
        autoComplete={autocomplete ? autocomplete : ''}
        placeholder={placeholder ? placeholder : ''}
        className={`block w-full border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-2 pl-4 pr-10 dark:bg-gray-800
        ${leftComponent && 'pl-[3rem]'}
        focus:outline-none focus:blue-500 focus:border-blue-500 sm:text-sm ${inputStyle}`}
        {...props}
      />
      {rightComponent && (
        <Button onClick={rightComponentOnClick} position="right">
          {rightComponent}
        </Button>
      )}
    </div>
  );
}
