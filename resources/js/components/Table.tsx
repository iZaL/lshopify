import classNames from 'classnames';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface CellProps {
  children?: React.ReactNode;
  cellStyle?: string;
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
    <div className="flex flex-grow overflow-x-auto">
      <table className="relative min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
};

const Header = ({title, children = null, headerStyle}: HeaderProps) => {
  return (
    <th
      className={`py-4 px-2 text-left text-sm font-medium text-gray-900 ${headerStyle}`}>
      {title ? title : children}
    </th>
  );
};

const Row = ({children, striped = true, idx, onClick, rowStyle}: RowProps) => {
  return (
    <tr
      className={classNames(
        '',
        striped
          ? `${idx && idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`
          : 'bg-white',
        onClick && 'cursor-pointer hover:bg-gray-100',
        rowStyle,
      )}
      onClick={onClick}>
      {children}
    </tr>
  );
};

const Cell = ({children, cellStyle}: CellProps) => {
  return (
    <td className={`py-4 px-2 text-left text-sm text-gray-800 ${cellStyle}`}>
      {children}
    </td>
  );
};

Table.Row = Row;
Table.Cell = Cell;
Table.Header = Header;

export default Table;
