import React from 'react';
import {Image} from '../../../types';
import classNames from 'classnames';

interface Props {
  image: Image | null | undefined;
  imageStyle?: string;
  onClick: () => void;
  border?: boolean;
}

export default function VariantImage({image, imageStyle, onClick, border = true}: Props) {
  const style = imageStyle ? imageStyle : 'w-14 h-16';
  return (
    <div
      className={classNames('overflow-hidden',{
        'rounded rounded-md border border-gray-200 mr-2': border,
      })}
      onClick={onClick}>
      {image ? (
        <div className='self-center'>
          <img
            src={image.url}
            className={classNames('inline-block object-contain', style)}
            alt=""
          />
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${style} `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )}
    </div>
  );
}
