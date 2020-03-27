import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Directive } from '@angular/core';

export const fadeInRightAnimation = trigger('fadeInRight', [
  transition(':enter', [
    style({
      transform: 'translateX(-2vw)',
      opacity: 0
    }),
    animate('0.4s cubic-bezier(0.35, 0, 0.25, 1)', style({
      transform: 'translateX(0)',
      opacity: 1
    }))
  ])
]);

export function fadeInRightStaggerAnimation(delay: number = 100) {
  return trigger('fadeInRightStagger', [
    transition('* => *', [ // each time the binding value changes
      query('[fadeInRightStaggerElement]', [
        style({
          transform: 'translateX(-2vw)',
          opacity: 0
        }),
        stagger(delay, [
          animate('0.4s cubic-bezier(0.35, 0, 0.25, 1)', style({
            transform: 'translateX(0)',
            opacity: 1
          }))
        ])
      ], { optional: true })
    ])
  ]);
}

@Directive({
  selector: '[fadeInRightStaggerElement]'
})
export class FadeInRightStaggerElementDirective {
}
