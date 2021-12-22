import React from 'react';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import {Helmet} from 'react-helmet';
import FlashMessages from './components/FlashMessages';
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
      <div className='h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-800 dark:text-white '>
        <MobileSidebar />
        <Sidebar />
        <div className='flex flex-col w-0 flex-1 overflow-auto mb-50'>
          <Navbar />
          <PopMessages />
          {/*<FlashMessages />*/}
          {children}
        </div>
      </div>
    </div>
  );
}
