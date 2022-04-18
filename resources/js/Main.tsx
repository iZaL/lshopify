import React from 'react';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import {Helmet} from 'react-helmet';
import PopMessages from './components/PopMessages';
import classNames from 'classnames';
import {useThemeStore} from './store';

export default function Main({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const {theme, toggle} = useThemeStore();

  return (
    <div className={classNames('', theme === 'dark' && 'dark')}>
      <Helmet>
        <title>{title ? title : 'Laravel Shopify'}</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-gray-100">
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
