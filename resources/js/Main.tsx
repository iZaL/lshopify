import React from 'react';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import {Helmet} from 'react-helmet';
import PopMessages from './components/PopMessages';
import classNames from 'classnames'

export default function Main({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {

  return (
    <div className={classNames('')}>
      <Helmet>
        <title>{title ? title : 'Laravel Shopify'}</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 dark:text-white ">
        <MobileSidebar />
        <Sidebar />
        <div className="mb-50 flex w-0 flex-1 flex-col overflow-auto">
          <Navbar />
          <PopMessages />
          {/*<FlashMessages />*/}
          {children}
        </div>
      </div>
    </div>
  );
}
