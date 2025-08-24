import { create } from 'zustand';

const useSessionComponentStore = create((set) => ({
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
  
  // Restore component from message
  restoreComponentFromMessage: (messageId) => {
    const state = useSessionComponentStore.getState();
    // Find the component that was generated from this message
    const componentToRestore = state.components.find(comp => 
      comp.metadata?.generatedFrom === messageId || 
      comp.metadata?.conversationId === messageId
    );
    
    if (componentToRestore) {
      useSessionComponentStore.setState({
        currentComponent: componentToRestore,
        components: state.components.map(comp => ({
          ...comp,
          isCurrent: comp.id === componentToRestore.id
        }))
      });
      return componentToRestore;
    }
    
    return null;
  },
}));

export default useSessionComponentStore;
