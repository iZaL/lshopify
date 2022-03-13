import React from 'react';
import classNames from 'classnames';

interface Props {
  children: React.ReactNode;
}

interface CellProps {
  children?: React.ReactNode;
  colStyle?: string;
}

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  headerStyle?: string;
}

interface RowProps {
  striped?: boolean;
  children: React.ReactNode;
  idx?: number;
  onClick?: () => void;
  rowStyle?: string;
}

const Table = ({children}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 flex-grow overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="relative min-w-full divide-y divide-gray-200">{children}</table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({children, striped = true, idx, onClick, rowStyle}: RowProps) => {
  return (
    <tr
      className={classNames(
        'whitespace-nowrap px-6 py-4 text-sm text-gray-600',
        striped ? `${idx && idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}` : 'bg-white',
        onClick && 'cursor-pointer hover:bg-gray-100',
        rowStyle,
      )}
      onClick={onClick}>
      {children}
    </tr>
  );
};

const Cell = ({children, colStyle}: CellProps) => {
  return (
    <td className={`whitespace-nowrap px-6 py-4 text-sm text-gray-500 ${colStyle}`}>{children}</td>
  );
};

const Header = ({title, children = null, headerStyle}: HeaderProps) => {
  return (
    <th
      className={`px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-900 ${headerStyle}`}>
      {title ? title : children}
    </th>
  );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Header = Header;

export default Table;
