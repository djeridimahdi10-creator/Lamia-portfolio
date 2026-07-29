import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match root / and locale prefixes
    "/",
    "/(fr|en)/:path*",
    // Match all pathnames except static files / api
    "/((?!_next|_vercel|.*\\..*).*)"
  ],
};
