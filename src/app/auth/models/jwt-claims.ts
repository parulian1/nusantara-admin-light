/**
 * The expected format for claims that should be present
 * in JWTs returned from the IAM auth API.
 */
export interface IJwtClaims {
  token_type: string;
  exp: number;
  jti: string;
  user_id: string; // actually username field from db
  is_staff: boolean;
  first_name: string;
  last_name: string;
  email: string;
  iss: string;
  site: string;
  can_use_pos: string;
  identity_number: string;
}
