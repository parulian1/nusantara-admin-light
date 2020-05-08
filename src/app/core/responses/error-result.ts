import { IResultResponse } from './result-response';

/**
 * Returned when some operation fails (like updating/creating/deleting an object)
 */
export class ErrorResult implements IResultResponse {
  success = false;
  constructor(public messages?: string[]) { }
}
