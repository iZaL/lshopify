import {ButtonProps, Product, Variant} from '../../../types';
import React from 'react';
import Button from '../../../components/Button';

interface AttributeButton extends ButtonProps {
  title: string;
}

export default function AttributeButton(props: AttributeButton) {
  return (
    <Button
      {...props}
      theme="default"
      buttonStyle={`${props.buttonStyle} px-2 py-1 `}
      disabled={props.disabled}>
      {props.title}
    </Button>
  );
}
