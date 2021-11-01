import React, {ReactNode} from 'react';
import Button from './Button';

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
  theme = 'green',
  hideCancelButton = false,
  children,
}: Props) {
  let bg = 'bg-green-600';
  let hoverBg = 'hover:bg-green-700';

  if (theme === 'red') {
    bg = 'bg-red-600';
    hoverBg = 'hover:bg-red-700';
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
      <Button onClick={() => onProceed()} theme='success'>
        {submitButtonTitle}
      </Button>

      {!hideCancelButton && (
        <Button theme='default' onClick={onHideModal} style='mr-5'>
          Cancel
        </Button>
      )}

      {children && children}
    </div>
  );
}
