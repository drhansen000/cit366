import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[cmsDropdown]'
})
export class DropdownDirective {
  @HostBinding("class.open") isOpen = false;

  @HostListener("click") toggleOpen() {
    this.isOpen = true;
  }

  @HostListener("mouseleave") toggleClose() {
    this.isOpen = false;
  }

  constructor() { }

}
