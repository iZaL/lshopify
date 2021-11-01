import React from 'react';
import {XIcon} from '@heroicons/react/solid';
import {CheckCircleIcon} from '@heroicons/react/solid';

interface Props {
  message?: string;
  type?: string;
}

export default function NotificationBox({message, type}: Props) {
  if (!message) {
    return null;
  }

  let bgColor = 'bg-transparent';

  if (type === 'success') {
    bgColor = 'bg-green-50';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-50';
  }

  return (
    <div className={`rounded-md ${bgColor} py-6 px-6 m-6`}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <CheckCircleIcon
            className='h-5 w-5 text-green-400'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <p className='text-sm font-medium text-green-800'>{message}</p>
        </div>
        <div className='ml-auto pl-3'>
          <div className='-mx-1.5 -my-1.5'>
            <button
              onSubmit={() => alert('wa')}
              type='button'
              className='inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600'
            >
              <span className='sr-only'>{type}</span>
              <XIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
