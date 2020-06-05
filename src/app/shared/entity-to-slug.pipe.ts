import { Pipe, PipeTransform } from '@angular/core';

import { getSlugFromHref } from './helpers';

@Pipe({
  name: 'entityToSlug',
})
export class EntityToSlugPipe implements PipeTransform {
  public transform(value: { href: string }): string {
    try {
      return getSlugFromHref(value.href) || '';
    } catch (ex) {
      return '';
    }
  }
}
