import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  // transition('List <=> Detail', [
  transition('* <=> *', [
    query(':enter, :leave',  style({position: 'absolute', top: '80px', width: '100%' }),  {optional: true}),
    group([
      query(':enter', [style({opacity: '0'}), animate('0.3s 0.2s ease-in-out',  style({opacity: '1'})) ], {optional: true}),
      query(':leave', [style({opacity: '1'}), animate('0.2s ease-in-out', style({opacity: '0'}))], {optional: true}),
    ])
  ]),
]);
