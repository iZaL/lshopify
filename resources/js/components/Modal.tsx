import React, {Fragment, ReactNode, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import ModalFooter from './ModalFooter';
import Button from './Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  heading: string;
  submitButtonTitle?: string;
  subHeading?: string;
  children?: ReactNode;
  onConfirm: () => void;
  theme?: string;
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
        className="fixed z-40 inset-0 overflow-y-auto mx-10"
        open={visible}
        onClose={onHideModal}>
        <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="sm:inline-block sm:align-middle sm:h-screen"
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
              className={`inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${width} sm:w-full `}>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    <h3 className="sticky text-lg leading-6 font-medium text-gray-900">
                      {heading}
                    </h3>
                    {subHeading && (
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {subHeading}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 mt-2 flex-shrink-0">
                    <Button
                      onClick={onHideModal}
                      theme="default"
                      // className='relative inline-flex items-center px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 ring-0'
                    >
                      X
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-y-scroll max-h-[30rem]">
                {children}
              </div>

              {!hideFooter && (
                <ModalFooter
                  onHideModal={onHideModal}
                  onProceed={onProceed}
                  submitButtonTitle={submitButtonTitle}
                  hideCancelButton={hideCancelButton}
                />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
