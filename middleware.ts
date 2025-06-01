import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware'; // Necesitarás crear este cliente para middleware
import { ROUTE_PERMISSIONS } from '@/types/auth';
import type { UserRole } from '@/types/auth';

export async function middleware(request: NextRequest) {
  try {
    
    const { supabase, response } = createClient(request);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    

    const { pathname } = request.nextUrl;

    // Lista de rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);


    // Si hay un error al obtener la sesión, permitir la solicitud pero registrar el error
    if (sessionError) {
      console.error('Error al obtener la sesión:', sessionError);
      return isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
    }

    // Si el usuario no está autenticado y no está en una ruta pública
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL('/login', request.url);
      // Guardar la URL original para redireccionar después del login
      if (pathname !== '/') {
        redirectUrl.searchParams.set('redirectTo', pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Si el usuario está autenticado y está intentando acceder a una ruta pública
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Verificar permisos basados en rol si la ruta requiere autenticación
    if (session && !isPublicRoute) {
      const email = session.user.email;
      if (!email) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Mapa de correos a roles
      const roleMap: Record<string, UserRole> = {
        'admin@gmail.com': 'admin',
        'ventas1@gmail.com': 'ventas',
        'inventario@gmail.com': 'inventario'
      };

      const userRole = roleMap[email];
      
      // Verificar si la ruta actual está en las rutas con permisos
      const routePermissions = ROUTE_PERMISSIONS[pathname];
      
      if (routePermissions && !routePermissions.includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Error en middleware:', error);
    // En caso de error, permitir el acceso solo a rutas públicas
    const isPublicRoute = ['/login', '/register', '/forgot-password'].includes(request.nextUrl.pathname);
    return isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - Archivos estáticos
     * - Archivos de API que no necesitan autenticación
     * - Otros recursos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};