import React from 'react';
import Button from '../../components/Button';

interface Props {
  onRefundClick: () => void;
  onReturnClick: () => void;
}

export default function OrderViewActionButtons({onRefundClick, onReturnClick}: Props) {
  return (
    <div className="mt-5 flex xl:mt-0 xl:ml-4">
      <div className="">
        <Button theme="clear" onClick={onRefundClick} buttonStyle={'hover:bg-gray-200 p-2 px-4'}>
          Refund
        </Button>
        <Button theme="clear" onClick={onReturnClick} buttonStyle={'hover:bg-gray-200 p-2 px-4'}>
          Return items
        </Button>
      </div>
    </div>
  );
}
