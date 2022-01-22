import React, {ReactNode} from 'react';
import OutsideClickHandler from './OutsideClickHandler';

interface Props {
  items?: Array<{title: string; onClick: () => void}>;
  visible: boolean;
  setVisible: (visibility: boolean) => void;
  children?: ReactNode;
  width?: string;
}

export default function Dropdown({
  items,
  visible,
  setVisible,
  children,
  width = 'w-full',
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(!visible)}>
      <div
        className={`origin-center absolute right-0 ${width} min-w-[10rem] mt-2 bg-white rounded-md shadow-lg max-h-[320px] ring-1 ring-black ring-opacity-5 overflow-y-scroll`}>
        {items?.length ? (
          <ul className="text-sm p-2 text-black ">
            {items.map((item, i) => (
              <li
                key={i}
                onClick={item.onClick}
                className="block p-2 hover:bg-gray-100">
                {item.title}
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </OutsideClickHandler>
  );
}
