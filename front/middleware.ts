import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    const backendPath = path.replace(/^\/api/, "");
    const backendUrl = process.env.BACKEND_URL || "https://medical-octopus-lauramussa-f33629ba.koyeb.app";
    const targetUrl = `${backendUrl}${backendPath}${request.nextUrl.search}`;


    try {
      const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        // @ts-ignore
        duplex: 'half', 
      });
      return backendResponse;
    } catch (error) {
      return NextResponse.json({ error: "Backend Connection Failed" }, { status: 502 });
    }
  }

  const token = request.cookies.get("access_token")?.value;

  // Redirige si ya está logueado e intenta ir a login/register
  const authRoutes = ["/login", "/register"];
  if (authRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas 
  const protectedPrefixes = [
    "/analytics", 
    "/categories", 
    "/customers", 
    "/products", 
    "/sales"
  ];

  const isProtectedRoute = path === "/" || protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|.*\\.svg).*)"],
};
