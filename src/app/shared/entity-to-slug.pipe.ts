import { Pipe, PipeTransform } from '@angular/core';

import { IHrefEntity } from '@nusantara/models/base';
import { getSlugFromHref } from '@nusantara/core';

/**
 * Given either an object containing an attribute named 'href' or a string,
 * this method will return the final path of the given string.
 *
 * If a slug cannot be parsed from the URL, then an empty string
 * will be returned.
 *
 * @example
 *  'https://bhisma.cloud/api/product/my-product/' -> 'my-product'
 *  {'href': 'https://bhisma.cloud/api/something/else/'} -> 'else'
 */
@Pipe({
  name: 'entityToSlug',
})
export class EntityToSlugPipe implements PipeTransform {
  public transform(value: IHrefEntity|string): string {
    try {
      if (typeof value === 'string') {
        return getSlugFromHref(value) || '';
      } else {
        return getSlugFromHref(value.href) || '';
      }
    } catch (ex) {
      return '';
    }
  }
}
