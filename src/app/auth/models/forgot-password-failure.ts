/**
 * Description of why the user failed to authenticate (returned from IAM auth API)
 */
export interface IForgotPasswordFailure {
  detail?: string;
  email?: string[];
}
