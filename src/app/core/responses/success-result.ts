import { IResultResponse } from './result-response';

/**
 * Returned when some operation is successful, and doesn't otherwise
 * have a response which should be shown.
 */
export class SuccessResult<T = any> implements IResultResponse<T> {
  success = true;
  constructor(public messages?: string[], public entity?: T) { }
}
