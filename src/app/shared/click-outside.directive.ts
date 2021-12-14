import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[nusClickOutside]'
})
export class ClickOutsideDirective {

  @Output()
  public nusClickOutside = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {

    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.nusClickOutside.emit(event);
    }
  }

}
