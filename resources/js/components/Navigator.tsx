import {Disclosure} from '@headlessui/react';
import {Link} from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface NavItemProps {
  children?: React.ReactNode;
  active?: boolean;
  dropdown?: boolean;
  name: string;
  href: string;
}

interface NavSubItemProps {
  children?: React.ReactNode;
  href: string;
  name: string;
  active?: boolean;
}

const Navigator = ({children}: Props) => {
  return (
    <nav className="flex-1 space-y-1 px-2" aria-label="Sidebar">
      {children}
    </nav>
  );
};

const NavItem = ({children, href, active, dropdown, name}: NavItemProps) => {
  if (dropdown) {
    return (
      <Disclosure as="div" className="space-y-1" defaultOpen={active}>
        {({open}) => {
          return (
            <>
              <Disclosure.Button
                as="a"
                className={classNames(
                  'group flex w-full items-center rounded-md py-2 pl-2 text-sm font-semibold text-gray-800 hover:bg-gray-100',
                  active ? 'text-green-800' : '',
                )}
                href={href}>
                {name}
                <svg
                  className={classNames(
                    'ml-auto h-5 w-5 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400',
                    open ? 'rotate-90 text-gray-400' : 'text-gray-300',
                  )}
                  viewBox="0 0 20 20"
                  aria-hidden="true">
                  <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                </svg>
              </Disclosure.Button>
              {open && children}
            </>
          );
        }}
      </Disclosure>
    );
  }

  if (children) {
    return <>{children}</>;
  }

  return (
    <Link
      href={href}
      className={classNames(
        'group flex w-full items-center rounded-md py-2 pl-2 text-sm font-semibold text-gray-800 hover:bg-gray-100',
        active ? 'bg-gray-200 text-green-800' : '',
      )}>
      {name}
    </Link>
  );
};

const NavSubItem = ({name, active, href}: NavSubItemProps) => {
  return (
    <Disclosure.Panel className="space-y-1" static>
      <Link
        href={href}
        className={classNames(
          'group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-normal',
          active ? 'bg-gray-100 text-green-800' : '',
        )}>
        {name}
      </Link>
    </Disclosure.Panel>
  );
};

Navigator.Item = NavItem;
Navigator.SubItem = NavSubItem;

export default Navigator;
