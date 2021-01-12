export function getLastUrlString(url: string) {
  return url.substring(url.lastIndexOf('/') + 1);
}
