import React, {useState} from 'react';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import DZFileUploadBox from '../../../components/forms/DZFileUploadBox';
import InputText from '../../../components/forms/InputText';
import Label from '../../../components/forms/Label';
import Modal from '../../../components/Modal';
import Subheader from '../../../components/Subheader';
import {Image, Variant, VariantOption} from '../../../types';

import VariantImage from './VariantImage';

interface Props {
  options: VariantOption[];
  variant: Variant | null;
  images: Image[];
  onImagesUpload: (images: Image[]) => void;
  onChange: <T extends keyof Variant>(key: T, value: Variant[T]) => void;
}

export default function VariantOptionsEdit({
  onChange,
  options,
  variant,
  images,
  onImagesUpload,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const onVariantOptionsChange = (
    option: VariantOption,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentOptions = options.map(
      (
        o,
      ): VariantOption & {
        edited?: boolean;
      } =>
        o.id === option.id
          ? {...option, name: e.target.value, edited: true}
          : o,
    );
    onChange('options', currentOptions);
  };

  return (
    <Card>
      <Subheader text="Options" />
      <div className="flex flex-row justify-center space-x-4">
        <ul className="flex-1 space-y-6">
          {options.map((o, i) => (
            <li key={i}>
              <Label title={o.id} />
              <InputText
                name={o.id}
                onChange={e => {
                  onVariantOptionsChange(o, e);
                }}
                value={o.name}
              />
            </li>
          ))}
        </ul>

        <div className="flex w-40 flex-col items-center justify-center">
          <VariantImage
            image={variant?.image}
            imageStyle="h-32 w-32"
            onClick={() => setShowDialog(true)}
          />
          <Button
            theme="clear"
            buttonStyle="text-blue-500 text-sm text-center underline"
            onClick={() => setShowDialog(true)}>
            Change image
          </Button>
        </div>
      </div>

      <Modal
        heading="Edit images"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          onChange('image', selectedImage);
        }}>
        <div className="p-5">
          <DZFileUploadBox
            images={images}
            selectedImages={selectedImage ? [selectedImage] : []}
            onImagesSelect={imgs => setSelectedImage(imgs[0])}
            onImagesUpload={imgs => onImagesUpload(imgs)}
          />
        </div>
      </Modal>
    </Card>
  );
}
