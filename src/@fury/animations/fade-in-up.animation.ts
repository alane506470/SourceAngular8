import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Directive } from '@angular/core';

export const fadeInUpAnimation = trigger('fadeInUp', [
  transition(':enter', [
    style({
      transform: 'translateY(3vh)',
      opacity: 0
    }),
    animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({
      transform: 'translateY(0)',
      opacity: 1
    }))
  ])
]);

export const fadeInUpStaggerAnimation = trigger('fadeInUpStagger', [
  transition('* => *', [ // each time the binding value changes
    query('[fadeInUpStaggerElement]', [
      style({
        transform: 'translateY(5vh)',
        opacity: 0
      }),
      stagger(100, [
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ])
    ], { optional: true })
  ])
]);

@Directive({
  selector: '[fadeInUpStaggerElement]'
})
export class FadeInUpStaggerElementDirective {
}
