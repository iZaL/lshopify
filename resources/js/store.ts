import create from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
}

interface ThemeState {
  theme: string;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>(set => ({
  isOpen: false,
  toggle: () => set(state => ({isOpen: !state.isOpen})),
}));

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'light',
  toggle: () =>
    set(state => ({theme: state.theme === 'light' ? 'dark' : 'light'})),
}));
