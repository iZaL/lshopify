import React from 'react';
import {ArrowLeftIcon} from '@heroicons/react/solid';
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
      <ArrowLeftIcon className="w-4 h-4 " />
    </Button>
  );
}
