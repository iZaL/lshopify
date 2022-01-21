import React, {useState, useContext} from 'react';
import {Link} from '@inertiajs/inertia-react';
import {Transition} from '@headlessui/react';

interface Props {
  children: React.ReactNode;
}

const DropDownContext: any = React.createContext(null);

const DropdownAlt = ({children}: Props) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(previousState => !previousState);
  };

  return (
    <DropDownContext.Provider value={{open, setOpen, toggleOpen}}>
      <div className="relative">{children}</div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({children}: {children: React.ReactNode}) => {
  const {open, setOpen, toggleOpen}: any = useContext(DropDownContext);

  return (
    <>
      <div onClick={toggleOpen}>{children}</div>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}></div>
      )}
    </>
  );
};

interface ContentProps {
  align?: 'left' | 'right';
  width?: string;
  contentClasses?: string;
  children: React.ReactNode;
}

const Content = ({
  align = 'right',
  width = '48',
  contentClasses = 'py-1 bg-white',
  children,
}: ContentProps) => {
  const {open, setOpen}: any = useContext(DropDownContext);

  let alignmentClasses = 'origin-top';

  if (align === 'left') {
    alignmentClasses = 'origin-top-left left-0';
  } else if (align === 'right') {
    alignmentClasses = 'origin-top-right right-0';
  }

  let widthClasses = '';

  if (width === '48') {
    widthClasses = 'w-48';
  }

  return (
    <>
      <Transition
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        {open && (
          <div
            className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
            onClick={() => setOpen(false)}>
            <div
              className={
                `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses
              }>
              {children}
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

interface DropdownLinkProps {
  href: string;
  method?: string;
  as?: string;
  children: React.ReactNode;
}

const DropdownLink = ({
  href,
  method = 'post',
  as = 'a',
  children,
}: DropdownLinkProps) => {
  return (
    <Link
      href={href}
      method={method}
      as={as}
      className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
      {children}
    </Link>
  );
};

DropdownAlt.Trigger = Trigger;
DropdownAlt.Content = Content;
DropdownAlt.Link = DropdownLink;

export default DropdownAlt;
