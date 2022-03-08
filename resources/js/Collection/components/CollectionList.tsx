import React from 'react';
import {Collection, CollectionCondition} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';
import Table from '../../components/Table';
import SmartTable from '../../components/SmartTable';

interface Props {
  collections: Collection[];
}

export default function CollectionList({collections}: Props) {
  const onCollectionClick = (collection: Collection) => {
    return Inertia.get(route('lshopify.collections.edit', [collection.id]));
  };

  return (
    <>
      <SmartTable items={collections}>
        <SmartTable.SmartHeader>
          {({selectedItemIDs}) => {
            return <></>;
          }}
        </SmartTable.SmartHeader>

        <Table>
          <SmartTable.Header>
            <Table.Head  />
            <Table.Head title="Title" />
            <Table.Head title="Product conditions" />
            <Table.Head />
          </SmartTable.Header>
          <SmartTable.Body>
            {({item}) => {
              return (
                <>
                  <Table.Col>
                    <Button
                      theme="clear"
                      onClick={() => onCollectionClick(item)}>
                      {item.image && (
                        <VariantImage
                          onClick={() => onCollectionClick(item)}
                          image={item.image}
                          imageStyle="w-16 h-16 mr-2"
                        />
                      )}
                      {item.name}
                    </Button>
                  </Table.Col>
                  <Table.Col>{item.type}</Table.Col>
                  <Table.Col>
                    {item.conditions.map(
                      (condition: CollectionCondition, idx: number) => (
                        <div key={idx}>{condition.title}</div>
                      ),
                    )}
                  </Table.Col>
                </>
              );
            }}
          </SmartTable.Body>
        </Table>
      </SmartTable>
    </>
  );
}
