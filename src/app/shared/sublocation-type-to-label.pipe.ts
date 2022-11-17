import {Pipe, PipeTransform} from "@angular/core";
import {getSubLocationTypeLabel} from "@nusantara/core/helpers/sublocation-type-label";

@Pipe({
  name: 'sublocationTypeToLabel'
})
export class SublocationTypeToLabelPipe implements PipeTransform {
  public transform(value: string): string {
    return getSubLocationTypeLabel(value) || '';
  }
}
