/**
 * A JWT access token, and an accompanying refresh token.
 * Both strings should be an encoded JWT.
 */
export interface ITokenPair {
  access: string;
  refresh: string;
}
