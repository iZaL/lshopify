import React from 'react';
import {ArrowLeftIcon} from '@heroicons/react/solid';
import Button from './Button';

interface Props {
  children:React.ReactNode;
}

export default function TD({children}: Props) {
  return (
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{children}</td>
  );
}
