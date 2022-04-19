import {XIcon} from '@heroicons/react/solid';
import React from 'react';

export default function TabPill({
  title,
  onClose,
  hideCloseIcon = false,
}: {
  title: string;
  onClose?: () => void;
  hideCloseIcon?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-end overflow-hidden rounded rounded-md bg-gray-200 ">
      <div className="flex-1 px-2 text-sm text-gray-700">{title}</div>
      {!hideCloseIcon && (
        <XIcon
          className="w-6 cursor-pointer hover:rounded hover:rounded-md hover:bg-gray-300"
          onClick={onClose}
        />
      )}
    </div>
  );
}
