import React from 'react';

export default function Cell({
  cellStyle,
  children,
}: {
  children: React.ReactNode;
  cellStyle?: string;
}) {
  return (
    <td className={`border text-sm font-normal ${cellStyle}`}>{children}</td>
  );
}
