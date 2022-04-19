import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';
import PageHeader from '../../components/PageHeader';
import Main from '../../Main';
import {Variant} from '../../types';
import InventoryIndexActionButtons from './components/InventoryIndexActionButtons';
import InventorySearchBar from './components/InventorySearchBar';
import InventoryList from './InventoryList';

interface Props {
  variants: Variant[];
}

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}
const tabs: TabProps[] = [{name: 'All', href: '#', current: true}];

type ExtendedVariant = Variant & {
  isDirty: boolean;
};

type Form = {
  variants: ExtendedVariant[];
};

export default function InventoryIndex(props: Props) {
  const {variants} = props;

  const formProps: Form = {
    variants: variants.map(variant => ({...variant, isDirty: false})),
  };

  const {data, setData} = useForm<Form>(formProps);

  const onQuantityChange = (variant: Variant, quantity: string) => {
    const index = data.variants.findIndex(v => v.id === variant.id);
    const newVariant = {...variant, quantity: quantity, isDirty: true};
    setData({
      variants: [
        ...data.variants.slice(0, index),
        newVariant,
        ...data.variants.slice(index + 1),
      ],
    });
  };

  const onVariantSave = (variant: Variant) => {
    const url = route('lshopify.variants.update', [variant.id]);
    Inertia.patch(
      url,
      {
        ...variant,
        quantity: variant.quantity,
      },
      {
        onSuccess: () => {
          const index = data.variants.findIndex(v => v.id === variant.id);
          const newVariant = {...variant, isDirty: false};
          setData({
            variants: [
              ...data.variants.slice(0, index),
              newVariant,
              ...data.variants.slice(index + 1),
            ],
          });
        },
      },
    );
  };

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Inventory'} />
          <InventoryIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="overflow-hidden rounded-lg bg-white shadow">
            <InventorySearchBar tabs={tabs} onMoreFiltersClick={() => {}} />
            <InventoryList
              variants={data.variants || []}
              onQuantityChange={onQuantityChange}
              onSave={onVariantSave}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
