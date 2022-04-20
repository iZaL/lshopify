import {Dialog, Transition} from '@headlessui/react';
import React, {Fragment, ReactNode, useEffect, useState} from 'react';

import {ButtonTheme} from '../types';

import Button from './Button';
import ModalFooter from './ModalFooter';

interface Props {
  visible: boolean;
  onClose: () => void;
  heading: string;
  submitButtonTitle?: string;
  subHeading?: string;
  children?: ReactNode;
  onConfirm: () => void;
  theme?: ButtonTheme;
  width?: string;
  hideFooter?: boolean;
  hideCancelButton?: boolean;
}

export default function Modal({
  visible,
  heading,
  subHeading,
  children,
  onClose,
  onConfirm,
  width = 'max-w-2xl',
  submitButtonTitle = 'Done',
  hideFooter = false,
  hideCancelButton = false,
  theme = 'success',
}: Props) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(visible);
  }, [visible]);

  const onHideModal = () => {
    if (visible) {
      setRendered(false);
    }
    onClose();
  };

  const onProceed = () => {
    setRendered(false);
    onConfirm();
  };

  return (
    <Transition.Root show={rendered} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-40 mx-10 overflow-y-auto"
        open={visible}
        onClose={onHideModal}>
        <div className="flex min-h-screen items-center justify-center text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " />
          </Transition.Child>

          <span
            className="sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div
              className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${width} sm:w-full `}>
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    <h3 className="sticky text-lg font-medium leading-6 text-gray-900">
                      {heading}
                    </h3>
                    {subHeading && (
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {subHeading}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 mt-2 flex-shrink-0">
                    <Button onClick={onHideModal} theme="default">
                      X
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative max-h-[30rem] overflow-y-scroll">
                {children}
              </div>

              {!hideFooter && (
                <ModalFooter
                  onHideModal={onHideModal}
                  onProceed={onProceed}
                  submitButtonTitle={submitButtonTitle}
                  hideCancelButton={hideCancelButton}
                  theme={theme}
                />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
