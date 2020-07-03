/**
 * The current 'state' of a toast message.
 */
export enum Status {
  /**
   * A new message that has not yet been displayed.
   */
  adding = 'adding',

  /**
   * A message that is currently being displayed to the user.
   */
  active = 'active',

  /**
   * A message that is about to be removed.
   */
  removing = 'removing',

  /**
   * A message that has been removed from display.
   */
  removed = 'removed'
}
