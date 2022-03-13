import {Product, Variant} from '../../../types';

export type Attributes = {
  [name in keyof Product | keyof Variant]: string;
};

export type AttributeLabel = Partial<Attributes>;
