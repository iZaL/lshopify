import React from 'react';
import Navigator from './Navigator';
import route from 'ziggy-js';

export default function SidebarNav() {
  return (
    <Navigator>
      <Navigator.Item
        name="Home"
        active={route().current() === 'lshopify.home'}
        href={route('lshopify.home')}
      />
      <Navigator.Item
        name="Products"
        active={
          route().current('lshopify.products.*') ||
          route().current('lshopify.collections.*') ||
          route().current('lshopify.inventories.*')
        }
        href={route('lshopify.products.index')}
        dropdown={true}>
        <Navigator.SubItem
          name="All Products"
          href={route('lshopify.products.index')}
          active={route().current('lshopify.products.*')}
        />
        <Navigator.SubItem
          name="Inventory"
          href={route('lshopify.inventories.index')}
          active={route().current('lshopify.inventories.*')}
        />
        <Navigator.SubItem
          name="Collections"
          href={route('lshopify.collections.index')}
          active={route().current('lshopify.collections.*')}
        />
      </Navigator.Item>

      <Navigator.Item
        name="Orders"
        active={route().current('lshopify.orders.*')}
        href={route('lshopify.orders.index')}
        dropdown={true}>
        <Navigator.SubItem
          name="All Orders"
          href={route('lshopify.orders.index')}
          active={route().current('lshopify.orders.index')}
        />
        <Navigator.SubItem
          name="Drafts"
          href={route('lshopify.orders.draft.index')}
          active={route().current('lshopify.orders.draft.*')}
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
