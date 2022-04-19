import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import React, {Fragment} from 'react';

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
          `group hidden justify-center border border-gray-300 px-2 py-2 text-sm hover:bg-gray-50 sm:inline-flex
            `,
          buttonStyle,
        )}>
        <span>{title}</span>
        <ChevronDownIcon
          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
