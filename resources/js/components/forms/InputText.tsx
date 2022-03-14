import React, {ReactNode} from 'react';
import classNames from 'classnames';

interface Props {
  name: string;
  type?: string;
  autocomplete?: string;
  placeholder?: string;
  inputStyle?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: any;
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
      } focus:none px-3 focus:border-none focus:outline-none ${
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
    <div className="relative">
      {leftComponent && (
        <Button onClick={leftComponentOnClick} position="left">
          {leftComponent}
        </Button>
      )}
      <input
        type={type ? type : 'text'}
        name={name}
        id={name}
        autoComplete={autocomplete ? autocomplete : ''}
        placeholder={placeholder ? placeholder : ''}
        className={classNames(
          'focus:blue-500 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm',
          leftComponent && 'pl-[3rem]',
          inputStyle,
        )}
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
