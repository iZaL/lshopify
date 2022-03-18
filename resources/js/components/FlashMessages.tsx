import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {usePage} from '@inertiajs/inertia-react';
import {XIcon} from '@heroicons/react/solid';
import {ErrorBag, Errors, Page} from '@inertiajs/inertia';
import {Transition} from '@headlessui/react';
import Button from './Button';

type FlashMessageType = {
  success: string | null;
  error: string | null;
  warning: string | null;
  info: string | null;
};

interface Props extends Page {
  props: {
    env: 'local' | 'production' | 'testing';
    flash: FlashMessageType;
    errors: Errors & ErrorBag;
  };
}

const Content = ({
  children,
  type,
  setVisible,
}: {
  children: React.ReactNode;
  type: keyof FlashMessageType;
  setVisible: (visibility: boolean) => void;
}) => {
  let themeStyle = 'text-white bg-green-500 border-green-300';

  switch (type) {
    case 'error':
      themeStyle = `text-white bg-red-500 border-red-700`;
      break;
    case 'warning':
      themeStyle = `text-white bg-yellow-400 border-yellow-300`;
      break;
    case 'info':
      themeStyle = `text-white bg-blue-400 border-blue-700`;
      break;
    case 'success':
      themeStyle = `text-white bg-green-500 border-green-700`;
      break;
  }

  return (
    <div className="relative">
      <div className={`mx-6 mt-6 border-l-4 p-4  ${themeStyle}`}>
        <div className="flex items-center">
          <div className="">{children}</div>
          <div className="ml-auto pl-3">
            <div className="">
              <Button theme="default" onClick={() => setVisible(false)}>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FlashMessages() {
  const [visible, setVisible] = useState(false);
  const {flash, errors, env} = usePage<Props>().props;
  //
  let flashMessage: {type: keyof FlashMessageType; message: string | null} = useMemo(() => {
    return {
      type: 'success',
      message: null,
    };
  }, []);

  if (flash) {
    if (flash.success) {
      flashMessage = {type: 'success', message: flash.success};
    } else if (flash.error) {
      flashMessage = {type: 'error', message: flash.error};
    } else if (flash.warning) {
      flashMessage = {type: 'warning', message: flash.warning};
    } else if (flash.info) {
      flashMessage = {type: 'info', message: flash.info};
    }
  }

  // if(flash){
  //     (Object.keys(flash) as Array<keyof typeof flash>).forEach((key) => {
  //         let message = flash[key];
  //         if (message) {
  //             return (flashMessage = {
  //                 type: key,
  //                 message: message,
  //             });
  //         }
  //         return;
  //     });
  // }

  const errorMessages: Array<string> = useMemo(
    () => (errors ? Object.keys(errors).map(key => errors[key]) : []),
    [errors],
  );

  useEffect(() => {
    if (flashMessage.message || errorMessages.length) {
      setVisible(true);
    }
  }, [flashMessage, errorMessages]);

  let message: string | ReactNode = flashMessage.message;
  let flashMessageType: keyof FlashMessageType = flashMessage.type;

  if (errorMessages.length) {
    flashMessageType = 'error';

    message = (
      <>
        <h3 className={`text-sm font-medium text-gray-50`}>
          There were error with your submission
        </h3>
        <div className={`mt-2 text-sm text-gray-50`}>
          <ul className="list-disc space-y-1 pl-5">
            {errorMessages.map((msg, index) => {
              return <li key={index}>{msg}</li>;
            })}
          </ul>
        </div>
      </>
    );
  } else {
    switch (flashMessage.type) {
      case 'error':
        message = flash.error
          ? env === 'local'
            ? flash.error
            : 'uh oh! error occured'
          : `There were error with your submission`;
        break;
      case 'success':
        message = message ?? 'Saved';
        break;
      case 'warning':
        message = message ?? 'Warning';
        break;
      case 'info':
        message = message ?? 'Info';
        break;
    }
  }

  return (
    <Transition
      show={visible}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <Content type={flashMessageType} setVisible={visibility => setVisible(visibility)}>
        <div>{message}</div>
      </Content>
    </Transition>
  );
}
