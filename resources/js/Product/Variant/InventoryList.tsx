import React from 'react';
import {Variant} from '../../types';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';
import InputText from '../../components/forms/InputText';

type ExtendedVariant = Variant & {
  isDirty: boolean;
};
interface Props {
  variants: ExtendedVariant[];
  onQuantityChange: (variant: ExtendedVariant, quantity: string) => void;
  onSave: (variant: ExtendedVariant) => void;
}

export default function InventoryList({
  variants,
  onQuantityChange,
  onSave,
}: Props) {
  const onCollectionClick = (variant: Variant) => {
    // return Inertia.get(route('lshopify.variants.edit', [collection.id]));
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider"
                  />
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider"
                  />
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    SKU
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Available
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, id) => (
                  <tr
                    key={variant.id}
                    className={`${id % 2 === 0 ? 'bg-white' : 'bg-gray-50'} `}>
                    <td>
                      <div className="flex w-12 items-center justify-center">
                        <Checkbox checked={false} onChange={() => {}} name="" />
                      </div>
                    </td>
                    <td className="overflow-hidden py-2">
                      {variant.image && (
                        <VariantImage
                          onClick={() => onCollectionClick(variant)}
                          image={variant.image}
                          imageStyle="w-16 h-12"
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {variant.product?.title && (
                        <span className="font-bold">
                          {variant.product.title}
                          <br />
                        </span>
                      )}
                      {variant.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {variant.sku}
                    </td>
                    <td className="w-20 whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 ">
                      <InputText
                        value={variant.quantity}
                        name="quantity"
                        onChange={event =>
                          onQuantityChange(variant, event.target.value)
                        }
                        inputStyle="text-center m-0 p-0"
                      />
                    </td>
                    <td className="w-20">
                      {variant.isDirty ? (
                        <Button onClick={() => onSave(variant)} theme="success">
                          Save
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
