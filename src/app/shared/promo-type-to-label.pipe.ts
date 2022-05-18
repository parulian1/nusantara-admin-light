import { Pipe, PipeTransform } from '@angular/core';
import { getPromoTypeLabel } from '@nusantara/core';

@Pipe({
  name: 'promoTypeToLabel',
})
export class PromoTypeToLabelPipe implements PipeTransform {
  public transform(value: string): string {
    return getPromoTypeLabel(value) || '';
  }
}
