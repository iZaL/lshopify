import React from 'react';
import {useDropzone} from 'react-dropzone';
import {Image} from '../../types';
import classNames from 'classnames';

interface Props {
  isMulti?: boolean;
  images: Image[];
  selectedImages: Image[];
  onImagesUpload: (e: Image[]) => void;
  onImagesSelect: (images: Image[]) => void;
}

const DZFileUploadBox = React.memo(
  ({
    images,
    selectedImages,
    onImagesUpload,
    onImagesSelect,
    isMulti = false,
  }: Props) => {
    const {getRootProps, getInputProps} = useDropzone({
      accept: 'image/*',
      onDrop: (acceptedFiles) => {
        const uploadedFiles: Image[] = acceptedFiles.map((file: File) => {
          return Object.assign(file, {
            id: Math.floor(Math.random() * 100000),
            url: URL.createObjectURL(file),
          });
        });
        onImagesUpload(uploadedFiles);
      },
    });

    const onSelect = (image: Image) => {
      if (isMulti) {
        const currentImages = selectedImages
          .map((img) => img.id)
          .includes(image.id)
          ? selectedImages.filter((img) => img.id !== image.id)
          : [...selectedImages, image];
        onImagesSelect(currentImages);
      } else {
        onImagesSelect([image]);
      }
    };

    const thumbs = images.map((image, i) => {
      let checked = selectedImages.map((img) => img.id).includes(image.id);
      const checkbox = isMulti ? (
        <input
          name='image'
          type='checkbox'
          className='h-4 w-4 absolute top-2 left-2 bg-transparent '
          checked={selectedImages.map((img) => img.id).includes(image.id)}
          onChange={() => onSelect(image)}
        />
      ) : (
        <div
          className={classNames(
            checked
              ? 'bg-green-600 border-transparent'
              : 'bg-white border-gray-300',
            'absolute top-2 left-2 h-4 w-4 rounded-full border flex items-center justify-center ring-2 ring-offset-2 ring-green-500'
          )}
        >
          <div className='rounded-full bg-white w-2 h-2' />
        </div>
      );

      return (
        <li key={i} className='relative' onClick={() => onSelect(image)}>
          <div
            className={classNames(
              checked
                ? 'ring-2 ring-offset-2 ring-green-500'
                : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500',
              'group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden'
            )}
          >
            <img
              src={image.url}
              className={classNames(
                checked ? '' : 'group-hover:opacity-75',
                'object-cover pointer-events-none'
              )}
            />
          </div>
          {checkbox}
        </li>
      );
    });

    return (
      <div className='mt-1 sm:mt-0'>
        <ul
          role='list'
          className=' mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4'
        >
          <li
            {...getRootProps({className: 'dropzone'})}
            className={classNames(
              images.length ? 'h-auto' : 'h-24',
              'flex items-center justify-center border-4 border-dashed border-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700'
            )}
          >
            <input {...getInputProps()} />
            <div className='relative'>
              <div className='flex flex-col items-center justify-center w-full '>
                <div className='text-sm text-blue-500 underline '>
                  Add media
                </div>
                <div className='text-xs text-center'>
                  Order drop files to upload
                </div>
              </div>
            </div>
          </li>
          {thumbs}
        </ul>
      </div>
    );
  }
);

export default DZFileUploadBox;
