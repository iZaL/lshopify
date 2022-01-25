import React, {useEffect} from 'react';
import Card from '../../components/Card';
import {Collection, CollectionCondition} from '../../types';
import Subheader from '../../components/Subheader';
import Border from '../../components/Border';
import InputText from '../../components/forms/InputText';
import Select from '../../components/forms/Select';
import {TrashIcon} from '@heroicons/react/outline';
import Button from '../../components/Button';

interface Props {
  onChange: <T extends keyof Collection>(
    field: T,
    value: Collection[T] | any,
  ) => void;
  collection: Collection;
}

type T = Props;

export default function CollectionTypeSection({onChange, collection}: T) {
  const addNewCondition = () => {
    onChange('conditions', [
      ...collection.conditions,
      {
        id: Math.floor(Math.random() * 100000),
        field: 'product_title',
        criteria: 'is_not_equal_to',
        value: '',
      },
    ]);
  };

  useEffect(() => {
    if (!collection.conditions.length) {
      addNewCondition();
    }
  }, [collection.conditions]);

  const initializeSmartCollection = () => {
    onChange('type', 'smart');
  };

  const onConditionChange = (
    selectedCondition: CollectionCondition,
    field: keyof CollectionCondition,
    value: string,
  ) => {
    const newConditions = collection.conditions.map(condition => {
      if (condition.id === selectedCondition.id) {
        return {
          ...condition,
          [field]: value,
        };
      }
      return condition;
    });
    onChange('conditions', newConditions);
  };

  return (
    <Card>
      <Subheader text="Collection type" />

      <div className="space-y-2 text-sm">
        <div>
          <div className="flex flex-row items-center">
            <input
              type="radio"
              value="manual"
              name="type"
              className="h-3 w-3"
              checked={collection.type === 'manual'}
              onChange={() => onChange('type', 'manual')}
            />
            <div className="ml-3">Manual</div>
          </div>
          <p className="ml-6 text-sm text-gray-500">
            Add products to this collection one by one. Learn more about
          </p>
        </div>

        <div>
          <div className="flex flex-row items-center">
            <input
              type="radio"
              value="smart"
              name="type"
              className="h-3 w-3"
              checked={collection.type === 'smart'}
              onChange={() => {
                initializeSmartCollection();
              }}
            />
            <div className="ml-3">Automated</div>
          </div>
          <p className="ml-6 text-sm text-gray-500">
            Existing and future products that match the conditions you set will
            automatically be added to this collection. Learn more about
            automated collections.
          </p>
        </div>
      </div>

      {collection.type === 'smart' && (
        <>
          <Border />

          <Subheader text="CONDITIONS" headerStyle="text-xs" />

          <div className="flex flex-row items-center text-sm">
            <div className="">Products must match :</div>
            <input
              type="radio"
              value="all"
              name="condition"
              checked={collection.determiner === 'all'}
              onChange={() => onChange('determiner', 'all')}
              className="ml-3 mr-2"
            />
            <div className="">all conditions</div>
            <input
              type="radio"
              value="any"
              name="condition"
              checked={collection.determiner === 'any'}
              onChange={() => onChange('determiner', 'any')}
              className="ml-3 mr-2"
            />
            <div className="">any conditions</div>
          </div>

          {collection.conditions.map((condition, i) => {
            return (
              <div className="flex flex-row items-center space-x-5" key={i}>
                <Select
                  name="title"
                  value={condition.field}
                  inputStyle="flex-1"
                  onChange={e =>
                    onConditionChange(condition, 'field', e.target.value)
                  }>
                  <option value="product_title">Product title</option>
                  <option value="product_type">Product type</option>
                  <option value="product_vendor">Product vendor</option>
                </Select>

                <Select
                  name="criteria"
                  value={condition.criteria}
                  inputStyle="flex-1"
                  onChange={e =>
                    onConditionChange(condition, 'criteria', e.target.value)
                  }>
                  <option value="is_equal_to">is equal to</option>
                  <option value="is_not_equal_to">is not equal to</option>
                  <option value="is_greather_than">is greather than</option>
                </Select>

                <InputText
                  name="value"
                  value={condition.value}
                  inputStyle="flex-1"
                  onChange={e =>
                    onConditionChange(condition, 'value', e.target.value)
                  }
                />

                <div className="cursor-pointer rounded rounded-md border border-gray-400 hover:bg-gray-200">
                  <TrashIcon className="h-8 w-8 p-1 text-gray-600" />
                </div>
              </div>
            );
          })}

          <Button
            theme="default"
            onClick={addNewCondition}
            // className="rounded rounded-md bg-white border border-gray-400 p-2 text-sm inline-block hover:bg-gray-100 "
          >
            Add another collection
          </Button>
        </>
      )}
    </Card>
  );
}
