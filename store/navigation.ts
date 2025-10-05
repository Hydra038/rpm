import { create } from 'zustand';

interface LoadingState {
  isNavigating: boolean;
  setNavigating: (loading: boolean) => void;
}

export const useNavigationStore = create<LoadingState>((set) => ({
  isNavigating: false,
  setNavigating: (loading: boolean) => set({ isNavigating: loading }),
}));