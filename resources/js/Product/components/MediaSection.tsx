import React, {useState} from 'react';
import Card from '../../components/Card';
import Subheader from '../../components/Subheader';
import DZFileUploadBox from '../../components/forms/DZFileUploadBox';
import {Image} from '../../types';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

interface Props {
  onImagesUpload: (images: Image[]) => void;
  onImagesDelete: (images: Image[]) => void;
  images: Image[];
}

const MediaSection = ({onImagesUpload, images, onImagesDelete}: Props) => {
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onImageClick = () => {
    if (images.length === selectedImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images);
    }
  };

  return (
    <Card>
      <div className="flex h-8 flex-row items-center justify-between text-sm">
        {selectedImages.length ? (
          <>
            <div className="flex flex-row  items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedImages.length === images.length}
                onChange={() => onImageClick()}
              />
              <Button theme="clear" onClick={() => onImageClick()}>
                {selectedImages.length} media selected
              </Button>
            </div>
            <Button theme="clear" onClick={() => setShowDeleteDialog(true)}>
              <div className="text-red-500">Delete media</div>
            </Button>
          </>
        ) : (
          <Subheader text="Media" headerStyle="text-lg" />
        )}
      </div>

      <DZFileUploadBox
        isMulti={true}
        images={images}
        selectedImages={selectedImages}
        onImagesSelect={imgs => setSelectedImages(imgs)}
        onImagesUpload={imgs => onImagesUpload(imgs)}
      />

      <Modal
        heading={`Delete ${selectedImages.length} of ${images.length} media ? `}
        subHeading="This cant be undone"
        visible={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          setShowDeleteDialog(false);
          setSelectedImages([]);
          onImagesDelete(selectedImages);
        }}
        theme="red"
        submitButtonTitle="Delete">
        <p className="p-5 text-sm">do you wish to continue?</p>
      </Modal>
    </Card>
  );
};

export default MediaSection;
