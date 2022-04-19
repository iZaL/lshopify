import classNames from 'classnames';
import React from 'react';
import Card from '../../../components/Card';
import Subheader from '../../../components/Subheader';
import {Variant} from '../../../types';
import VariantImage from './VariantImage';

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
    <Card cardStyle="px-0">
      <Subheader text="Variants" headerStyle="px-4" />
      <ul className="">
        {variants.map((v, i) => (
          <li
            key={i}
            className={classNames(
              v.id === variant?.id ? 'bg-blue-100 text-blue-600' : '',
              'position-relative z-1 box-border inline-block flex min-w-full cursor-pointer flex-row items-center space-x-2 border border-l-0 border-r-0 border-gray-200 p-2 text-sm hover:bg-gray-100',
            )}
            onClick={() => onVariantItemClick(v)}>
            <VariantImage
              image={v.image}
              onClick={() => {}}
              imageStyle="h-8 w-8"
            />
            <div className="">{v.title}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
