import { create } from 'zustand';

const useComponentStore = create((set) => ({
  components: [],
 currentComponent: null,
  isLoading: false,
  error: null,
  
  // Component actions
  setComponents: (components) => set({ components }),
  addComponent: (component) => set((state) => ({ 
    components: [...state.components, { ...component, id: Date.now() }] 
  })),
  updateComponent: (id, updates) => set((state) => ({
    components: state.components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    )
  })),
  removeComponent: (id) => set((state) => ({
    components: state.components.filter(comp => comp.id !== id)
  })),
  clearComponents: () => set({ components: [] }),
  
  // Current component actions
  setCurrentComponent: (component) => set({ currentComponent: component }),
  clearCurrentComponent: () => set({ currentComponent: null }),
  
  // Loading and error states
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Reset store
  reset: () => set({ 
    components: [], 
    currentComponent: null, 
    isLoading: false, 
    error: null 
  }),
}));

export default useComponentStore; 