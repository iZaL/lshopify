import React from 'react';
import {Image} from '../../../types';

interface Props {
  image: Image | null | undefined;
  style?: string;
  onClick: () => void;
}

export default function VariantImage({image, style, onClick}: Props) {
  let imageStyle = style ? style : 'w-16 h-16';

  return (
    <div
      className={`flex justify-center items-center  border border-gray-200 rounded cursor-pointer ${imageStyle}`}
      onClick={onClick}
    >
      {image ? (
        <img src={image.url} className='object-contain pointer-events-none' />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`${imageStyle} `}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      )}
    </div>
  );
}
