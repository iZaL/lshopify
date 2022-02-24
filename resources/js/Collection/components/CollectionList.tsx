import React from 'react';
import {Collection} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';
import Table from '../../components/Table';

interface Props {
  collections: Collection[];
}

export default function CollectionList({collections}: Props) {
  const onCollectionClick = (collection: Collection) => {
    return Inertia.get(route('lshopify.collections.edit', [collection.id]));
  };

  return (
    <Table>
      <thead>
        <tr>
          <Table.Head headerStyle="w-16" />
          <Table.Head title="Title" />
          <Table.Head title="Product conditions" />
          <Table.Head />
        </tr>
      </thead>
      <tbody>
        {collections.map((collection, id) => (
          <Table.Row key={id} idx={id}>
            <Table.Col>
              <div className="flex w-12 items-center justify-center">
                <Checkbox checked={false} onChange={() => {}} name="" />
              </div>
            </Table.Col>

            <Table.Col>
              <Button
                theme="clear"
                onClick={() => onCollectionClick(collection)}>
                {collection.image && (
                  <VariantImage
                    onClick={() => onCollectionClick(collection)}
                    image={collection.image}
                    imageStyle="w-16 h-16 mr-2"
                  />
                )}
                {collection.name}
              </Button>
            </Table.Col>
            <Table.Col>{collection.type}</Table.Col>
            <Table.Col>
              {collection.conditions.map((condition, idx) => (
                <div key={idx}>{condition.title}</div>
              ))}
            </Table.Col>
          </Table.Row>
        ))}
      </tbody>
    </Table>
  );
}
