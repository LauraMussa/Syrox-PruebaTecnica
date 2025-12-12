import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    
     const path = request.nextUrl.pathname;
     const token = request.cookies.get('auth-token')?.value;

  // Rutas publicas AUTH
  const authRoutes = ["/login", "/register"];

  if (authRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url)); 
    }
    return NextResponse.next();
  }

  //Rutas protegidas ADMIN
  const protectedPrefixes = [
    '/analytics',
    '/categories',
    '/customers',
    '/products',
    '/sales',
    '/'
  ];

  const isProtectedRoute = protectedPrefixes.some(prefix => path.startsWith(prefix));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.svg).*)"],
};
