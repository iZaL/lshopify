import React from 'react'
import Card from '../../components/Card'
import Label from '../../components/forms/Label'
import InputText from '../../components/forms/InputText'
import TextArea from '../../components/forms/TextArea'
import { Collection } from '../../types'

interface Props {
  onChange: <T extends keyof Collection>(
    field: T,
    value: Collection[T] | any,
  ) => void;
  name: string;
  description: string;
}

interface T extends Props {}

export default function TitleSection({onChange, name, description}: T) {
  return (
    <Card>
      <div>
        <Label title="Name" />
        <InputText
          name="name"
          placeholder={'e.g. Summer collection, Under 100$, Staff picks'}
          onChange={e => onChange('name', e.target.value)}
          value={name}
        />
      </div>

      <div>
        <Label title="Description (optional)" />
        <TextArea
          name="description"
          placeholder="Summer collection, Under 100$, Staff picks"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('description', e.target.value)
          }
          value={description || undefined}
        />
      </div>
    </Card>
  );
}
