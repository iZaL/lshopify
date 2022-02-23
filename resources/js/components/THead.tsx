import React from 'react';
import {ArrowLeftIcon} from '@heroicons/react/solid';
import Button from './Button';

interface Props {
  title?:string;
  children?:React.ReactNode;
}

export default function THead({title,children = null}: Props) {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-sm tracking-wider"
    >
      {title ? title : children}
    </th>
  );
}
