import React from 'react';
import Card from '../../components/Card';
import Select from '../../components/forms/Select';
import Subheader from '../../components/Subheader';
import ProductTitle from '../../Product/components/ProductTitle';
import VariantImage from '../../Product/Variant/components/VariantImage';
import {Product} from '../../types';

interface Props {
  collectionProducts: Product[];
  sortTerm: string;
}

export default function ProductSection({collectionProducts, sortTerm}: Props) {
  return (
    <Card>
      <Subheader text="Products" />

      <div className="flex flex-row flex-wrap items-stretch">
        <div className="mt-2 flex-grow sm:mt-0">
          <Select name="sort" onChange={() => {}} value={sortTerm}>
            <option value="">Best selling</option>
            <option value="">Product title A-Z</option>
          </Select>
        </div>
      </div>

      <div>
        {collectionProducts.map((product, i) => (
          <div
            className="flex flex-row items-center space-x-2 space-y-2 px-4"
            key={i}>
            <div className="w-5">{i + 1}.</div>
            <VariantImage image={product.image} onClick={() => {}} />
            <div className="flex-auto">
              <ProductTitle product={product} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
