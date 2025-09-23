/**
 * Centralized Navigation Service
 * Handles all navigation logic consistently using React Router
 */
class NavigationService {
  constructor() {
    this.navigator = null;
    this.location = null;
  }

  // Initialize with React Router hooks
  init(navigator, location) {
    this.navigator = navigator;
    this.location = location;
  }

  // Get current path
  getCurrentPath() {
    return this.location?.pathname || window.location.pathname;
  }

  // Check if current route is protected
  isProtectedRoute(path = null) {
    const currentPath = path || this.getCurrentPath();
    const protectedRoutes = ['/chat', '/tailwind-test', '/react-live-check'];
    return protectedRoutes.some(route => currentPath.startsWith(route));
  }

  // Check if current route is public
  isPublicRoute(path = null) {
    const currentPath = path || this.getCurrentPath();
    const publicRoutes = ['/', '/login', '/signup'];
    return publicRoutes.includes(currentPath);
  }

  // Check if current route is auth page
  isAuthRoute(path = null) {
    const currentPath = path || this.getCurrentPath();
    return currentPath === '/login' || currentPath === '/signup';
  }

  // Navigate to login
  goToLogin(replace = true) {
    if (this.navigator) {
      this.navigator('/login', { replace });
    } else {
      window.location.href = '/login';
    }
  }

  // Navigate to home
  goToHome(replace = true) {
    if (this.navigator) {
      this.navigator('/', { replace });
    } else {
      window.location.href = '/';
    }
  }

  // Navigate to main app (chat)
  goToApp(replace = true) {
    if (this.navigator) {
      this.navigator('/chat', { replace });
    } else {
      window.location.href = '/chat';
    }
  }

  // Navigate to specific route
  navigateTo(path, replace = false) {
    if (this.navigator) {
      this.navigator(path, { replace });
    } else {
      window.location.href = path;
    }
  }

  // Smart navigation based on auth state
  handleAuthNavigation(isAuthenticated, intendedPath = null) {
    const currentPath = intendedPath || this.getCurrentPath();
    
    if (isAuthenticated) {
      // User is authenticated
      if (this.isAuthRoute(currentPath)) {
        // On login/signup page, redirect to app
        this.goToApp(true);
      }
      // Otherwise, stay where they are
    } else {
      // User is not authenticated
      if (this.isProtectedRoute(currentPath)) {
        // On protected route, redirect to login
        this.goToLogin(true);
      }
      // Otherwise, stay where they are (public routes)
    }
  }

  // Get redirect path after login
  getPostLoginPath() {
    const currentPath = this.getCurrentPath();
    
    if (this.isProtectedRoute(currentPath)) {
      // If user was trying to access protected route, stay there
      return currentPath;
    } else {
      // Otherwise, go to main app
      return '/chat';
    }
  }
}

// Create singleton instance
const navigationService = new NavigationService();

export default navigationService;

















