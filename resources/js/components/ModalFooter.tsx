import React, { ReactNode } from 'react'
import Button from './Button'

interface Props {
  onHideModal: () => void;
  onProceed: () => void;
  submitButtonTitle?: string;
  theme?: string;
  children?: ReactNode;
  hideCancelButton?: boolean;
}

export default function ModalFooter({
  onHideModal,
  onProceed,
  submitButtonTitle = 'Done',
  hideCancelButton = false,
  children,
}: Props) {

  return (
    <div className="bg-gray-50 dark:bg-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <Button onClick={() => onProceed()} theme="success">
        {submitButtonTitle}
      </Button>

      {!hideCancelButton && (
        <Button theme="default" onClick={onHideModal} style="mr-5">
          Cancel
        </Button>
      )}

      {children && children}
    </div>
  );
}
