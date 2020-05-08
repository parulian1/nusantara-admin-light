
import {getSlugFromHref} from './helpers';
import { Pipe, PipeTransform } from '@angular/core';


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
