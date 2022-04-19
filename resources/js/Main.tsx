import classNames from 'classnames';
import React from 'react';
import {Helmet} from 'react-helmet';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import PopMessages from './components/PopMessages';
import Sidebar from './components/Sidebar';
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
