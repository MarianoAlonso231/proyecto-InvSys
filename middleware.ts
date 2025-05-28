import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware'; // Necesitarás crear este cliente para middleware

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refrescar la sesión si ha expirado - importante para SSR/Middleware
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Si el usuario no está autenticado y no está en la página de login, redirigir a login
  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // O tu página principal post-login
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las siguientes:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - Rutas que ya son públicas (ej. /api/auth, /login)
     * Siente la libertad de modificar esto según tus necesidades.
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)',
  ],
};