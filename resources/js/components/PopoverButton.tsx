import React from 'react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import {Popover} from '@headlessui/react';
import classNames from 'classnames';

export default function PopoverButton({
  title,
  children,
  buttonStyle,

}: {
  title: string;
  children: React.ReactNode;
  buttonStyle?: string;
}) {
  return (
    <Popover className="relative inline-block text-left">
      <Popover.Button
        className={classNames(
          `group hidden justify-center border border-gray-300 px-4
                       py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 sm:inline-flex
            `,
          buttonStyle
        )}>
        <span>{title}</span>
        <ChevronDownIcon
          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
        {children}
      </Popover.Panel>
    </Popover>
  );
}
