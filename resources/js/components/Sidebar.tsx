import React from 'react';
import SidebarNav from './SidebarNav';

export default function Sidebar() {
  return (
    <div className=" hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-transparent bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 justify-center h-16">
            <span className="text-xl text-center dark:text-gray-100">
              LARAVEL SHOPIFY
            </span>
          </div>
          <div className="mt-1 flex-grow flex flex-col">
            <SidebarNav />
          </div>
        </div>
      </div>
    </div>
  );
}
