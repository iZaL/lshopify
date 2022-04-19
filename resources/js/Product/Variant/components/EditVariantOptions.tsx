import React, {useState} from 'react';
import InputText from '../../../components/forms/InputText';
import Modal from '../../../components/Modal';
import TabPill from '../../../components/TabPill';
import {Variant, VariantOption, VariantValue} from '../../../types';

interface Props {
  variants: Variant[];
  variantOptions: VariantOption[];
  onDelete: (variants: number[]) => void;
}

export default function EditVariantOptions({
  variants,
  variantOptions,
  onDelete,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [deletingVariants, setDeletingVariants] = useState<number[]>([]);
  const [deletingOption, setDeletingOption] = useState<VariantOption | null>(
    null,
  );

  const currentVariantOptions: VariantOption[] = variantOptions.map(v => {
    return {
      name: v.name,
      id: v.id,
      values: v.values,
    };
  });

  const onVariantOptionsRemoveConfirm = () => {
    onDelete(deletingVariants);
  };

  const onVariantOptionsUpdate = () => {};

  const onVariantOptionValueRemove = (
    option: VariantOption,
    value: VariantValue,
  ) => {
    let currentVariants: number[] = [];
    variants.map(variant => {
      return (currentVariants = variant.options?.some(
        ({id, name}) => id === option.id && name === value.name,
      )
        ? [...currentVariants, variant.id]
        : [...currentVariants]);
    });
    setDeletingOption(value);
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
                name={`name${option.name}`}
                value={option.id}
                onChange={() => onVariantOptionsUpdate()}
              />
            </div>
            <div className="m-auto flex-1 px-4 text-sm text-gray-700">
              <div className="flex flex-row items-center space-x-2" key={i}>
                {option.values?.map((value, idx) => {
                  return (
                    <TabPill
                      key={idx}
                      title={value.name}
                      onClose={() => onVariantOptionValueRemove(option, value)}
                    />
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
        submitButtonTitle={
          deletingVariants.length ? 'Delete Variants' : 'Close'
        }>
        {deletingVariants.length ? (
          <div className="p-5 text-sm">
            <p className="">
              Saving this product will delete {deletingVariants.length} variants
              with the following options:
            </p>
            <li className="p-4">
              {deletingOption?.id} : {deletingOption?.name}
            </li>
          </div>
        ) : (
          <div className="p-5 text-sm">No variants matched. </div>
        )}
      </Modal>
    </div>
  );
}
