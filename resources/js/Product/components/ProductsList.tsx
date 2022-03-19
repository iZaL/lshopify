import React from 'react';
import {ButtonTheme, Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import Button from '../../components/Button';
import Table from '../../components/Table';
import DropdownButton from '../../components/DropdownButton';
import SmartTable from '../../components/SmartTable';
import VariantImage from '../Variant/components/VariantImage';
import Modal from '../../components/Modal';
import route from 'ziggy-js';

interface Props {
  products: Product[];
  onUpdate: <T extends keyof Product>(
    productIDs: number[],
    field: T,
    value: Product[T],
  ) => void;
  onDelete: (productIDs: number[]) => void;
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

export default function ProductsList({products, onUpdate, onDelete}: Props) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [modalParams, setModalParams] = React.useState<ModalProp>({
    cancelButtonTitle: 'Cancel',
    submitButtonTitle: 'Save',
    theme: 'success',
    title: 'Are you sure ?',
    body: 'Are you sure ?',
    onClose: () => setShowDialog(false),
    onSubmit: () => setShowDialog(false),
  });

  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
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
      <SmartTable items={products}>
        <SmartTable.SmartHeader>
          {({selectedItemIDs}) => {
            return (
              <>
                <Button
                  theme="clear"
                  buttonStyle="-ml-px px-2 border border-gray-300 font-medium"
                  onClick={() =>
                    Inertia.get(route('lshopify.products.bulk_editor.index'), {
                      product_ids: selectedItemIDs,
                    })
                  }>
                  Edit products
                </Button>

                <DropdownButton
                  buttonTitle="More actions"
                  arrowVisible={true}
                  buttonProps={{
                    theme: 'clear',
                    buttonStyle:
                      '-ml-px px-2 border border-gray-300 rounded-r-md h-10 font-medium',
                  }}
                  items={[
                    {
                      title: 'Set as active',
                      onClick: () =>
                        showDialogBox({
                          ...modalParams,
                          title: `Set ${selectedItemIDs.length} products as active?`,
                          body: 'Setting products as active will make them available to their selected sales channels and apps.',
                          submitButtonTitle: 'Set as active',
                          onSubmit: () => {
                            setShowDialog(false);
                            onUpdate(selectedItemIDs, 'status', 'active');
                          },
                        }),
                    },
                    {
                      title: 'Set as draft',
                      onClick: () =>
                        showDialogBox({
                          ...modalParams,
                          title: `Set ${selectedItemIDs.length} products as draft?`,
                          body: 'Setting products as draft will hide them from all sales channels and apps.',
                          submitButtonTitle: 'Set as draft',
                          onSubmit: () => {
                            setShowDialog(false);
                            onUpdate(selectedItemIDs, 'status', 'draft');
                          },
                        }),
                    },
                    {
                      title: 'Archive products',
                      onClick: () =>
                        showDialogBox({
                          ...modalParams,
                          title: `Archive ${selectedItemIDs.length} products?`,
                          body: 'Archiving products will hide them from your sales channels and Shopify admin. You’ll find them using the status filter in your product list.',
                          submitButtonTitle: 'Archive products',
                          onSubmit: () => {
                            setShowDialog(false);
                            onUpdate(selectedItemIDs, 'status', 'archived');
                          },
                        }),
                    },
                    {
                      title: 'Delete products',
                      onClick: () =>
                        showDialogBox({
                          ...modalParams,
                          title: `Delete ${selectedItemIDs.length} products?`,
                          body: 'This can’t be undone.',
                          submitButtonTitle: 'Delete products',
                          theme: 'error',
                          onSubmit: () => {
                            setShowDialog(false);
                            onDelete(selectedItemIDs);
                          },
                        }),
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
              </>
            );
          }}
        </SmartTable.SmartHeader>

        <Table>
          <SmartTable.Header>
            <Table.Header title="Product" />
            <Table.Header title="Status" />
            <Table.Header title="Inventory" />
            <Table.Header title="Type" />
            <Table.Header title="Vendor" />
          </SmartTable.Header>
          <SmartTable.Body onItemClick={onProductClick}>
            {({item}) => {
              return (
                <>
                  <Table.Cell>
                    <Button theme="clear" onClick={() => onProductClick(item)}>
                      {item.image && (
                        <VariantImage
                          onClick={() => onProductClick(item)}
                          image={item.image}
                          imageStyle={'w-14 h-14'}
                        />
                      )}
                      {item.title}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{item.status}</Table.Cell>
                  <Table.Cell>{item.available_quantity} in stocks for {item.variants_count} variants</Table.Cell>
                  <Table.Cell>{item.category?.name}</Table.Cell>
                  <Table.Cell>{item.vendor?.name}</Table.Cell>
                </>
              );
            }}
          </SmartTable.Body>
        </Table>
      </SmartTable>

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
