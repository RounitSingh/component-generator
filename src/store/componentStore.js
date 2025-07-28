import { create } from 'zustand';

const useComponentStore = create((set) => ({
  components: [],
  setComponents: (components) => set({ components }),
  addComponent: (component) => set((state) => ({ components: [...state.components, component] })),
}));

export default useComponentStore; 