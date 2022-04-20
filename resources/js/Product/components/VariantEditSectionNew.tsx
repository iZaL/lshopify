import {Disclosure} from '@headlessui/react';
import {ViewListIcon} from '@heroicons/react/outline';
import React, {useState} from 'react';
import CreatableSelect from 'react-select/creatable';

import Border from '../../components/Border';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DropdownButton from '../../components/DropdownButton';
import Checkbox from '../../components/forms/Checkbox';
import DZFileUploadBox from '../../components/forms/DZFileUploadBox';
import InputText from '../../components/forms/InputText';
import Modal from '../../components/Modal';
import ModalFooter from '../../components/ModalFooter';
import PopoverButton from '../../components/PopoverButton';
import Subheader from '../../components/Subheader';
import TabPill from '../../components/TabPill';
import {Image, Variant, VariantOption, VariantValue} from '../../types';
import BulkEditor from '../Variant/components/BulkEditor';
import EditVariantOptions from '../Variant/components/EditVariantOptions';

import EditHSCodes from './Variants/EditHSCodes';
import EditOriginCountry from './Variants/EditOriginCountry';
import EditPrices from './Variants/EditPrices';
import EditQuantities from './Variants/EditQuantities';

interface Props {
  defaultVariantOptions: VariantOption[];
  currentVariants: Variant[];
  variantOptions: VariantOption[];
  onChange: (variants: Variant[]) => void;
  onAddVariantClick: () => void;
  onEditVariantClick: (variant: Variant) => void;
  onImagesUpload: (images: Image[]) => void;
  onVariantsDelete: (variantIDs: Variant['id'][]) => void;
  onBulkAttributesSet: <T extends keyof Variant>(
    variantIDs: Variant['id'][],
    field: T,
    value: Variant[T],
  ) => void;
  images: Image[];
  onDataSet: (data: any) => void;
}

