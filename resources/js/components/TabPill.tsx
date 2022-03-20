import React from 'react';
import {XIcon} from '@heroicons/react/solid';

export default function TabPill({
  title,
  onClick,
  hideCloseIcon = false,
}: {
  title: string;
  onClick: () => void;
  hideCloseIcon?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-end overflow-hidden rounded rounded-md bg-gray-200 ">
      <div className="flex-1 px-2 text-sm text-gray-700">{title}</div>
      {!hideCloseIcon && (
        <XIcon
          className="w-6 cursor-pointer hover:rounded hover:rounded-md hover:bg-gray-300"
          onClick={onClick}
        />
      )}
    </div>
  );
}
