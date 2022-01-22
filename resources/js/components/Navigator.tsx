import React from 'react';
import classNames from 'classnames';
import {Link} from '@inertiajs/inertia-react';
import {Disclosure} from '@headlessui/react';

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
    <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
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
                  'group w-full flex items-center pl-2 py-2 text-sm font-semibold rounded-md text-gray-800 hover:bg-gray-100',
                  active ? 'text-green-800' : '',
                )}
                href={href}>
                {name}
                <svg
                  className={classNames(
                    'ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150',
                    open ? 'text-gray-400 rotate-90' : 'text-gray-300',
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
        'group w-full flex items-center pl-2 py-2 text-sm font-semibold rounded-md text-gray-800 hover:bg-gray-100',
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
          'group w-full flex items-center pl-11 pr-2 py-2 text-sm font-normal rounded-md',
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
