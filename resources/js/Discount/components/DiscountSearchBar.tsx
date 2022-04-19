import classNames from 'classnames';
import React from 'react';

interface TabProps {
  name: string;
  href: string;
  active: boolean;
}

interface Props {
  tabs: TabProps[];
}

export default function DiscountSearchBar({tabs}: Props) {
  return (
    <div className="">
      <div className="p-4 md:hidden">
        <select
          id="selected-tab"
          name="selected-tab"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 py-2 text-base focus:border-none focus:outline-none focus:ring-0 sm:text-sm"
          defaultValue={tabs.find(tab => tab?.active)?.name}>
          {tabs.map(tab => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2">
            {tabs.map(tab => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.active
                    ? 'border-green-800 text-green-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'mx-2 whitespace-nowrap border-b-2 py-3 px-6 text-sm font-medium',
                )}>
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
