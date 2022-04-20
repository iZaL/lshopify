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
        className={`absolute right-0 origin-center ${width} mt-2 max-h-[320px] min-w-[10rem] overflow-y-scroll rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
        {items?.length ? (
          <ul className="p-2 text-sm text-black">
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
