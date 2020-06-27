import { SuccessResult } from './success-result';

export class SuccessCreatedResult<T = any> extends SuccessResult<T> {
  constructor(public href: string, messages?: string[], public entity?: T) {
    super(messages, entity);
  }
}
