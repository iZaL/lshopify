import React from 'react';
import {Image} from '../../../types';

interface Props {
  image: Image | null | undefined;
  imageStyle?: string;
  onClick: () => void;
}

export default function VariantImage({image, imageStyle, onClick}: Props) {
  const style = imageStyle ? imageStyle : 'w-16 h-16';

  console.log('i', image);
  return (
    <div
      className={`flex cursor-pointer items-center  justify-center overflow-hidden rounded border border-gray-200 ${style}`}
      onClick={onClick}>
      {image ? (
        <img
          src={image.url}
          className="pointer-events-none object-contain"
          alt=""
        />
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
