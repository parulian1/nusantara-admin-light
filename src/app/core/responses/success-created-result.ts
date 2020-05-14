import { SuccessResult } from './success-result';

export class SuccessCreatedResult extends SuccessResult {
  constructor(public href: string, messages?: string[]) {
    super(messages);
  }
}
