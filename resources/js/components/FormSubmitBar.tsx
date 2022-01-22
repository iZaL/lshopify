import React from 'react';
import {Inertia} from '@inertiajs/inertia';
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
    <div className="absolute left-0 top-0 z-30 w-full position-sticky ">
      <div className="flex justify-end px-20 items-center h-16 space-x-4 bg-gray-900 shadow-sm ">
        <button
          onClick={() => (onDiscard ? onDiscard() : discard())}
          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600 border border-gray-500 focus:border-none">
          Discard
        </button>

        <Button onClick={() => onSubmit()}>Save</Button>
      </div>
    </div>
  );
}
