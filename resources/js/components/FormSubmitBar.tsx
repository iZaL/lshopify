import {Inertia} from '@inertiajs/inertia';
import React from 'react';

import Button from './Button';

interface Props {
  onDiscard?: () => void;
  onSubmit: () => void;
  show?: boolean;
}

export default function FormSubmitBar({
  onDiscard,
  onSubmit,
  show = true,
}: Props) {
  const discard = () => {
    Inertia.reload({
      onSuccess: () => Inertia.reload(),
    });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="position-sticky absolute left-0 top-0 z-30 w-full ">
      <div className="flex h-16 items-center justify-end space-x-4 bg-gray-900 px-20 shadow-sm ">
        <button
          onClick={() => (onDiscard ? onDiscard() : discard())}
          className="rounded-md border border-gray-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:border-none">
          Discard
        </button>

        <Button onClick={() => onSubmit()}>Save</Button>
      </div>
    </div>
  );
}
