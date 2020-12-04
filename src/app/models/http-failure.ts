/**
 * Description of why the user failed to do some http process
 */
export interface IHttpFailure {
  detail?: string;
  nonFieldErrors?: string[];
}
