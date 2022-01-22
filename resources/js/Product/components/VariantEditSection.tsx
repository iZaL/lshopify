import React, {useState} from 'react';
import Card from '../../components/Card';
import Subheader from '../../components/Subheader';
import {Image, Variant, VariantOption} from '../../types';
import Modal from '../../components/Modal';
import EditPrices from './Variants/EditPrices';
import EditQuantities from './Variants/EditQuantities';
import EditHSCodes from './Variants/EditHSCodes';
import VariantImage from '../Variant/components/VariantImage';
import DZFileUploadBox from '../../components/forms/DZFileUploadBox';
import EditOriginCountry from './Variants/EditOriginCountry';
import EditVariantOptions from '../Variant/components/EditVariantOptions';
import BulkEditor from '../Variant/components/BulkEditor';
import ModalFooter from '../../components/ModalFooter';
import DropdownButton from '../../components/DropdownButton';
import Button from '../../components/Button';
import classNames from 'classnames';
import Checkbox from '../../components/forms/Checkbox';
import InputText from '../../components/forms/InputText';

interface Props {
  currentVariants: Variant[];
  variantOptions: VariantOption[];
  variantValues: VariantOption[];
  onChange: (variants: Variant[]) => void;
  onAddVariantClick: () => void;
  onEditVariantClick: (variant: Variant) => void;
  onImagesUpload: (images: Image[]) => void;
  onVariantsDelete: (variantIDs: number[]) => void;
  onBulkAttributesSet: <T extends keyof Variant>(
    variantIDs: number[],
    field: T,
    value: Variant[T],
  ) => void;
  images: Image[];
}

