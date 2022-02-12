import React from 'react';
import {CollectionCondition} from '../../types';
import InputText from '../../components/forms/InputText';
import Select from '../../components/forms/Select';
import {TrashIcon} from '@heroicons/react/outline';

interface Props {
  condition: CollectionCondition;
  onFieldChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCriteriaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export default function CollectionConditionItem(props: Props) {
  return (
    <div className="flex flex-row items-center space-x-5">
      <Select
        name="title"
        value={props.condition.field}
        inputStyle="flex-1"
        onChange={props.onFieldChange}>
        <option value="title">Product title</option>
        <option value="product_type">Product type</option>
        {/*<option value="vendor">Product vendor</option>*/}
        <option value="product_tag">Product tag</option>
        <option value="price">Price</option>
        <option value="compare_at_price">Compare at price</option>
        <option value="weight">Weight</option>
        <option value="stock">Inventory stock</option>
        <option value="variant_title">Variant's title</option>
      </Select>

      <Select
        name="criteria"
        value={props.condition.criteria}
        inputStyle="flex-1"
        onChange={props.onCriteriaChange}>
        <option value="is_equal_to">is equal to</option>
        <option value="is_not_equal_to">is not equal to</option>
        <option value="is_greater_than">is greater than</option>
        <option value="is_less_than">is less than</option>
        <option value="starts_with">starts with</option>
        <option value="ends_with">ends_with</option>
        <option value="contains">contains</option>
        <option value="does_not_contain">does not contain</option>
        <option value="is_not_empty">is not empty</option>
        <option value="is_empty">is empty</option>
      </Select>

      <InputText
        name="value"
        value={props.condition.value}
        inputStyle="flex-1"
        onChange={props.onValueChange}
      />

      <div
        className="cursor-pointer rounded rounded-md border border-gray-400 hover:bg-gray-200"
        onClick={() => props.onDelete()}>
        <TrashIcon className="h-8 w-8 p-1 text-gray-600" />
      </div>
    </div>
  );
}
