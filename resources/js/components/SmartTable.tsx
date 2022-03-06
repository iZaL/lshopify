import React, {useContext, useState} from 'react';
import Table from './Table';
import Checkbox from './forms/Checkbox';
import { Product } from '../types'

interface Props {
  items: Array<any>;
  children: React.ReactNode;
}

const SmartTableContext: any = React.createContext(null);

const SmartTable = ({items, children}: Props) => {
  const [selectedItemIDs, setSelectedItemIDs] = useState<number[]>([]);

  const onSelectedAllChange = () => {
    if (items.length === selectedItemIDs.length) {
      setSelectedItemIDs([]);
    } else {
      setSelectedItemIDs(items.map(v => v.id));
    }
  };

  const onCheckboxChange = (itemID: number) => {
    const checkedBox = selectedItemIDs.includes(itemID)
      ? selectedItemIDs.filter(vID => vID !== itemID)
      : [...selectedItemIDs, itemID];
    setSelectedItemIDs(checkedBox);
  };

  return (
    <SmartTableContext.Provider
      value={{
        selectedItemIDs,
        setSelectedItemIDs,
        onCheckboxChange,
        onSelectedAllChange,
        items,
      }}>
      {children}
    </SmartTableContext.Provider>
  );
};

interface HeaderProps {
  children: (props: {onSelectedAllChange: () => void}) => JSX.Element;
}

interface SmartHeaderProps {
  children: (props: {
    onSelectedAllChange: () => void;
    items: Array<any>;
    selectedItemIDs: number[];
  }) => JSX.Element;
}

const Header = ({children}: HeaderProps) => {
  const {selectedItemIDs, onSelectedAllChange}: any =
    useContext(SmartTableContext);

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
const SmartHeader = ({children}: SmartHeaderProps) => {
  const {onSelectedAllChange, items, selectedItemIDs}: any =
    useContext(SmartTableContext);

  if (!selectedItemIDs.length) {
    return null;
  }

  return children({
    onSelectedAllChange,
    items,
    selectedItemIDs,
  });
};

interface BodyProps {
  children: (props: {item: any}) => JSX.Element;
}

const Body = ({children}: BodyProps) => {
  const {items, selectedItemIDs,setSelectedItemIDs} =
    useContext<{items: Array<any>; selectedItemIDs: Array<number>;setSelectedItemIDs:(itemIDs:Array<number>)=>void}>(
      SmartTableContext,
    );

  const onCheckboxChange = (itemID: number) => {
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
