import React, {useState} from 'react';
import Card from '../../../components/Card';
import {Image, Variant, VariantOption} from '../../../types';
import Subheader from '../../../components/Subheader';
import Label from '../../../components/forms/Label';
import InputText from '../../../components/forms/InputText';
import VariantImage from './VariantImage';
import DZFileUploadBox from '../../../components/forms/DZFileUploadBox';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';

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
      } => {
        return o.name === option.name
          ? {...option, id: e.target.value, edited: true}
          : o;
      },
    );
    onChange('options', currentOptions);
  };

  return (
    <Card>
      <Subheader text="Options" />
      <div className="flex flex-row space-x-4 justify-center">
        <ul className="flex-1 space-y-6">
          {options.map((o, i) => {
            return (
              <li key={i}>
                <Label title={o.name} />
                <InputText
                  name={o.name}
                  onChange={e => {
                    onVariantOptionsChange(o, e);
                  }}
                  value={o.id}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center justify-center w-40">
          <VariantImage
            image={variant?.image}
            style="h-32 w-32"
            onClick={() => setShowDialog(true)}
          />
          <Button
            theme="clear"
            style="text-blue-500 text-sm text-center underline"
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
            onImagesSelect={images => setSelectedImage(images[0])}
            onImagesUpload={images => onImagesUpload(images)}
          />
        </div>
      </Modal>
    </Card>
  );
}
