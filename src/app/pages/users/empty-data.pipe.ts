import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyData'
})
export class EmptyDataPipe implements PipeTransform {

  transform(value: unknown, defaultValue: string = '<empty>'): any {
    return value ?? defaultValue;
  }
}
