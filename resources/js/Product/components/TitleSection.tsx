import React from 'react';
import Card from '../../components/Card';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import TextArea from '../../components/forms/TextArea';
import {Product} from '../../types';

interface Props {
  onChange: (field: keyof Product, value: string) => void;
  title: string;
  description: string;
}

type T = Props;

export default function TitleSection({onChange, title, description}: T) {
  return (
    <Card>
      <div>
        <Label title="Title" />
        <InputText
          name="title"
          placeholder={'Short sleeve t-shirt'}
          onChange={e => onChange('title', e.target.value)}
          value={title}
        />
      </div>

      <div>
        <Label title="Description" />
        <TextArea
          richText={true}
          name="description"
          placeholder="Short sleeve t-shirt"
          onChange={value => onChange('description', value)}
          value={description || undefined}
        />
      </div>
    </Card>
  );
}
