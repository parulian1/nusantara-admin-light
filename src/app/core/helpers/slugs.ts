export function getSlugFromHref(href: string): string {
  const r = /^.+\/(.+?)\/$/.exec(href);
  if (r) {
    return r[1];
  }
  return null;
}
