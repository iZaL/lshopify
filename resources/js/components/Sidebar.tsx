import React from 'react';
import SidebarNav from './SidebarNav';

export default function Sidebar() {
  return (
    <div className=" hidden md:flex md:flex-shrink-0">
      <div className="flex w-64 flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-16 flex-shrink-0 items-center justify-center px-4">
            <span className="text-center text-xl ">LARAVEL SHOPIFY</span>
          </div>
          <div className="mt-1 flex flex-grow flex-col">
            <SidebarNav />
          </div>
        </div>
      </div>
    </div>
  );
}
