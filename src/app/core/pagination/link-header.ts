/**
 * Parses a link header field (<https://example.com>; rel="next"; title="some link").
 * Supports attributes 'title' and 'rel'
 *
 * @remarks
 * See: {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link|HTTP Link Header}
 *
 * @example
 * ```ts
 * const nextPage = new LinkHeaderField('<https://example.com>; rel="next"; title="the next page"')
 * console.log(nextPage.url)
 * ```
 */
export class LinkHeaderField {

  private urlParser = /\<(.+?)\>/ig;
  private titleParser = /title\=['"](.+?)['"]/ig;
  private relParser = /rel\=['"](.+?)['"]/ig;

  public constructor(public rawLink: string) { }

  public get title(): string {
    const r = this.titleParser.exec(this.rawLink);
    return (!!r) ? r[1] : null;
  }

  public get url(): string {
    const r = this.urlParser.exec(this.rawLink);
    return (!!r) ? r[1] : null;
  }

  public get rel(): string {
    const r = this.relParser.exec(this.rawLink);
    return (!!r) ? r[1] : null;
  }
}
