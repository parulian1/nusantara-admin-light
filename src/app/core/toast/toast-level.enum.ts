/**
 * Determines the 'theme' of a toast message.
 * This will control what accent colors are shown along with
 * the accent icon.
 */
export enum ToastLevelEnum {

  /**
   * Something went wrong.
   */
  error = 'error',

  /**
   * An action was successful (such as a save or delete request to the API)
   */
  success = 'success',

  /**
   * A miscellaneous notification that does not indicate any
   * change of state accepted by the API.
   */
  info = 'info'
}
