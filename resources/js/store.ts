import create from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void,
}
export const useSidebarStore = create<SidebarState>(set => ({
  isOpen: false,
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
