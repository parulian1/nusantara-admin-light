/**
 * Similar to ITokenPair, but contains only an access token.
 * This type of response is to be expected when refreshing
 * access credentials (as opposed to logging in with an email
 * address and password).
 */
export interface IAccessToken {
  access: string;
}
