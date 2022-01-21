import React, {useState, useContext} from 'react';
import classNames from 'classnames';
import {Link} from '@inertiajs/inertia-react';
import DropdownAlt from './DropdownAlt';
import route from 'ziggy-js';
import {Disclosure, Switch} from '@headlessui/react';

const listItemStyle =
  'text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600';
const listItemActiveStyle =
  'bg-grey-300 text-gray-600 dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-gray-500  hover:bg-gray-100 hover:text-gray-700';

const listItemActiveIconStyle = 'text-green-700 dark:text-green-500';
const listItemIconStyle =
  'text-gray-600 dark:text-green-500 group-hover:text-gray-500';

const listDropItemActiveStyle =
  'text-gray-700 hover:text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-800 dark:hover:text-gray-100';
const listDropItemStyle =
  'text-gray-700 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100';

interface Props {
  children: React.ReactNode;
}

const NavigatorContext: any = React.createContext(null);

const Navigator = ({children}: Props) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(previousState => !previousState);
  };

  return (
    <NavigatorContext.Provider value={{open, setOpen, toggleOpen}}>
      <div className="relative">{children}</div>
    </NavigatorContext.Provider>
  );
};

interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  dropdown?: boolean;
  name: string;
}

const NavItem = ({children, active, dropdown, name}: NavItemProps) => {
  return (
    <div
      className={classNames(
        'flex items-center px-4 py-2 text-sm font-medium text-gray-900',
        {'bg-gray-100': active},
        {'hover:bg-gray-200': active},
      )}>
      {dropdown ? (
        <>
          <Disclosure as="div" className="space-y-1">
            {({open}) => {
              return (
                <>
                  <Disclosure.Button
                    className={classNames(
                      active ? listItemActiveStyle : listItemStyle,
                      'group w-full flex items-center pl-2 pr-1 py-2 text-sm font-semibold rounded-md focus:outline-none ',
                    )}>
                    {name}
                    <svg
                      className={classNames(
                        open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                        'ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150',
                      )}
                      viewBox="0 0 20 20"
                      aria-hidden="true">
                      <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                    </svg>
                  </Disclosure.Button>
                  {children}
                </>
              );
            }}
          </Disclosure>
        </>
      ) : (
        children
      )}
    </div>
  );
};

interface NavSubItemProps {
  children?: React.ReactNode;
  href: string;
  name: string;
  active?:boolean;
}

const NavSubItem = ({name, active, href}: NavSubItemProps) => {
  return (
    <Disclosure.Panel className="space-y-1">
      <Link
        href={href}
        className={classNames(
          active ? listDropItemActiveStyle : listDropItemStyle,
          'group w-full flex items-center pl-11 pr-2 py-2 text-sm font-normal rounded-md',
        )}>
        {name}
      </Link>
    </Disclosure.Panel>
  )
};

Navigator.Item = NavItem;
Navigator.SubItem = NavSubItem;

export default Navigator;