export default function VariantEditSectionNew({
  defaultVariantOptions,
  currentVariants,
  variantOptions,
  images,
  onChange,
  onAddVariantClick,
  onEditVariantClick,
  onImagesUpload,
  onVariantsDelete,
  onBulkAttributesSet,
  onDataSet,
}: Props) {
  const [checkedVariantIDs, setCheckedVariantIDs] = useState<Variant['id'][]>(
    [],
  );
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  console.log('variantOptions', variantOptions);

  const onVariantOptionsChange = (
    variant: Variant,
    option: VariantOption,
    value: string,
  ) => {
    const variants = currentVariants.map(v => {
      if (v.id === variant.id) {
        return {
          ...v,
          options: v.options?.map(o =>
            o.id === option.id ? {...option, name: value} : o,
          ),
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

  const onImageSubmit = () => {
    setShowDialog(null);
    if (selectedVariant) {
      onVariantAttributeChange(selectedVariant, 'image', selectedImage);
    } else {
      onApplyAll('image', selectedImage);
    }
  };

  const onSelectedAllChange = () => {
    if (currentVariants.length === checkedVariantIDs.length) {
      setCheckedVariantIDs([]);
    } else {
      setCheckedVariantIDs(currentVariants.map(v => v.id));
    }
  };

  const onCheckboxChange = (variantID: number) => {
    const checkedBox = checkedVariantIDs.includes(variantID)
      ? checkedVariantIDs.filter(vID => vID !== variantID)
      : [...checkedVariantIDs, variantID];
    setCheckedVariantIDs(checkedBox);
  };

  const onOptionValueClick = (
    variantOption: VariantOption,
    value: VariantValue,
  ) => {
    let variantIDs: Array<number> = checkedVariantIDs;
    currentVariants.forEach(variant => {
      variant.options.forEach(option => {
        if (option.id === variantOption.id && option.name === value.name) {
          variantIDs = variantIDs.includes(variant.id)
            ? variantIDs.filter(vID => vID !== variant.id)
            : [...variantIDs, variant.id];
        }
      });
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

  const onVariantOptionChange = (
    oldVariantOption: VariantOption,
    newVariantOption: VariantOption,
  ) => {
    console.log('oldVariantOption', oldVariantOption);
    console.log('newVariantOption', newVariantOption);
    const newVariantOptions = variantOptions.map(option => {
      if (option.id === oldVariantOption.id) {
        return {
          ...newVariantOption,
          values: newVariantOption.values,
        };
      }
      return option;
    });
    // let variants: Array<Variant> = [];

    // currentVariants.forEach(variant => {
    //   variant.options.forEach(option => {
    //     if (option.id === variantOption.id && option.name === value.name) {
    //       variantIDs = variantIDs.includes(variant.id)
    //         ? variantIDs.filter(vID => vID !== variant.id)
    //         : [...variantIDs, variant.id];
    //     }
    //   });
    // })

    // update options changes to variants
    const variants = currentVariants.map(variant => {
      console.log('v', variant);
      // if(variant.options.some(option => option.id === oldVariantOption.id)) {
      //   return {
      //     ...variant,
      //     options: variant.options.map(option => {
      //       if(option.id === oldVariantOption.id) {
      //         return {
      //           ...newVariantOption,
      //           values: newVariantOption.values,
      //         };
      //       }
      //       return option;
      //     })
      //   }
      // }
      return variant;
    });

    onDataSet({
      variant_options: newVariantOptions,
      variants,
    });
  };

  const pendingVariants = defaultVariantOptions.filter(
    ({name}) => !variantOptions.some(v => v.id === name),
  );

  const onVariantOptionValueChange = (
    option: VariantOption,
    value: VariantValue,
    fieldValue: string,
  ) => {
    const newOption = {
      ...option,
      values: option.values?.map((v, i) => {
        if (v.id === value.id) {
          return {
            id: fieldValue,
            name: fieldValue,
          };
        }
        return v;
      }),
    };

    const hasBlankValue = newOption.values?.some(v => v.name === '');
    if (hasBlankValue) {
      onVariantOptionChange(option, newOption);
    } else {
      addWithEmptyValue(newOption);
    }
  };

  const addWithEmptyValue = (option: VariantOption) => {
    // console.log('option',option);
    const hasBlankValue = option.values?.some(v => v.id === '');
    if (!hasBlankValue) {
      const newOption = {
        ...option,
        values: option.values?.length
          ? [...option.values, {id: '', name: ''}]
          : [{id: '', name: ''}],
      };
      onVariantOptionChange(option, newOption);
    }
  };

  return (
    <>
      <Card>
        <Subheader text="Options" />
        <Border />

        {variantOptions.map((option, idx) => (
          <div key={idx}>
            <Disclosure>
              {({open}) => (
                <>
                  {!open && (
                    <div
                      key={idx}
                      className="flex flex-row items-center space-x-6 py-2">
                      <div className="space-p-0 inline-flex">
                        <ViewListIcon className="w-6 text-gray-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm font-semibold">
                          {option.name}
                        </div>
                        <div className="flex space-x-2 pt-1">
                          {option.values?.map((value, idx) => (
                            <TabPill
                              key={idx}
                              title={value.name}
                              hideCloseIcon
                            />
                          ))}
                        </div>
                      </div>
                      <Disclosure.Button as="div">
                        <Button
                          theme="default"
                          buttonStyle="py-1 px-3 text-sm"
                          onClick={() => addWithEmptyValue(option)}>
                          Edit
                        </Button>
                      </Disclosure.Button>
                    </div>
                  )}

                  <Disclosure.Panel>
                    <div className="flex flex-row items-center space-x-6 py-2">
                      <div className="space-p-0 inline-flex">
                        <ViewListIcon className="w-6 text-gray-500" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div>Option name</div>

                        <CreatableSelect
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={newOption => {
                            if (newOption) {
                              onVariantOptionChange(option, {
                                id: newOption.value,
                                name: newOption.label,
                                values: option.values || [],
                              });
                            }
                          }}
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          noOptionsMessage={() => null}
                          options={pendingVariants.map(({name, id}) => ({
                            label: name,
                            value: id,
                          }))}
                          value={{label: option.name, value: option.id}}
                        />

                        <div className="flex-1">Option values</div>
                        {option.values?.map((value, idx) => (
                          <InputText
                            name={value.name}
                            onChange={e =>
                              onVariantOptionValueChange(
                                option,
                                value,
                                e.target.value,
                              )
                            }
                            value={value.name}
                            placeholder="Add another value"
                            key={idx}
                          />
                        ))}
                      </div>
                    </div>

                    <Disclosure.Button as="div">
                      <Button
                        theme="default"
                        buttonStyle="py-1 px-3 text-sm"
                        // onClick={() => setShowDialog(option.id)}
                      >
                        Done
                      </Button>
                    </Disclosure.Button>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Border />
          </div>
        ))}
      </Card>

      <Card>
        <div className="flex flex-row items-center justify-between space-x-4 text-sm">
          <div className="flex-1">
            <Subheader text="Variants" />
          </div>
          <Button
            onClick={onAddVariantClick}
            theme="clear"
            buttonStyle="text-blue-500">
            Add Variant
          </Button>
          <div className="relative">
            <DropdownButton
              buttonTitle="More Options"
              arrowVisible
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
              buttonProps={{theme: 'clear', buttonStyle: 'text-blue-500'}}
            />
          </div>
        </div>

        <div className="flex flex-row flex-wrap space-x-4 text-sm text-blue-500">
          <span className="text-gray-900">Select:</span>
          <Button
            theme="clear"
            onClick={() =>
              setCheckedVariantIDs(currentVariants.map(v => v.id))
            }>
            All
          </Button>
          <Button theme="clear" onClick={() => setCheckedVariantIDs([])}>
            None
          </Button>
          <div className="z-30 bg-white">
            {variantOptions.map((option, idx) => (
              <PopoverButton
                key={idx}
                title={option.name}
                buttonStyle="text-sm border-none py-0 hover:bg-white">
                {option.values?.map((value, idx) => {
                  const checked = checkedVariantIDs.some(vID => {
                    const variant = currentVariants.find(v => v.id === vID);
                    return variant?.options?.some(
                      ({id, name}) => id === option.id && name === value.name,
                    );
                  });

                  return (
                    <Checkbox
                      key={idx}
                      name={value.id}
                      checked={checked}
                      onChange={() => onOptionValueClick(option, value)}
                      label={value.name}
                    />
                  );
                })}
              </PopoverButton>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto  text-sm">
          {checkedVariantIDs.length ? (
            <div className="flex h-12 w-full flex-row items-center py-2 ">
              <Button
                theme="clear"
                buttonStyle="px-4 py-2 rounded-l-md border border-gray-300 font-medium">
                <Checkbox
                  name="selected"
                  checked={checkedVariantIDs.length === currentVariants.length}
                  onChange={() => onSelectedAllChange()}
                />
                <span className="px-2">
                  {checkedVariantIDs.length} selected
                </span>
              </Button>

              <Button
                theme="clear"
                buttonStyle="-ml-px px-4 py-2 border border-gray-300 font-medium"
                onClick={() => setShowDialog('bulk_editor')}>
                Open bulk editor
              </Button>

              <DropdownButton
                buttonTitle="More actions"
                arrowVisible
                width="w-[16rem]"
                buttonProps={{
                  theme: 'clear',
                  buttonStyle:
                    '-ml-px px-4 py-2 border border-gray-300 rounded-r-md',
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
            <div className="flex h-12 w-full flex-row items-center py-2">
              <div className="flex items-center">
                <div className="flex w-12 items-center justify-center">
                  <Checkbox
                    checked={
                      checkedVariantIDs.length === currentVariants.length
                    }
                    onChange={() => onSelectedAllChange()}
                    name=""
                    inputStyle="line-through indeterminate"
                  />
                </div>
                <div className="flex w-16 items-center justify-center " />
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
                  {variantOptions.map((option, i) => (
                    <div className="text-sm font-semibold" key={i}>
                      {option.name}
                    </div>
                  ))}
                  <div className="text-sm font-semibold">Price</div>
                  <div className="text-sm font-semibold">Quantity</div>
                  <div className="text-sm font-semibold">SKU</div>
                  <div className="text-sm font-semibold">Edit</div>
                </div>
              </div>
            </div>
          )}
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
          theme="error"
          submitButtonTitle="Delete">
          <p className="p-5 text-sm">
            You cannot recover deleted product variants, do you wish to
            continue?
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
          theme="error"
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
          hideFooter
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
          theme="error"
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
            Are you sure you want to delete the variant {selectedVariant?.title}
            ? This action cannot be reversed.
          </p>
        </Modal>
      </Card>
    </>
  );
}
