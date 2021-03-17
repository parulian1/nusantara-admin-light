import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderTypePipe'
})
export class OrderType implements PipeTransform {

  transform(value: string): string {
    let transWords = '';

    if (value === 'receiving_order') {
      transWords = 'Delivery';
    } else if (value === 'adjustment_order') {
      transWords = 'Adjustment';
    } else if (value === 'transfer_order') {
      transWords = 'Transfer';
    } else if (value === 'sales_order') {
      transWords = 'Sale';
    } else {
      transWords = value;
    }

    return transWords;
  }

}
