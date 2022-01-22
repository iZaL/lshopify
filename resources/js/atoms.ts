import {atom} from 'recoil';

type SidebarStateProp = boolean;

export const sidebarState = atom<SidebarStateProp>({
  key: 'sidebarState',
  default: false,
});

export const darkModeState = atom<boolean>({
  key: 'darkModeState',
  default: false,
});
