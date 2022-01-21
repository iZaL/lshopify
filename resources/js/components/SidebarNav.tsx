import React from 'react';
import Navigator from './Navigator';
import route from 'ziggy-js';

export default function SidebarNav() {
  console.log('route current', route().current());
  return (
    <Navigator>
      <Navigator.Item
        name="Home"
        active={route().current() === 'lshopify.home'}
        href={route('lshopify.home')}
      />
      <Navigator.Item
        name="Products"
        active={route().current('lshopify.products.*')}
        dropdown={true}
        href={route('lshopify.products.index')}>
        <Navigator.SubItem
          name="All Products"
          href={route('lshopify.products.index')}
          active={route().current('lshopify.products.index')}
        />
      </Navigator.Item>

      <Navigator.Item
        name="Orders"
        active={route().current('lshopify.orders.*')}
        dropdown={true}
        href={route('lshopify.orders.index')}>
        <Navigator.SubItem
          name="All Orders"
          href={route('lshopify.orders.index')}
          active={route().current('lshopify.orders.index')}
        />
      </Navigator.Item>
    </Navigator>
  );

  //     <div className="flex justify-end px-2 py-4">
  //       <Switch
  //         checked={darkMode}
  //         onChange={() => setDarkMode(!darkMode)}
  //         className={`${
  //           darkMode ? 'bg-blue-600' : 'bg-gray-200'
  //         } relative inline-flex items-center h-6 rounded-full w-11`}>
  //         <span className="sr-only">Dark</span>
  //         <span
  //           className={`${
  //             darkMode ? 'translate-x-6' : 'translate-x-1'
  //           } inline-block w-4 h-4 transform bg-white rounded-full`}
  //         />
  //       </Switch>
  //     </div>
  //   </div>
  // );
}
