import React from 'react';
import Button from '../../components/Button';

interface Props {
  onRefundClick: () => void;
}

export default function OrderViewActionButtons({onRefundClick}: Props) {
  return (
    <div className="mt-5 flex xl:mt-0 xl:ml-4">
      <div className="">
        <Button theme="success" onClick={onRefundClick}>
          Refund
        </Button>
      </div>
    </div>
  );
}
