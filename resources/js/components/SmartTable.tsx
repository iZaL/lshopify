import React, { useContext,useState } from 'react'
import Table from './Table'
import Checkbox from './forms/Checkbox'

interface ItemWithID {
  id:number
}

interface MyContextData <Item extends ItemWithID> {
  selectedItemIDs:Item['id'][],
  setSelectedItemIDs:(ids:Item['id'][])=>void,
  onSelectedAllChange:()=>void,
  items: Item[];
}

interface HeaderProps {
  children: (props: {onSelectedAllChange: () => void}) => JSX.Element;
}

interface SmartHeaderProps <T extends ItemWithID>{
  children: (props: {
    onSelectedAllChange: () => void;
    items: T[];
    selectedItemIDs: T['id'][];
  }) => JSX.Element;
}



const SmartTableContext = React.createContext<MyContextData<ItemWithID>>({
  selectedItemIDs: [],
  setSelectedItemIDs: () => {},
  onSelectedAllChange: () => {},
  items: []
})

type MyProviderProps<Item extends ItemWithID> = {
  items: Item[];
}

const SmartTable = <Item extends ItemWithID>({items, children}: React.PropsWithChildren<MyProviderProps<Item>>) => {
// const SmartTable = <Item extends ItemWithID>({items, children}: { items:T[];children:React.ReactNode }) => {
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
      {children}
    </SmartTableContext.Provider>
  );
};

const Header = ({children}: HeaderProps) => {
  const {selectedItemIDs, onSelectedAllChange} =  useContext(SmartTableContext);

  if (selectedItemIDs.length) {
    return null;
  }

  return (
    <thead>
      {children({
        onSelectedAllChange: onSelectedAllChange,
      })}
    </thead>
  );
};

const SmartHeader = ({children}: SmartHeaderProps<ItemWithID>) => {
  const {onSelectedAllChange, items, selectedItemIDs} = useContext(SmartTableContext);

  if (!selectedItemIDs.length) {
    return null;
  }

  return children({
    onSelectedAllChange,
    items,
    selectedItemIDs,
  });
};

interface BodyProps <T extends ItemWithID>{
  children: (props: {item: any}) => JSX.Element;
}

const Body = ({children}: BodyProps<ItemWithID>) => {
  const {items, selectedItemIDs, setSelectedItemIDs} =
    useContext(SmartTableContext);

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
            <Table.Col>
              <div className="flex w-12 items-center justify-center">
                <Checkbox
                  checked={selectedItemIDs.includes(item.id)}
                  // onChange={() => {}}
                  onChange={() => onCheckboxChange(item.id)}
                  name=""
                />
              </div>
            </Table.Col>
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
