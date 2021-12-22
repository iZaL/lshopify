import React from 'react';
import {Disclosure} from '@headlessui/react';
import {darkModeState, filteredNavigationState, sidebarState} from '../atoms';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {Link} from '@inertiajs/inertia-react';
import classNames from 'classnames';
import {Switch} from '@headlessui/react';

export default function SidebarNav() {
  const navigation = useRecoilValue(filteredNavigationState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  const listItemStyle =
    'text-gray-700 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600';
  const listItemActiveStyle =
    'bg-grey-300 text-gray-600 dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-500  hover:bg-gray-50 hover:text-gray-700';

  const listItemActiveIconStyle = 'text-green-700 dark:text-green-500';
  const listItemIconStyle =
    'text-gray-600 dark:text-green-500 group-hover:text-gray-500';

  const listDropItemActiveStyle =
    'text-gray-700 hover:text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-800 dark:hover:text-gray-100';
  const listDropItemStyle =
    'text-gray-700 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100';

  return (
    <div>
      <nav className='flex-1 px-2 space-y-1' aria-label='Sidebar'>
        {navigation.map((item) =>
          !item.children ? (
            <div key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  item.current ? listItemActiveStyle : listItemStyle,
                  ' group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={classNames(
                    item.current ? listItemActiveIconStyle : listItemIconStyle,
                    'mr-3 h-5 h-5'
                  )}
                  aria-hidden='true'
                />
                {item.name}
              </Link>
            </div>
          ) : (
            <Disclosure as='div' key={item.name} className='space-y-1'>
              {({open}) => {
                return (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current ? listItemActiveStyle : listItemStyle,
                        'group w-full flex items-center pl-2 pr-1 py-2 text-sm font-medium rounded-md focus:outline-none '
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? listItemActiveIconStyle
                            : listItemIconStyle,
                          'mr-3 h-5 h-5'
                        )}
                      />
                      {item.name}
                      <svg
                        className={classNames(
                          open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                          'ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                        )}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                      >
                        <path d='M6 6L14 10L6 14V6Z' fill='currentColor' />
                      </svg>
                    </Disclosure.Button>

                    <Disclosure.Panel className='space-y-1'>
                      {item?.children?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={classNames(
                            item.current
                              ? listDropItemActiveStyle
                              : listDropItemStyle,
                            'group w-full flex items-center pl-11 pr-2 py-2 text-sm font-normal rounded-md'
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </Disclosure.Panel>
                  </>
                );
              }}
            </Disclosure>
          )
        )}
      </nav>

      <div className='flex justify-end px-2 py-4'>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className={`${
            darkMode ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className='sr-only'>Dark</span>
          <span
            className={`${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
      </div>
    </div>
  );
}
