import React, {useState} from 'react';
import {Collection, Image} from '../types';
import Card from './Card';
import Subheader from './Subheader';
import Button from './Button';
import classNames from 'classnames';
import Modal from './Modal';
import DZFileUploadBox from './forms/DZFileUploadBox';

interface Props {
  data: Collection & {searchTerm: string; sortTerm: string};
  onImageRemove: () => void;
  onConfirm: (img: Image) => void;
}

export default function ImageSelect(props: Props) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [images, setImages] = useState<Image[]>(props.data.image ? [props.data.image] : []);
  const [selectedImage, setSelectedImage] = useState<Image | null>(
    props.data.image ? props.data.image : null,
  );

  const onConfirm = () => {
    setShowDialog(false);
    if (selectedImage) {
      props.onConfirm(selectedImage);
    }
  };

  return (
    <Card cardStyle="w-full h-full">
      <div className="flex flex-row justify-between">
        <Subheader text={'Collection image'} />
        {props.data.image && (
          <Button
            theme="clear"
            buttonStyle="text-sm text-blue-500 underline"
            onClick={props.onImageRemove}>
            Clear
          </Button>
        )}
      </div>

      {props.data.image ? (
        <div className="w-full rounded-lg border-4 border border-gray-200 p-2">
          <img
            src={props.data.image.url}
            className={classNames(
              'group-hover:opacity-75',
              'pointer-events-none h-36 w-full object-contain',
            )}
            alt=""
          />
        </div>
      ) : (
        <div className="relative cursor-pointer" onClick={() => setShowDialog(true)}>
          <div className="flex h-36 w-full flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200">
            <div className="text-sm text-blue-500 underline ">Add media</div>
            <div className="text-center text-xs">Drop files to upload</div>
          </div>
        </div>
      )}

      <Modal
        heading="Select Image"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onConfirm}>
        <div className="p-5">
          <DZFileUploadBox
            onImagesSelect={imgs => setSelectedImage(imgs[0])}
            onImagesUpload={imgs => setImages([...images, ...imgs])}
            images={images}
            selectedImages={selectedImage ? [selectedImage] : []}
          />
        </div>
      </Modal>
    </Card>
  );
}
