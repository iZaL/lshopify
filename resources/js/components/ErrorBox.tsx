import React from 'react';
import {XCircleIcon} from '@heroicons/react/solid';

interface Props {
  errors: object;
}

export default function ErrorBox({errors}: Props) {
  // @ts-ignore
  if (Object.entries(errors).length === 0) {
    return null;
  }

  const totalErrors = Object.entries(errors).length;
  const errorMessages = Object.keys(errors).map(key => {
    // @ts-ignore
    return errors[key];
  });

  return (
    <div className="rounded-md bg-red-50 py-6 px-6 m-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There were {totalErrors} error{totalErrors !== 1 && `s`} with your
            submission
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errorMessages.map((message, index) => {
                return <li key={index}>{message}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