export default function VariantEditSection({
  currentVariants,
  variantOptions,
  variantValues,
  images,
  onChange,
  onAddVariantClick,
  onEditVariantClick,
  onImagesUpload,
  onVariantsDelete,
  onBulkAttributesSet,
}: Props) {
  const [checkedVariantIDs, setCheckedVariantIDs] = useState<Array<number>>([]);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const onVariantOptionsChange = (
    variant: Variant,
    option: VariantOption,
    value: string,
  ) => {
    const variants = currentVariants.map(v => {
      if (v.id === variant.id) {
        return {
          ...v,
          options: v.options?.map(o => {
            return o.name === option.name ? {...option, id: value} : o;
          }),
        };
      }
      return v;
    });
    onChange(variants);
  };

  const onVariantAttributeChange = <T extends keyof Variant>(
    variant: Variant,
    field: T,
    value: Variant[T],
  ) => {
    const variants = currentVariants.map(v => {
      if (v.id === variant.id) {
        return {
          ...v,
          [field]: value,
        };
      }
      return v;
    });
    onChange(variants);
  };

  const onApplyAll = <T extends keyof Variant>(field: T, value: Variant[T]) => {
    const variants = currentVariants.map(variant => {
      if (checkedVariantIDs.includes(variant.id)) {
        return {
          ...variant,
          [field]: value,
        };
      }
      return variant;
    });
    onChange(variants);
  };

  const ensure = <T extends {}>(argument: T | undefined | null) => {
    if (argument === undefined || argument === null) {
      throw new TypeError('invalid value');
    }
    return argument;
  };

  const onImageSubmit = () => {
    setShowDialog(null);
    if (selectedVariant) {
      onVariantAttributeChange(selectedVariant, 'image', selectedImage);
    } else {
      onApplyAll('image', selectedImage);
    }
    // setSelectedVariant(null);
  };

  const onCheckboxChange = (variantID: number) => {
    const checkedBox = checkedVariantIDs.includes(variantID)
      ? checkedVariantIDs.filter(vID => vID !== variantID)
      : [...checkedVariantIDs, variantID];
    setCheckedVariantIDs(checkedBox);
  };

  const onSelectedAllChange = () => {
    if (currentVariants.length === checkedVariantIDs.length) {
      setCheckedVariantIDs([]);
    } else {
      setCheckedVariantIDs(currentVariants.map(v => v.id));
    }
  };

  const onVariantOptionClick = (option: VariantOption) => {
    let variantIDs: Array<number> = [];
    currentVariants.map(variant => {
      return variantIDs = variant.options?.some(({id}) => id === option.id)
        ? [...variantIDs, variant.id]
        : [...variantIDs];
    });
    setCheckedVariantIDs([...variantIDs]);
  };

  const onBulkEditorConfirm = (variants: Variant[]) => {
    const selectedVariants = variants.map(({id}) => id);
    const newVariants = currentVariants.map(variant => {
      if (selectedVariants.includes(variant.id)) {
        return variants.find(v => v.id === variant.id) ?? variant;
      }
      return variant;
    });
    onChange(newVariants);
  };

  return (
    <Card>
      <div className="flex flex-row justify-between items-center text-sm space-x-4">
        <div className="flex-1">
          <Subheader text="Variants" />
        </div>
        <Button onClick={onAddVariantClick} theme="clear" buttonStyle="text-blue-500">
          Add Variant
        </Button>
        <div className="relative">
          <DropdownButton
            buttonTitle="More Options"
            arrowVisible={true}
            items={[
              {
                title: 'Edit Options',
                onClick: () => {
                  setShowDialog('edit_options');
                },
              },
              {
                title: 'Reorder Variants',
                onClick: () => {
                  setShowDialog('reorder_variants');
                },
              },
            ]}
            buttonProps={{theme: 'clear', style: 'text-blue-500'}}
          />
        </div>
      </div>

      <ul className="flex flex-row space-x-4 text-sm flex-wrap">
        <li className="">Select:</li>
        <li
          className="text-blue-500"
          onClick={() => setCheckedVariantIDs(currentVariants.map(v => v.id))}>
          All
        </li>
        <li className="text-blue-500" onClick={() => setCheckedVariantIDs([])}>
          None
        </li>
        {variantValues.map((option, i) => {
          return (
            <li
              key={i}
              className="text-blue-500"
              onClick={() => onVariantOptionClick(option)}>
              {option.id}
            </li>
          );
        })}
      </ul>

      <div className="overflow-x-auto overflow-y-auto text-sm">
        {checkedVariantIDs.length ? (
          <div className="flex flex-row items-center w-full py-2 h-12 ">
            <Button
              theme="clear"
              buttonStyle="px-4 py-2 rounded-l-md border border-gray-300 font-medium">
              <Checkbox
                name="selected"
                checked={checkedVariantIDs.length === currentVariants.length}
                onChange={() => onSelectedAllChange()}
              />
              <span className="px-2">{checkedVariantIDs.length} selected</span>
            </Button>

            <Button
              theme="clear"
              buttonStyle="-ml-px px-4 py-2 border border-gray-300 font-medium"
              onClick={() => setShowDialog('bulk_editor')}>
              Open bulk editor
            </Button>

            <DropdownButton
              buttonTitle="More actions"
              arrowVisible={true}
              width="w-[16rem]"
              buttonProps={{
                theme: 'clear',
                style: 'px-4 py-2 border border-gray-300 rounded-r-md',
              }}
              items={[
                {
                  title: 'Edit Prices',
                  onClick: () => {
                    setShowDialog('price');
                  },
                },
                {
                  title: 'Edit Quantities',
                  onClick: () => {
                    setShowDialog('quantity');
                  },
                },

                {
                  title: 'Add Images',
                  onClick: () => {
                    setShowDialog('add_images');
                  },
                },
                {
                  title: 'Remove Images',
                  onClick: () => {
                    setShowDialog('remove_images');
                  },
                },
                {
                  title: 'Edit HS codes',
                  onClick: () => {
                    setShowDialog('hs_code');
                  },
                },
                {
                  title: 'Edit country/region of origin',
                  onClick: () => {
                    setShowDialog('origin_country');
                  },
                },
                {
                  title: 'Delete Variants',
                  onClick: () => {
                    setShowDialog('delete_variants');
                  },
                },
                {
                  title: 'Continue selling when out of stock',
                  onClick: () => {
                    onBulkAttributesSet(
                      checkedVariantIDs,
                      'out_of_stock_sale',
                      true,
                    );
                  },
                },
                {
                  title: 'Stop selling when out of stock',
                  onClick: () => {
                    onBulkAttributesSet(
                      checkedVariantIDs,
                      'out_of_stock_sale',
                      false,
                    );
                  },
                },
              ]}
            />
          </div>
        ) : (
          <div className="flex flex-row items-center w-full py-2 h-12">
            <div className="flex items-center">
              <div className="flex justify-center items-center w-12">
                <Checkbox
                  checked={checkedVariantIDs.length === currentVariants.length}
                  onChange={() => onSelectedAllChange()}
                  name=""
                />
              </div>
              <div className="flex justify-center items-center w-16 " />
            </div>

            <div className="w-full">
              <div
                className={`grid items-center gap-6
                ${
                  variantOptions.length === 3 &&
                  'grid-cols-[repeat(4,10rem),9rem,9rem,auto]'
                }
                ${
                  variantOptions.length === 2 &&
                  'grid-cols-[repeat(3,10rem),9rem,9rem,auto]'
                }
                ${
                  variantOptions.length === 1 &&
                  'grid-cols-[repeat(2,10rem),9rem,9rem,auto]'
                }
                `}>
                {variantOptions.map((option, i) => {
                  return (
                    <div className="text-sm font-semibold" key={i}>
                      {option.name}
                    </div>
                  );
                })}
                <div className="text-sm font-semibold">Price</div>
                <div className="text-sm font-semibold">Quantity</div>
                <div className="text-sm font-semibold">SKU</div>
                <div className="text-sm font-semibold">Edit</div>
              </div>
            </div>
          </div>
        )}

        <ul className="max-w-full">
          {currentVariants.map((variant: Variant, i) => {
            return (
              <li
                key={i}
                className={classNames(
                  checkedVariantIDs.includes(variant.id)
                    ? 'bg-blue-50 dark:bg-gray-700'
                    : '',
                  'box-border position-relative inline-block min-w-full hover:bg-gray-100 dark:hover:bg-gray-900 border-t border-gray-200',
                )}>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="flex justify-center items-center w-12">
                      <Checkbox
                        checked={checkedVariantIDs.includes(variant.id)}
                        onChange={() => onCheckboxChange(variant.id)}
                        name=""
                      />
                    </div>
                    <div className="w-14 mr-2">
                      <VariantImage
                        imageStyle="h-12"
                        image={variant.image}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setShowDialog('add_images');
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="min-w-0 max-w-100 self-center ">
                      <div
                        className={`grid items-center gap-6
                        ${
                          variantOptions.length === 3 &&
                          'grid-cols-[repeat(4,10rem),9rem,9rem,auto]'
                        }
                        ${
                          variantOptions.length === 2 &&
                          'grid-cols-[repeat(3,10rem),9rem,9rem,auto]'
                        }
                        ${
                          variantOptions.length === 1 &&
                          'grid-cols-[repeat(2,10rem),9rem,9rem,auto]'
                        }
                       `}>
                        {variantOptions.map((option: VariantOption, idx) => {
                          let currentOption = ensure(
                            variant.options?.find(v => v.name === option.name),
                          );
                          return (
                            <div key={idx}>
                              <InputText
                                name={currentOption.id}
                                value={currentOption.id}
                                onChange={e =>
                                  onVariantOptionsChange(
                                    variant,
                                    currentOption,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          );
                        })}

                        <div className="">
                          <InputText
                            name="price"
                            value={variant.price}
                            onChange={e =>
                              onVariantAttributeChange(
                                variant,
                                'price',
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="">
                          <InputText
                            name="quantity"
                            value={variant.quantity}
                            onChange={e =>
                              onVariantAttributeChange(
                                variant,
                                'quantity',
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="">
                          <InputText
                            name="sku"
                            value={variant.sku}
                            onChange={e =>
                              onVariantAttributeChange(
                                variant,
                                'sku',
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="hidden sm:block flex sticky top-0 right-0 h-full py-4 px-2 bg-gray-100 dark:bg-gray-900 shadow shadow-md">
                          <div className="flex flex-row flex-nowrap box-border  items-center space-x-4">
                            <Button
                              theme="default"
                              buttonStyle="text-xs"
                              onClick={() => onEditVariantClick(variant)}>
                              Edit
                            </Button>
                            <Button
                              theme="default"
                              buttonStyle="text-xs"
                              onClick={() => {
                                setSelectedVariant(variant);
                                setShowDialog('delete_variant');
                              }}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Modal
        heading="Edit prices"
        visible={showDialog === 'price'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <EditPrices
          variants={currentVariants.filter(v =>
            checkedVariantIDs.includes(v.id),
          )}
          onChange={(variant, value) =>
            onVariantAttributeChange(variant, 'price', value)
          }
          onApplyAll={value => onApplyAll('price', value)}
        />
      </Modal>

      <Modal
        heading="Edit quantities"
        visible={showDialog === 'quantity'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <EditQuantities
          variants={currentVariants.filter(v =>
            checkedVariantIDs.includes(v.id),
          )}
          onChange={(variant, value) =>
            onVariantAttributeChange(variant, 'quantity', value)
          }
          onApplyAll={value => onApplyAll('quantity', value)}
        />
      </Modal>

      <Modal
        heading="Are you sure you want to delete the selected variants?"
        visible={showDialog === 'delete_variants'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => {
          setShowDialog(null);
          onVariantsDelete(checkedVariantIDs);
        }}
        theme="red"
        submitButtonTitle="Delete">
        <p className="p-5 text-sm">
          You cannot recover deleted product variants, do you wish to continue?
        </p>
      </Modal>

      <Modal
        heading="Are you sure you want to remove images?"
        visible={showDialog === 'remove_images'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => {
          setShowDialog(null);
          onApplyAll('image', null);
        }}
        theme="red"
        submitButtonTitle="Remove">
        <p className="p-5 text-sm">do you wish to continue?</p>
      </Modal>

      <Modal
        heading="Edit images"
        visible={showDialog === 'add_images'}
        onClose={() => setShowDialog(null)}
        onConfirm={onImageSubmit}>
        <div className="p-5">
          <DZFileUploadBox
            onImagesSelect={imgs => setSelectedImage(imgs[0])}
            onImagesUpload={imgs => onImagesUpload(imgs)}
            images={images}
            selectedImages={selectedImage ? [selectedImage] : []}
          />
        </div>
      </Modal>

      <Modal
        heading="Edit country/region of origin"
        visible={showDialog === 'origin_country'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <EditOriginCountry
          variants={currentVariants.filter(v =>
            checkedVariantIDs.includes(v.id),
          )}
          onChange={(variant, value) =>
            onVariantAttributeChange(variant, 'origin_country_id', value)
          }
          onApplyAll={value => onApplyAll('origin_country_id', value)}
        />
      </Modal>

      <Modal
        heading="Edit HS codes"
        visible={showDialog === 'hs_code'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <EditHSCodes
          variants={currentVariants.filter(v =>
            checkedVariantIDs.includes(v.id),
          )}
          onChange={(variant, value) =>
            onVariantAttributeChange(variant, 'hs_code', value)
          }
          onApplyAll={value => onApplyAll('hs_code', value)}
        />
      </Modal>

      <Modal
        heading="Edit Options"
        visible={showDialog === 'edit_options'}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <EditVariantOptions
          variants={currentVariants}
          variantOptions={variantOptions}
          variantValues={variantValues}
          onDelete={variants => {
            setShowDialog(null);
            onVariantsDelete(variants);
          }}
        />
      </Modal>

      <Modal
        heading="Bulk Edit"
        visible={showDialog === 'bulk_editor'}
        width="max-w-7xl"
        hideFooter={true}
        onClose={() => setShowDialog(null)}
        onConfirm={() => setShowDialog(null)}>
        <BulkEditor
          variants={currentVariants.filter(({id}) =>
            checkedVariantIDs.includes(id),
          )}>
          {variants => (
            <ModalFooter
              onHideModal={() => setShowDialog(null)}
              onProceed={() => {
                setShowDialog(null);
                onBulkEditorConfirm(variants);
              }}
            />
          )}
        </BulkEditor>
      </Modal>

      <Modal
        visible={showDialog === 'delete_variant'}
        heading={`Delete ${selectedVariant?.title}`}
        theme="red"
        submitButtonTitle="Delete"
        onClose={() => {
          setShowDialog(null);
          // setSelectedVariant(null);
        }}
        onConfirm={() => {
          setShowDialog(null);
          // setSelectedVariant(null);
          onVariantsDelete(selectedVariant ? [selectedVariant.id] : []);
        }}>
        <p className="p-5 text-sm">
          Are you sure you want to delete the variant {selectedVariant?.title}?
          This action cannot be reversed.
        </p>
      </Modal>
    </Card>
  );
}
