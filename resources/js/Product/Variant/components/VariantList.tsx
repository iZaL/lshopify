import React from 'react';
import Card from '../../../components/Card';
import {Variant} from '../../../types';
import Subheader from '../../../components/Subheader';
import VariantImage from './VariantImage';
import classNames from 'classnames';

interface Props {
  variants: Variant[];
  variant: Variant | undefined;
  onVariantItemClick: (variant: Variant) => void;
}

export default function VariantList({
  variants,
  variant,
  onVariantItemClick,
}: Props) {
  return (
    <Card style='px-0'>
      <Subheader text='Variants' style='px-4' />
      <ul className=''>
        {variants.map((v, i) => {
          return (
            <li
              key={i}
              className={classNames(
                v.id === variant?.id ? 'bg-blue-100 text-blue-600' : '',
                'flex flex-row items-center text-sm box-border position-relative z-1 inline-block min-w-full hover:bg-gray-100 border border-gray-200 border-l-0 border-r-0 cursor-pointer p-2 space-x-2'
              )}
              onClick={() => onVariantItemClick(v)}
            >
              <VariantImage
                image={v.image}
                onClick={() => {}}
                style='h-8 w-8'
              />
              <div className=''>{v.title}</div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
