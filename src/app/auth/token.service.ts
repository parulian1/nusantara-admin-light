

const TOKEN_KEY = 'token';
const TOKEN_REFRESH_KEY = 'refresh';

export class TokenService {

  get hasToken(): boolean { return false; }
  /* returns true only if the token is still alive */
  get tokenIsValid(): boolean { return false; }
  get userIsStaff(): boolean { return false; }


  get tokenExpiryTime(): Date { return null; }

  /**
   * Returns the date/time that the refresh token will expire.  If there is no
   * refresh token set, then returns Epoch time (numeric 0).
   */
  get refreshTokenExpiryTime(): Date {
    const refreshToken = localStorage.getItem(TOKEN_REFRESH_KEY);
    if (!refreshToken) {
      return new Date(0);
    }

  }


}
