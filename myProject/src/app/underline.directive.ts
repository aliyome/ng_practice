import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUnderline]'
})
export class UnderlineDirective implements OnInit {

  constructor(private ref: ElementRef) { }

  ngOnInit() {
    const elem = this.ref.nativeElement as HTMLElement;
    elem.style.textDecoration = 'underline';
  }

}
