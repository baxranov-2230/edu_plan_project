import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLayoutStore = create(
    persist(
        (set) => ({
            sidebarOpen: true,
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
        }),
        {
            name: 'layout-storage',
        }
    )
);

export default useLayoutStore;
