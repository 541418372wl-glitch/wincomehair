// Production can serve both /route and /route/. Keep the existing canonical
// policy (only the home page ends in a slash) in server and client metadata.
export function canonicalPath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}
