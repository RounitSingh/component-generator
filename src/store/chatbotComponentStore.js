import { create } from 'zustand';

const useChatbotComponentStore = create((set, get) => ({
  components: [],
  currentComponent: null,
  isLoading: false,
  error: null,
  
  // Edit mode state with enhanced structure
  editMode: false,
  selectedElement: null,
  elementSelectionHistory: [], // Track selection history for better UX
  editModeError: null,
  isElementSelectionValid: true, // Track if selected element is still valid
  
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
  
  // Enhanced edit mode actions
  setEditMode: (editMode) => set((state) => ({ 
    editMode,
    // Clear selection when toggling OFF so the badge/selection is removed
    selectedElement: editMode ? state.selectedElement : null,
    isElementSelectionValid: editMode ? state.isElementSelectionValid : false,
    editModeError: null,
  })),
  
  setSelectedElement: (selectedElement) => set((state) => ({
    selectedElement,
    isElementSelectionValid: true,
    editModeError: null,
    elementSelectionHistory: selectedElement && selectedElement !== state.selectedElement 
      ? [...state.elementSelectionHistory.slice(-4), selectedElement]
      : state.elementSelectionHistory
  })),
  
  clearSelectedElement: () => set({
    selectedElement: null,
    isElementSelectionValid: false,
    editModeError: null
  }),
  
  // Element validation and recovery (non-noisy)
  validateSelectedElement: () => {
    const state = get();
    if (!state.selectedElement?.element) {
      set({ isElementSelectionValid: false });
      return false;
    }
    if (!document.contains(state.selectedElement.element)) {
      set({ isElementSelectionValid: false });
      return false;
    }
    return true;
  },
  
  // Element recovery from history
  recoverElementFromHistory: (index = -1) => {
    const state = get();
    const history = state.elementSelectionHistory;
    if (history.length > 0) {
      const elementToRecover = history[history.length + index];
      if (elementToRecover) {
        set({ 
          selectedElement: elementToRecover,
          isElementSelectionValid: true,
          editModeError: null
        });
        return elementToRecover;
      }
    }
    return null;
  },
  
  // Set edit mode error
  setEditModeError: (error) => set({ editModeError: error }),
  
  // Reset store
  reset: () => set({ 
    components: [], 
    currentComponent: null, 
    isLoading: false, 
    error: null,
    editMode: false,
    selectedElement: null,
    elementSelectionHistory: [],
    editModeError: null,
    isElementSelectionValid: true
  }),
  
  // Restore component from message
  restoreComponentFromMessage: (messageId) => {
    const state = get();
    const componentToRestore = state.components.find(comp => 
      comp.metadata?.generatedFrom === messageId || 
      comp.metadata?.conversationId === messageId
    );
    
    if (componentToRestore) {
      set({
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

export default useChatbotComponentStore;
