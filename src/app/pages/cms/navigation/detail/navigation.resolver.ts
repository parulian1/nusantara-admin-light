import {Injectable} from '@angular/core';
import {AbstractDetailResolver} from '../../../../core/resolvers';
import {INavigation} from '../../../../models';
import {NavigationService} from '../../../../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationResolver extends AbstractDetailResolver<INavigation> {
  constructor(service: NavigationService) {
    super(service);
  }
}
