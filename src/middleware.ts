import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Crear cliente de Supabase para el middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar si hay una sesión activa
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/registro', '/recuperar-password'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Si no hay sesión y la ruta no es pública, redirigir al login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y la ruta es pública, redirigir al dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Configurar las rutas que deben ser manejadas por el middleware
export const config = {
  matcher: [
    /*
     * Excluir archivos estáticos y API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
