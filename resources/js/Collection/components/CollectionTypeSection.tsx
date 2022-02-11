import React, {useEffect} from 'react';
import Card from '../../components/Card';
import {Collection, CollectionCondition} from '../../types';
import Subheader from '../../components/Subheader';
import Border from '../../components/Border';
import Button from '../../components/Button';
import CollectionConditionItem from './CollectionConditionItem';

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
    <div className="space-y-4">
      {collection.type === 'smart' && (
        <>
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
              <CollectionConditionItem
                key={i}
                condition={condition}
                onFieldChange={e =>
                  onConditionChange(condition, 'field', e.target.value)
                }
                onCriteriaChange={e =>
                  onConditionChange(condition, 'criteria', e.target.value)
                }
                onValueChange={e =>
                  onConditionChange(condition, 'value', e.target.value)
                }
                onDelete={() => {
                  const newConditions = collection.conditions.filter(
                    c => c.id !== condition.id,
                  );
                  onChange('conditions', newConditions);
                }}
              />
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
    </div>
  );
}
