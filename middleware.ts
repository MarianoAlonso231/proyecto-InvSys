import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware'; // Necesitarás crear este cliente para middleware

export async function middleware(request: NextRequest) {
  try {
    console.log('🔍 Middleware ejecutándose en ruta:', request.nextUrl.pathname);
    
    const { supabase, response } = createClient(request);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    
    console.log('📍 Estado de sesión:', {
      tieneSession: !!session,
      error: sessionError ? 'Error al obtener sesión' : null,
      userId: session?.user?.id,
    });

    const { pathname } = request.nextUrl;

    // Lista de rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    console.log('🛣️ Información de ruta:', {
      pathname,
      isPublicRoute,
      cookiesExist: request.cookies.getAll().length > 0
    });

    // Si hay un error al obtener la sesión, permitir la solicitud pero registrar el error
    if (sessionError) {
      console.error('Error al obtener la sesión:', sessionError);
      return isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
    }

    // Si el usuario no está autenticado y no está en una ruta pública
    if (!session && !isPublicRoute) {
      console.log('🚫 Usuario no autenticado, redirigiendo a login');
      const redirectUrl = new URL('/login', request.url);
      // Guardar la URL original para redireccionar después del login
      if (pathname !== '/') {
        redirectUrl.searchParams.set('redirectTo', pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Si el usuario está autenticado y está intentando acceder a una ruta pública
    if (session && isPublicRoute) {
      console.log('✅ Usuario autenticado intentando acceder a ruta pública, redirigiendo a dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('✨ Permitiendo acceso a la ruta');
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