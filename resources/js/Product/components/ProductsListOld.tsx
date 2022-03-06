import React from 'react';
import {ButtonTheme, Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import VariantImage from '../Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import Table from '../../components/Table';
import DropdownButton from '../../components/DropdownButton';
import Modal from '../../components/Modal';

interface Props {
  products: Product[];
}

interface ModalProp {
  title: string;
  body: string;
  theme: ButtonTheme;
  submitButtonTitle?: string;
  onSubmit: () => void;
  cancelButtonTitle: string;
  onClose: () => void;
}

export default function ProductsListOld({products}: Props) {
  const [selectedProductIDs, setSelectProductIDs] = React.useState<number[]>(
    [],
  );

  const [showDialog, setShowDialog] = React.useState(false);
  const [modalParams, setModalParams] = React.useState<ModalProp>({
    cancelButtonTitle: 'Cancel',
    submitButtonTitle: 'Save',
    theme: 'error',
    title: 'Are you sure ?',
    body: 'Are you sure ?',
    onClose: () => setShowDialog(false),
    onSubmit: () => setShowDialog(false),
  });

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
  const onCheckboxChange = (productID: Product['id']) => {
    const checkedBox = selectedProductIDs.includes(productID)
      ? selectedProductIDs.filter(vID => vID !== productID)
      : [...selectedProductIDs, productID];
    setSelectProductIDs(checkedBox);
  };

  const showDialogBox = (param: ModalProp) => {
    setShowDialog(true);
    setModalParams({
      ...modalParams,
      ...param,
    });
  };

  return (
    <>
      {selectedProductIDs.length ? (
        <div className="mb-2 flex h-10 w-full flex-row px-4">
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
            Edit products
          </Button>

          <DropdownButton
            buttonTitle="More actions"
            arrowVisible={true}
            buttonProps={{
              theme: 'clear',
              buttonStyle:
                '-ml-px px-2 border border-gray-300 rounded-r-md h-10',
            }}
            items={[
              {
                title: 'Set as active',
                onClick: () =>
                  showDialogBox({
                    ...modalParams,
                    title: `Set ${selectedProductIDs.length} products as active?`,
                    body: 'Setting products as active will make them available to their selected sales channels and apps.',
                    onSubmit: () => {
                      setShowDialog(false);
                      Inertia.post(route('lshopify.products.attributes'), {
                        product_ids: selectedProductIDs,
                        status: 'active',
                      });
                    },
                  }),
              },
              {
                title: 'Set as draft',
                onClick: () =>
                  showDialogBox({
                    ...modalParams,
                    title: `Set ${selectedProductIDs.length} products as draft?`,
                    body: 'Setting products as draft will hide them from all sales channels and apps.',
                    onSubmit: () => {
                      setShowDialog(false);
                      Inertia.post(route('lshopify.products.attributes'), {
                        product_ids: selectedProductIDs,
                        status: 'draft',
                      });
                    },
                  }),
              },
              {
                title: 'Archive products',
                onClick: () => {},
              },
              {
                title: 'Delete products',
                onClick: () => {},
              },
              {
                title: 'Add tags',
                onClick: () => {},
              },
              {
                title: 'Add to collection',
                onClick: () => {},
              },
              {
                title: 'Remove from collection',
                onClick: () => {},
              },
            ]}
          />
        </div>
      ) : null}
      <Table>
        {!selectedProductIDs.length && (
          <thead className="">
            <Table.Row rowStyle="m-2">
              <Table.Head headerStyle="w-16">
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
                  <Checkbox
                    checked={selectedProductIDs.includes(product.id)}
                    onChange={() => onCheckboxChange(product.id)}
                    name=""
                  />
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

      <Modal
        visible={showDialog}
        heading={modalParams.title}
        theme={modalParams.theme}
        submitButtonTitle={modalParams.submitButtonTitle}
        onClose={() => modalParams.onClose()}
        onConfirm={() => modalParams.onSubmit()}>
        <p className="p-5 text-sm">{modalParams.body}</p>
      </Modal>
    </>
  );
}
