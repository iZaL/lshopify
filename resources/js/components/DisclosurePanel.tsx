import React from 'react';
import {Disclosure} from '@headlessui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid';

const DisclosureButton = ({open, title}: {open: boolean; title: string}) => {
  return (
    <h3 className="-mx-2 -my-3 flow-root">
      <Disclosure.Button
        className={`flex w-full items-center justify-between rounded-sm bg-white px-2 py-2 text-gray-400 ${
          !open && 'focus:ring-2 focus:ring-blue-500'
        } border-radius-2 hover:bg-gray-100 hover:text-gray-500`}>
        <span className="font-medium text-gray-900">{title}</span>
        <span className="ml-6 flex items-center">
          {open ? (
            <ChevronUpIcon
              className="text-black-50 h-6 w-6"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="text-black-50 h-6 w-6"
              aria-hidden="true"
            />
          )}
        </span>
      </Disclosure.Button>
    </h3>
  );
};

export default function DisclosurePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Disclosure as="div" className="">
      {({open}) => (
        <>
          <DisclosureButton open={open} title={title} />
          <Disclosure.Panel className="pt-4" static={open}>
            <div className="space-y-2">{children}</div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
