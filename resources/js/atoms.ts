import {atom, selector} from 'recoil';
import {FolderDownloadIcon, HomeIcon, TagIcon} from '@heroicons/react/solid';
import route from 'ziggy-js';

type NavigationRouteProps =
  | 'Home'
  | 'Products'
  | 'Orders'
  | 'Customers'
  | 'Analytics';

type NavigationState = {
  name: NavigationRouteProps;
  icon: any;
  current: boolean;
  href: string;
  expanded?: boolean;
  children?: {
    name: string;
    href: string;
  }[];
}[];

type SidebarStateProp = boolean;

export const sidebarState = atom<SidebarStateProp>({
  key: 'sidebarState',
  default: false,
});

export const darkModeState = atom<boolean>({
  key: 'darkModeState',
  default: false,
});

export const navigationState = atom<NavigationState>({
  key: 'navigationState',
  default: [
    {
      name: 'Home',
      icon: HomeIcon,
      current: true,
      href: route('lshopify.home'),
      expanded: false,
    },

    {
      name: 'Products',
      icon: TagIcon,
      current: false,
      href: '#',
      children: [
        {name: 'All Products', href: route('lshopify.products.index')},
        // {name: 'Inventory', href: '#'},
        // {name: 'Transfers', href: '#'},
        {name: 'Collections', href: route('lshopify.collections.index')},
        // {name: 'Gift cards', href: '#'},
      ],
    },
    {
      name: 'Orders',
      icon: FolderDownloadIcon,
      current: false,
      href: '',
      children: [
        {name: 'Orders', href: route('lshopify.orders.index')},
        {name: 'Drafts', href: route('lshopify.orders.draft.index')},
        // {name: 'Abandoned Checkouts', href: '#'},
      ],
    },
    // {
    //   name: 'Customers',
    //   icon: UserIcon,
    //   current: false,
    //   href: '#',
    //   expanded: false,
    // },
    // {
    //   name: 'Analytics',
    //   icon: ChartBarIcon,
    //   current: false,
    //   href: '#',
    //   children: [
    //     {name: 'Overview', href: '#'},
    //     {name: 'Members', href: '#'},
    //     {name: 'Calendar', href: '#'},
    //     {name: 'Settings', href: '#'},
    //   ],
    // },
  ],
});

export const navigationActiveState = atom<NavigationRouteProps>({
  key: 'navigationActiveState',
  default: 'Home',
});

export const filteredNavigationState = selector({
  key: 'filteredNavigationState',
  get: ({get}) => {
    const active = get(navigationActiveState);
    const list = get(navigationState);
    return list.map(nav => {
      const current = nav.name === active;
      return {
        ...nav,
        current: current,
      };
    });
  },
});
