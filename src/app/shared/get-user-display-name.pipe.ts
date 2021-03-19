import { Pipe, PipeTransform } from '@angular/core';
import {IJwtClaims} from '@nusantara/auth/models';

/**
 * Takes a string in camel-case, and returned a human-readable format.
 *
 * Eg, birthPlace -> Birth Place
 */
@Pipe({
  name: 'getUserDisplayName'
})
export class GetUserDisplayNamePipe implements PipeTransform {
  public transform(tokenPayload: IJwtClaims): string {
     if (!!tokenPayload?.first_name) {
      return tokenPayload.first_name;
    } else if (!!tokenPayload?.last_name) {
      return tokenPayload.last_name;
    } else if (!!tokenPayload?.email) {
      return tokenPayload.email;
    } else {
      // this should more-or-less never occur, but if the user's email address
      // hasn't been set, we're just going to return something.
      return 'User';
    }
  }
}
