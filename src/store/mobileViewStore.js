import { create } from 'zustand'

const useMobileViewStore = create((set) => ({
  // Mobile view state - 'chat' shows chat panel, 'preview' shows preview panel
  currentView: 'chat',
  
  // Switch to chat view
  showChatView: () => set({ currentView: 'chat' }),
  
  // Switch to preview view  
  showPreviewView: () => set({ currentView: 'preview' }),
  
  // Toggle between views
  toggleView: () => set((state) => ({ 
    currentView: state.currentView === 'chat' ? 'preview' : 'chat' 
  })),
}))

export default useMobileViewStore





