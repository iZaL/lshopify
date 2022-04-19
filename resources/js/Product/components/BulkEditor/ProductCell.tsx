import {Product, Tag} from '../../../types';
import Select from '../../../components/forms/Select';
import InputText from '../../../components/forms/InputText';
import React, {useEffect} from 'react';
import VariantImage from '../../Variant/components/VariantImage';
import {Popover} from '@headlessui/react';
import Button from '../../../components/Button';
import {XIcon} from '@heroicons/react/solid';
import classNames from 'classnames';

export default function ProductCell({
  product,
  attribute,
  onChange,
  onTagAdd,
  onTagRemove,
}: {
  product: Product;
  attribute: keyof Product;
  onChange: (value: string) => void;
  onTagAdd: (value: string) => void;
  onTagRemove: (tag: Tag) => void;
}) {
  useEffect(() => {
    setSelectedTags(product.tags ? product.tags : selectedTags);
  }, [product.tags]);

  const [tagValue, setTagValue] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>(
    product.tags ? product.tags : [],
  );

  const onTagChange = (tag: Tag) => {
    onTagRemove(tag);
  };

  const onTagSave = () => {
    setTagValue('');
    onTagAdd(tagValue);
  };

  if (attribute === 'tags') {
    return (
      <div className="inline-flex sm:shadow-sm">
        <Popover className="relative text-left">
          <Popover.Button
            className={classNames(
              'flex w-[18rem] flex-wrap p-1 ',
              !selectedTags.length ? 'py-4' : null,
            )}>
            {selectedTags.map((tag, idx) => (
              <div
                key={idx}
                className="my-px mx-px rounded rounded-md bg-gray-200 p-1 px-2 text-sm text-gray-700 ">
                {tag.name}
              </div>
            ))}
          </Popover.Button>

          <Popover.Panel className="absolute right-0 left-0 mt-2 rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="w[36rem] relative flex flex-col space-y-2 ">
              <div>Tags</div>
              <InputText
                onChange={value => setTagValue(value.target.value)}
                name="tags"
                rightComponent={tagValue ? <div>Save</div> : undefined}
                rightComponentOnClick={() => {
                  onTagSave();
                }}
              />
              <div>Add existing collection</div>
              <div className="inline-flex flex-wrap">
                {product.tags?.map((tag, idx) => (
                  <Button
                    theme="clear"
                    key={idx}
                    buttonStyle="rounded rounded-md bg-gray-200 p-1 px-2 text-sm text-gray-700 my-px mx-px "
                    onClick={() => onTagChange(tag)}>
                    {tag.name}
                    {selectedTags.includes(tag) && (
                      <XIcon
                        className="w-4 cursor-pointer hover:rounded hover:rounded-md hover:bg-gray-300"
                        onClick={() => {}}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    );
  }

  if (attribute === 'status') {
    return (
      <Select
        name="status"
        onChange={e => onChange(e.target.value)}
        value={product['status']}
        inputStyle="rounded-none shadow-none border-none focus:rounded-none min-w-[150px]">
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </Select>
    );
  }

  if (attribute === 'title') {
    return (
      <div className="inline-flex items-center">
        <VariantImage
          image={product.image}
          onClick={() => {}}
          imageStyle="h-10 ml-2"
          border={false}
        />
        <InputText
          name={attribute}
          value={product['title']}
          onChange={e => onChange(e.target.value)}
          inputStyle="min-w-[280px] rounded-none shadow-none border-none focus:rounded-none "
        />
      </div>
    );
  }

  return (
    <InputText
      name={attribute}
      value={product[attribute]}
      onChange={e => onChange(e.target.value)}
      inputStyle="min-w-[150px] rounded-none shadow-none border-none focus:rounded-none "
    />
  );
}
