import React, {useState} from 'react';
import {Variant, VariantOption} from '../../../types';
import InputText from '../../../components/forms/InputText';
import {XIcon} from '@heroicons/react/solid';
import Modal from '../../../components/Modal';
import TagClose from '../../../components/TagClose';

interface Props {
  variants: Variant[];
  variantOptions: VariantOption[];
  variantValues: VariantOption[];
  onDelete: (variants: number[]) => void;
}

export default function EditVariantOptions({
  variants,
  variantOptions,
  variantValues,
  onDelete,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [deletingVariants, setDeletingVariants] = useState<number[]>([]);
  const [deletingOption, setDeletingOption] = useState<VariantOption | null>(null);

  const currentVariantOptions: VariantOption[] = variantOptions.map(v => {
    return {
      id: v.id,
      name: v.name,
      options: variantValues.filter(value => value.name === v.name),
    };
  });

  const onVariantOptionsRemoveConfirm = () => {
    onDelete(deletingVariants);
  };

  const onVariantOptionsUpdate = () => {};

  const onVariantOptionsRemove = (option: VariantOption) => {
    let currentVariants: number[] = [];
    variants.map(variant => {
      return (currentVariants = variant.options?.some(({id}) => id === option.id)
        ? [...currentVariants, variant.id]
        : [...currentVariants]);
    });
    setDeletingOption(option);
    setDeletingVariants(currentVariants);
    setShowDialog(true);
  };

  return (
    <div className="space-y-2 p-5">
      {currentVariantOptions.map((option, i) => {
        return (
          <div className="flex flex-row items-center text-sm" key={i}>
            <div className="w-40">
              <InputText
                name={`name${option.id}`}
                value={option.name}
                onChange={() => onVariantOptionsUpdate()}
              />
            </div>
            <div className="m-auto flex-1 px-4 text-sm text-gray-700">
              <div className="flex flex-row items-center space-x-2" key={i}>
                {option.options?.map((o, idx) => {
                  return (
                    <TagClose key={idx} title={o.id} onClick={() => onVariantOptionsRemove(o)} />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <Modal
        heading="Removing options will also delete variants"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          deletingVariants.length && onVariantOptionsRemoveConfirm();
        }}
        theme={deletingVariants.length ? 'error' : 'success'}
        submitButtonTitle={deletingVariants.length ? 'Delete Variants' : 'Close'}>
        {deletingVariants.length ? (
          <div className="p-5 text-sm">
            <p className="">
              Saving this product will delete {deletingVariants.length} variants with the following
              options:
            </p>
            <li className="p-4">
              {deletingOption?.name} : {deletingOption?.id}
            </li>
          </div>
        ) : (
          <div className="p-5 text-sm">No variants matched. </div>
        )}
      </Modal>
    </div>
  );
}
