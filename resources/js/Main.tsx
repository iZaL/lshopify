import React from 'react';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import {Helmet} from 'react-helmet';
import {useRecoilValue} from 'recoil';
import {darkModeState} from './atoms';
import PopMessages from './components/PopMessages';

export default function Main({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const darkMode = useRecoilValue(darkModeState);

  return (
    <div className={darkMode ? 'dark' : ''}>
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
