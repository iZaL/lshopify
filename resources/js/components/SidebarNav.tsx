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
        active={
          route().current('lshopify.orders.*') ||
          route().current('lshopify.draft.orders.*')
        }
        href={route('lshopify.orders.index')}
        dropdown={true}>
        <Navigator.SubItem
          name="All Orders"
          href={route('lshopify.orders.index')}
          active={route().current('lshopify.orders.*')}
        />
        <Navigator.SubItem
          name="Drafts"
          href={route('lshopify.draft.orders.index')}
          active={route().current('lshopify.draft.orders.*')}
        />
      </Navigator.Item>
    </Navigator>
  );
}
