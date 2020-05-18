import { IResultResponse } from './result-response';
import { HttpStatusCode } from '@nusantara/core/http';

/**
 * Returned when some operation fails (like updating/creating/deleting an object)
 */
export class ErrorResult<T> implements IResultResponse {
  readonly success = false;
  constructor(public readonly errorDetails?: T,
              public readonly statusCode?: HttpStatusCode) { }
}
