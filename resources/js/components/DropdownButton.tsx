import React, {useState} from 'react';
import Button from './Button';
import {ChevronDownIcon} from '@heroicons/react/solid';
import {Menu} from '@headlessui/react';
import classNames from 'classnames';
import OutsideClickHandler from './OutsideClickHandler';

interface Props {
  items: Array<{title: string; onClick: () => void}>;
  arrowVisible?: boolean;
  buttonTitle: string;
  width?: string;
  buttonProps?: Record<string, unknown>;
}

export default function DropdownButton({
  items,
  arrowVisible = false,
  buttonTitle,
  width = 'w-full',
  buttonProps,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => {}}>
      <Menu as="div" className="relative z-20">
        <Menu.Button as={'div'}>
          <Button onClick={() => setVisible(!visible)} {...buttonProps}>
            {buttonTitle}
            {arrowVisible && <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />}
          </Button>
        </Menu.Button>

        {/*<Transition*/}
        {/*  as={Fragment}*/}
        {/*  show={visible}*/}
        {/*  enter='transition ease-out duration-100'*/}
        {/*  leave='transition ease-in duration-100'*/}
        {/*>*/}
        <Menu.Items
          className={`origin-top-center absolute right-0 ${width} mt-2 max-h-[320px] min-w-[10rem] max-w-[22rem] overflow-y-scroll rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
          <ul className="p-2 text-sm text-black ">
            {items.map((item, i) => (
              <Menu.Item key={i}>
                {({active, disabled}) => (
                  <li
                    onClick={item.onClick}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      disabled ? 'bg-gray-50 text-gray-300' : '',
                      'block p-2 ',
                    )}>
                    {item.title}
                  </li>
                )}
              </Menu.Item>
            ))}
          </ul>
        </Menu.Items>
        {/*</Transition>*/}
      </Menu>
    </OutsideClickHandler>
  );
}
