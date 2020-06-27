/**
 * Encapsulates the result of some change of data
 * requested to the server (ie, a delete, update or create request).
 */
export interface IResultResponse<T = any> {
  success: boolean;
  messages?: string[];
  entity?: T;
}
