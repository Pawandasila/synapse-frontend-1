import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route configurations
const publicRoutes = ['/auth/login', '/auth/signup', '/'];
const protectedRoutes = ['/dashboard'];
const roleBasedRoutes = {
  organizer: ['/dashboard/organizer'],
  judge: ['/dashboard/judge'],
  participant: ['/dashboard']
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth data from cookies
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value as 'participant' | 'organizer' | 'judge';
  
  // Check if user is authenticated
  const isAuthenticated = !!token;
  
  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    // If authenticated user tries to access login/signup, redirect to dashboard
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      const redirectPath = getDefaultRedirectPath(userRole);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Check role-based access
    if (userRole && pathname !== '/dashboard') {
      const hasAccess = checkRoleAccess(userRole, pathname);
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = getDefaultRedirectPath(userRole);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }
  
  return NextResponse.next();
}

// Helper function to check role-based access
function checkRoleAccess(role: 'participant' | 'organizer' | 'judge', pathname: string): boolean {
  const allowedRoutes = roleBasedRoutes[role] || [];
  return allowedRoutes.some(route => pathname.startsWith(route)) || pathname === '/dashboard';
}

// Helper function to get default redirect path based on role
function getDefaultRedirectPath(role?: 'participant' | 'organizer' | 'judge'): string {
  if (!role) return '/dashboard';
  
  switch (role) {
    case 'organizer':
      return '/dashboard/organizer';
    case 'judge':
      return '/dashboard/judge';
    case 'participant':
    default:
      return '/dashboard';
  }
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
