import { IResultResponse } from './result-response';
import { HttpStatusCode } from '@nusantara/core/http';

/**
 * Returned when some operation fails (like updating/creating/deleting an object)
 */
export class ErrorResult<TError, TEntity = any> implements IResultResponse<TEntity> {
  readonly success = false;
  constructor(public readonly errorDetails?: TError,
              public readonly statusCode?: HttpStatusCode) { }
}
