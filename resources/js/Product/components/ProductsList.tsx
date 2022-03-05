import React from 'react';
import {Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import VariantImage from '../Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import Table from '../../components/Table';
import DropdownButton from '../../components/DropdownButton';

interface Props {
  products: Product[];
}

export default function ProductsList({products}: Props) {
  const [selectedProductIDs, setSelectProductIDs] = React.useState<number[]>(
    [],
  );

  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
  };

  const onSelectedAllChange = () => {
    if (products.length === selectedProductIDs.length) {
      setSelectProductIDs([]);
    } else {
      setSelectProductIDs(products.map(v => v.id));
    }
  };

  return (
    <>
      {selectedProductIDs.length ? (
      <div className="flex w-full flex-row px-4 mb-2 h-10">
        <Button
          theme="clear"
          buttonStyle="px-6 rounded-l-md border border-gray-300 font-medium">
          <Checkbox
            name="selected"
            checked={selectedProductIDs.length === products.length}
            onChange={() => onSelectedAllChange()}
          />
          <span className="px-2">{selectedProductIDs.length} selected</span>
        </Button>

        <Button
          theme="clear"
          buttonStyle="-ml-px px-2 border border-gray-300 font-medium"
          onClick={() => {}}>
          Open bulk editor
        </Button>

        <DropdownButton
          buttonTitle="More actions"
          arrowVisible={true}
          buttonProps={{
            theme: 'clear',
            buttonStyle: '-ml-px px-2 border border-gray-300 rounded-r-md h-10',
          }}
          items={[
            {
              title: 'Edit Prices',
              onClick: () => {},
            },
          ]}
        />
      </div>
      ):null}
      <Table>
        {!selectedProductIDs.length && (
          <thead className=''>
            <Table.Row rowStyle="m-2">
              <Table.Head headerStyle="w-16 ">
                <Checkbox
                  checked={selectedProductIDs.length === products.length}
                  onChange={() => onSelectedAllChange()}
                  name=""
                  inputStyle="mx-4"
                />
              </Table.Head>
              <Table.Head title="Product" />
              <Table.Head title="Status" />
              <Table.Head title="Inventory" />
              <Table.Head title="Type" />
              <Table.Head title="Vendor" />
            </Table.Row>
          </thead>
        )}
        <tbody>
          {products.map((product, id) => (
            <Table.Row key={id} idx={id} onClick={() => {}}>
              <Table.Col>
                <div className="flex w-12 items-center justify-center">
                  <Checkbox checked={false} onChange={() => {}} name="" />
                </div>
              </Table.Col>

              <Table.Col>
                <Button theme="clear" onClick={() => onProductClick(product)}>
                  {product.image && (
                    <VariantImage
                      onClick={() => onProductClick(product)}
                      image={product.image}
                      imageStyle={'w-14 h-14 mr-2'}
                    />
                  )}
                  {product.title}
                </Button>
              </Table.Col>
              <Table.Col>{product.status}</Table.Col>
              <Table.Col>4 in stocks for 5 variants</Table.Col>
              <Table.Col>{product.product_type}</Table.Col>
              <Table.Col>zalsstores</Table.Col>
            </Table.Row>
          ))}
        </tbody>
      </Table>
    </>
  );
}
