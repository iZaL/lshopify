import { format, formatDistance, formatRelative, subDays, addMinutes, addYears } from 'date-fns'
import React, {useState} from 'react';

import Border from '../../../components/Border';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import InputText from '../../../components/forms/InputText';
import Label from '../../../components/forms/Label';
import Modal from '../../../components/Modal';
import ModalFooter from '../../../components/ModalFooter';
import Subheader from '../../../components/Subheader';
import ProductSearch from '../../../Product/components/ProductSearch';
import { Cart, Discount, CartItem, Product } from '../../../types';

import CartItems from './CartItems';
import DiscountAdd from './DiscountAdd';

interface Props {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  products: Product[];
  cart: Cart;
  onVariantsAdd: (variants: number[]) => void;
  onVariantRemove: (rowId: string) => void;
  onVariantEdit: (rowId: string, item: CartItem) => void;
  onApplyDiscount: (discount: Discount, item?: CartItem) => void;
  onRemoveDiscount: (discount: Discount, item?: CartItem) => void;
  onCreateOrder: () => void;
}

export default function DraftOrderDetailsSection({
  searchTerm,
  setSearchTerm,
  products,
  onVariantsAdd,
  onVariantRemove,
  onVariantEdit,
  onApplyDiscount,
  onRemoveDiscount,
  onCreateOrder,
  cart,
}: Props) {
  const [showDialog, setShowDialog] = useState<
    'discount' | 'payment_paid' | 'payment_pending' | 'send_invoice' | null
    >(null);

  const [selectedDiscount, setSelectedDiscount] = useState<Discount>({
    id: 0,
    code: '',
    customer_selection: 'all',
    customers: [],
    min_requirement_type: null,
    min_requirement_value: '0',
    name: '',
    once_per_customer: false,
    reason: '',
    value: '1',
    value_type: 'percentage',
    title:'ADMIN CODE',
    collections: [],
    starts_at: addMinutes(new Date(), 5),
    ends_at: addYears(new Date(), 1), //use before 1 year
    target_type: 'products',
    variants: [],
    type: 'automatic',
    usage_limit: '1'
  });

  console.log('s',selectedDiscount);

  const [selectedDiscountItem, setSelectedDiscountItem] =
    useState<CartItem | null>(null);

  const items: CartItem[] = Object.keys(cart.items).map(k => cart.items[k]);

  const onRemoveDiscountConfirm = (discount: Discount) => {
    // const onRemoveDiscountConfirm = (discount: Discount) => {
    onRemoveDiscount(discount);
  };

  const onDiscountConfirm = (discount: Discount) => {
    // const onDiscountConfirm = (discount: Discount) => {
    if (selectedDiscountItem) {
      onApplyDiscount(
        {
          ...discount,
          name: `${selectedDiscountItem.id}`,
          // type: 'discount',
          // target: 'subtotal',
        },
        // selectedDiscountItem,
      );
    } else {
      onApplyDiscount({
        ...discount,
        name: 'cart',
        // type: 'discount',
        // target: 'subtotal',
      });
    }
    setShowDialog(null);
  };

  const onShowDiscountDialog = (item: CartItem,discount?: Discount) => {
    if(discount) {
      setSelectedDiscount(discount);
    } else {
      setSelectedDiscount({
        ...selectedDiscount,

        // products: item.variant?.product?[ item.variant.product] :[],
      });
    }
    setSelectedDiscountItem(item);
    setShowDialog('discount');
  };

  return (
    <Card>
      <Subheader text="Order Details" />

      <ProductSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        products={products}
        onVariantsAdd={onVariantsAdd}
        items={items}
      />

      <CartItems
        items={items}
        onVariantEdit={onVariantEdit}
        onVariantRemove={onVariantRemove}
        onShowDiscountDialog={onShowDiscountDialog}
      />

      <>
        <Border />

        <div className="mt-5 text-sm">
          <div className="flex flex-row space-x-5">
            <div className="flex-1">
              <Label title="Notes" />
              <InputText name="notes" onChange={() => {}} value="" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-row justify-between">
                <div className="">Subtotal</div>
                <div className="">OMR {cart.subtotal}</div>
              </div>

              {cart.total !== cart.subtotal ? (
                <>
                  <div className="flex flex-row justify-between">
                    <Button
                      theme="clear"
                      buttonStyle="text-blue-500 hover:underline"
                      onClick={() => {}}
                      // onClick={() => onShowDiscountDialog(cart.discount)}
                    >
                      Edit discount
                    </Button>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="text-gray-500">Custom discount</div>
                    <div className="">-OMR {cart.discount_value}</div>
                  </div>
                </>
              ) : (
                <div className="flex flex-row justify-between">
                  <Button
                    theme="clear"
                    // onClick={() => onShowDiscountDialog(cart.discount)}
                    onClick={() => {}}
                    buttonStyle="text-blue-500 hover:underline"
                  >
                    Add discount
                  </Button>
                  <div className="">——</div>
                </div>
              )}

              <div className="flex flex-row justify-between">
                <div className="">Add shipping</div>
                <div className="">——</div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="">Tax</div>
                <div className="">——</div>
              </div>
              <div className="flex flex-row justify-between font-bold">
                <div className="">Total</div>
                <div className="">OMR {cart.total}</div>
              </div>
            </div>
          </div>
        </div>

        {items.length ? (
          <>
            <Border />

            <div className="flex flex-row items-center justify-between">
              <div className="text-xs font-semibold">INVOICE</div>
              <Button onClick={() => setShowDialog('send_invoice')}>
                Send Invoice
              </Button>
            </div>

            <Border />

            <div className="flex flex-row items-center justify-between">
              <div className="text-xs font-semibold">PAYMENT</div>
              <div className="flex flex-row space-x-5">
                <Button
                  theme="default"
                  onClick={() => setShowDialog('payment_paid')}>
                  Mark as paid
                </Button>
                <Button
                  theme="default"
                  onClick={() => setShowDialog('payment_pending')}>
                  Mark as pending
                </Button>
                <Button>Pay by credit card</Button>
              </div>
            </div>
          </>
        ) : null}
      </>

      <Modal
        heading="Add discount"
        visible={showDialog === 'discount'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => {}}
        width="max-w-xl"
        hideFooter>
        {
          <DiscountAdd discount={selectedDiscount}>
            {discountAttributes => (
              <ModalFooter
                onHideModal={() => setShowDialog(null)}
                onProceed={() => {
                  setShowDialog(null);
                  onDiscountConfirm(discountAttributes);
                }}
                submitButtonTitle={selectedDiscount?.name ? 'Update' : 'Done'}
                hideCancelButton>
                {selectedDiscount?.name && (
                  <Button
                    theme="error"
                    onClick={() => {
                      setShowDialog(null);
                      onRemoveDiscountConfirm(selectedDiscount);
                    }}
                    buttonStyle="mr-5">
                    Remove discount
                  </Button>
                )}
              </ModalFooter>
            )}
          </DiscountAdd>
        }
      </Modal>

      <Modal
        visible={showDialog === 'payment_paid'}
        heading="Mark as paid"
        submitButtonTitle="Create order"
        onClose={() => {
          setShowDialog(null);
        }}
        onConfirm={() => {
          setShowDialog(null);
          onCreateOrder();
        }}>
        <p className="p-5 text-sm">
          This will create an order. Mark this order as paid if you received OMR{' '}
          {cart.total} outside of Shopify.
        </p>
      </Modal>

      <Modal
        visible={showDialog === 'payment_pending'}
        heading="Mark as pending payment"
        submitButtonTitle="Create order"
        onClose={() => {
          setShowDialog(null);
        }}
        onConfirm={() => {
          setShowDialog(null);
          onCreateOrder();
        }}>
        <p className="p-5 text-sm">
          This will create an order without payment. You will be able to collect
          payment of OMR {cart.total} later.
        </p>
      </Modal>
    </Card>
  );
}
