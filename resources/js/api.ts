import {Image} from './types';
import route from 'ziggy-js';
import {Inertia, VisitOptions} from '@inertiajs/inertia';

export const deleteImages = (images: Image[], options?: VisitOptions) => {
  const url = route('lshopify.images.delete');
  const payload = {
    images: images,
  };
  Inertia.post(url, payload, options);
};

export const uploadImages = (
  images: Image[],
  imageableID: number,
  imageableType: 'product' | 'collection',
  options?: VisitOptions,
) => {
  const url = route('lshopify.images.store');
  const payload = {
    images: images,
    imageable_id: imageableID,
    imageable_type: imageableType,
  };
  Inertia.post(url, payload, options);
};
