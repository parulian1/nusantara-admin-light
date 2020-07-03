/**
 * The response body expected back for an HTTP OPTIONS request
 */
export interface IOptionsResponse {
  name: string;
  description: string;
  renders: string[];
  parses: string[];
  actions: {
    GET: object;
    POST: object;
    PUT: object;
  };
}
