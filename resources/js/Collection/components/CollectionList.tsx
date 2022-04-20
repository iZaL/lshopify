import {Inertia} from '@inertiajs/inertia';
import React from 'react';
import route from 'ziggy-js';

import Button from '../../components/Button';
import SmartTable from '../../components/SmartTable';
import Table from '../../components/Table';
import VariantImage from '../../Product/Variant/components/VariantImage';
import {Collection, CollectionCondition} from '../../types';

interface Props {
  collections: Collection[];
}

export default function CollectionList({collections}: Props) {
  const onCollectionClick = (collection: Collection) =>
    Inertia.get(route('lshopify.collections.edit', [collection.id]));

  return (
    <SmartTable items={collections}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => <></>}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header title="Title" />
          <Table.Header title="Product conditions" />
        </SmartTable.Header>
        <SmartTable.Body onItemClick={onCollectionClick}>
          {({item}) => (
            <>
              <Table.Cell>
                <Button theme="clear" onClick={() => onCollectionClick(item)}>
                  {item.image && (
                    <VariantImage
                      onClick={() => onCollectionClick(item)}
                      image={item.image}
                      imageStyle="w-16 h-16 mr-2"
                    />
                  )}
                  {item.name}
                </Button>
              </Table.Cell>
              <Table.Cell>
                {item.conditions.map(
                  (condition: CollectionCondition, idx: number) => (
                    <div key={idx}>{condition.title}</div>
                  ),
                )}
              </Table.Cell>
            </>
          )}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
