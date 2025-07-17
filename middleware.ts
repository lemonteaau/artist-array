import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. running next-intl middleware first
  const handleI18nRouting = createIntlMiddleware(routing);
  const response = handleI18nRouting(request);

  // 2. pass the i18n processed response to the supabase middleware
  return await updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|trpc|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
