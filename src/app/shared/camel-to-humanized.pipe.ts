import { Pipe, PipeTransform } from '@angular/core';

/**
 * Takes a string in camel-case, and returned a human-readable format.
 *
 * Eg, birthPlace -> Birth Place
 */
@Pipe({
  name: 'camelToHumanized'
})
export class CamelToHumanizedPipe implements PipeTransform {
  public transform(value: string): string {
    const words = value.match(/[A-Za-z][a-z]+/g);
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }
}
