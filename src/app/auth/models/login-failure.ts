/**
 * Description of why the user failed to authenticate (returned from IAM auth API)
 */
export interface ILoginFailure {
  detail?: string;
  email?: string[];
  password?: string[];
  nonFieldErrors?: string[];
}
