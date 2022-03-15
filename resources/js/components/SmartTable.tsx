import React, {useContext, useState} from 'react';
import Table from './Table';
import Checkbox from './forms/Checkbox';
import Button from './Button';

interface ItemWithID {
  id: number;
}

interface SmartTableContextData<Item extends ItemWithID> {
  selectedItemIDs: Item['id'][];
  setSelectedItemIDs: (ids: Item['id'][]) => void;
  onSelectedAllChange: () => void;
  items: Item[];
}

interface HeaderProps {
  children: React.ReactNode;
}

const SmartTableContext = React.createContext<SmartTableContextData<ItemWithID>>({
  selectedItemIDs: [],
  setSelectedItemIDs: () => {},
  onSelectedAllChange: () => {},
  items: [],
});

const SmartTable = <Item extends ItemWithID>({
  items,
  children,
}: {
  items: Item[];
  children: React.ReactNode;
}) => {
  const [selectedItemIDs, setSelectedItemIDs] = useState<Item['id'][]>([]);

  const onSelectedAllChange = () => {
    if (items.length === selectedItemIDs.length) {
      setSelectedItemIDs([]);
    } else {
      setSelectedItemIDs(items.map(v => v.id));
    }
  };

  return (
    <SmartTableContext.Provider
      value={{
        selectedItemIDs,
        setSelectedItemIDs,
        onSelectedAllChange,
        items,
      }}>
      <div className='relative'>
        {children}
      </div>
    </SmartTableContext.Provider>
  );
};

const Header = ({children}: HeaderProps) => {
  const {selectedItemIDs, onSelectedAllChange, items} = useContext(SmartTableContext);

  return (
    <thead>
    <Table.Row rowStyle="m-2">
      <Table.Header headerStyle="w-16">
        <div className="flex w-12 items-center justify-center">
        <Checkbox
          checked={selectedItemIDs.length === items.length && items.length != 0}
          onChange={() => onSelectedAllChange()}
          name="check-all"
          // inputStyle="mx-4"
          />
        </div>
      </Table.Header>
      {children}
    </Table.Row>
    </thead>
  );
};

interface SmartHeaderProps<Item extends ItemWithID> {
  children: (props: {selectedItemIDs: Item['id'][]}) => JSX.Element;
}

const SmartHeader = ({children}: SmartHeaderProps<ItemWithID>) => {
  const {onSelectedAllChange, items, selectedItemIDs} = useContext(SmartTableContext);

  if (!selectedItemIDs.length) {
    return null;
  }

  return (
    <div className="z-20 absolute top-0 left-12 flex h-10 items-center bg-white pt-2 ">
      <div className="mb-2 flex w-full flex-row px-4">
        <Button theme="clear" buttonStyle="px-6 py-2 rounded-l-md border border-gray-300 font-medium">
          {selectedItemIDs.length} selected
        </Button>

        {children({
          selectedItemIDs,
        })}
      </div>
    </div>
  );
};

interface BodyProps<T extends ItemWithID> {
  children: (props: {item: any}) => JSX.Element;
}

const Body = ({children}: BodyProps<ItemWithID>) => {
  const {items, selectedItemIDs, setSelectedItemIDs} = useContext(SmartTableContext);

  const onCheckboxChange = (itemID: ItemWithID['id']) => {
    const checkedBox = selectedItemIDs.includes(itemID)
      ? selectedItemIDs.filter(vID => vID !== itemID)
      : [...selectedItemIDs, itemID];
    setSelectedItemIDs(checkedBox);
  };

  return (
    <tbody>
    {items.map((item, id) => {
      return (
        <Table.Row key={id} idx={id} onClick={() => {}}>
          <Table.Cell>
            <div className="flex w-12 items-center justify-center">
              <Checkbox
                checked={selectedItemIDs.includes(item.id)}
                // onChange={() => {}}
                onChange={() => onCheckboxChange(item.id)}
                name=""
              />
            </div>
          </Table.Cell>
          {children({
            item,
          })}
        </Table.Row>
      );
    })}
    </tbody>
  );
};

SmartTable.Header = Header;
SmartTable.SmartHeader = SmartHeader;
SmartTable.Body = Body;
export default SmartTable;
