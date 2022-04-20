import {ArrowLeftIcon} from '@heroicons/react/solid';
import React from 'react';

import Button from './Button';

interface Props {
  onClick: () => void;
}

export default function BackButton({onClick}: Props) {
  return (
    <Button
      theme="default"
      onClick={onClick}
      buttonStyle="hover:border-gray-400 hover:text-gray-500">
      <ArrowLeftIcon className="h-4 w-4 " />
    </Button>
  );
}
