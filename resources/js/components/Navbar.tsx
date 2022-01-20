import React, {Fragment} from 'react';
import {useSetRecoilState} from 'recoil';
import {sidebarState} from '../atoms';
import {MenuAlt2Icon} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/solid';
import {Menu, Transition} from '@headlessui/react';
import classNames from 'classnames';

const userNavigation = [
  {name: 'Your Profile', href: '#'},
  {name: 'Settings', href: '#'},
  {name: 'Sign out', href: '#'},
];

export default function Navbar() {
  const setSidebarOpen = useSetRecoilState(sidebarState);

  return (
    <div className="relative flex-shrink-0 flex h-16 bg-white dark:bg-gray-900 shadow">
      <button
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(true)}>
        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search_field"
                className="block dark:bg-gray-900 dark:text-white w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <Menu as="div" className="ml-3 relative">
            {({open}) => (
              <>
                <div>
                  <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-0 focus:border-transparent">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                      <span className="text-sm font-medium leading-none text-white">
                        AA
                      </span>
                    </span>
                    <span className="pl-2">Afzal Abbas</span>
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Menu.Items
                    static
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map(item => (
                      <Menu.Item key={item.name}>
                        {({active}) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700',
                            )}>
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
