import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';

const SLIDE_IN_FROM_RIGHT_STEPS = [
  query(':enter, :leave',  style({position: 'absolute', width: '100%' }),  {optional: true}),
  group([
    query(':enter', [
        style({opacity: '0', transform: 'translateX(10px)'}),
        animate('.3s ease-in-out', style({opacity: '1', transform: 'translateX(0%)'}))
      ], {optional: true}
    ),
    query(':leave', [style({opacity: '0'}), ], {optional: true}),
  ])
];

const SLIDE_IN_FROM_LEFT_STEPS = [
  query(':enter, :leave',  style({position: 'absolute', width: '100%' }),  {optional: true}),
  group([
    query(':enter', [
        style({opacity: '0', transform: 'translateX(-10px)'}),
        animate('.3s ease-in-out', style({opacity: '1', transform: 'translateX(0%)'}))
      ], {optional: true}
    ),
    query(':leave', [style({opacity: '0'}), ], {optional: true}),
  ])
];

export const slideInAnimation = trigger('routeAnimations', [
  transition('List => Detail', SLIDE_IN_FROM_RIGHT_STEPS),
  transition('Detail => List', SLIDE_IN_FROM_LEFT_STEPS),
]);



