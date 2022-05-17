import React, {ReactNode} from 'react';

import {ButtonTheme} from '../types';

import Button from './Button';

interface Props {
  onHideModal: () => void;
  onProceed: () => void;
  submitButtonTitle?: string;
  theme?: ButtonTheme;
  children?: ReactNode;
  hideCancelButton?: boolean;
}

export default function ModalFooter({
  onHideModal,
  onProceed,
  submitButtonTitle = 'Done',
  hideCancelButton = false,
  children,
  theme = 'success',
}: Props) {
  return (
    <div className='sticky bottom-0 bg-transparent'>
      <div className="flex bg-gray-50 px-4 py-3 space-x-4 justify-end">
        <Button onClick={() => onProceed()} theme={theme}>
          {submitButtonTitle}
        </Button>

        {!hideCancelButton && (
          <Button theme="default" onClick={onHideModal} buttonStyle="mr-5">
            Cancel
          </Button>
        )}

        {children && children}
      </div>
    </div>

  );
}
