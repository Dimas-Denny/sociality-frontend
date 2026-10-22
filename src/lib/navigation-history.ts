let lastPathname: string | null = null;
let visitedPages = 0;

export function recordPageVisit(pathname: string) {
  if (pathname === lastPathname) return;
  lastPathname = pathname;
  visitedPages += 1;
}

export const canGoBackInApp = () => visitedPages > 1;
