import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  if (path.startsWith("/session")) {
    const tableId = searchParams.get("table_id");
    if (!tableId || !uuidRegex.test(tableId)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (path.startsWith("/menu")) {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || !uuidRegex.test(sessionId)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (path.startsWith("/invoice")) {
    const orderId = searchParams.get("order_id");
    if (!orderId || !uuidRegex.test(orderId)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (
    path.startsWith("/api/restaurant") &&
    process.env.NODE_ENV === "production"
  ) {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
      return new NextResponse("Access denied", { status: 403 });
    }
  }

  const restrictedWithoutParam = ["/api/session", "/api/menu", "/api/invoice"];
  for (const basePath of restrictedWithoutParam) {
    if (path === basePath || path === `${basePath}/`) {
      return new NextResponse(`Missing required parameter in ${basePath}`, {
        status: 403,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/session/:path*",
    "/menu/:path*",
    "/invoice/:path*",
    "/api/:path*",
  ],
};
