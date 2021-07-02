import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {
  @Input() NumberType: string;
  codes = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Escape: 27,
    Space: 46,
    A: 65,
    C: 67,
    V: 86,
    X: 88,
    Home: 35,
    End: 36,
    Left: 37,
    Right: 38,
    Shift: 16
  };

  constructor(private el: ElementRef) {
    let i = 0;
    for (i = 48; i < 58; i++) {
      this.codes[String.fromCharCode(i - 48)] = i;
    }
    for (i = 65; i < 90; i++) {
      this.codes[String.fromCharCode(i)] = i;
    }
    for (i = 97; i < 123; i++) {
      this.codes[String.fromCharCode(i)] = i - 32;
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const e = event as KeyboardEvent;
    if (
      [8, 9, 13, 27, 46].indexOf(this.codes[e.key]) !== -1 ||
      // Allow: Ctrl+A
      (this.codes[e.key] === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (this.codes[e.key] === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (this.codes[e.key] === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (this.codes[e.key] === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (this.codes[e.key] >= 35 && this.codes[e.key] <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (this.codes[e.key] < 48 || this.codes[e.key] > 57)) &&
      (this.codes[e.key] < 96 || this.codes[e.key] > 105)
    ) {
      e.preventDefault();
    }
    setTimeout(() => {
      this.applyFormat();
    }, 100);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }
  validateFields = (event: any) => {
    setTimeout(() => {
      const numberRegEx = /^[0-9-]+$/;
      if (!numberRegEx.test(this.el.nativeElement.value)) {
        this.el.nativeElement.value = '';
        event.preventDefault();
      }
      this.applyFormat();
    }, 100);
  };
  applyFormat = () => {
    let value = this.el.nativeElement.value;
    value = value
      .replace(/[^\w\s]/g, '')
      .replace('-', '')
      .replace(' ', '');

    if (this.NumberType === 'zipCode') {
      let fragment1 = '';
      let fragment2 = '';
      switch (value.length) {
        case 9:
          this.el.nativeElement.value = '';
          fragment1 = value.slice(0, 5);
          fragment2 = value.slice(5);
          value = fragment1 + '-' + fragment2;
          break;
        default:
          return value;
      }
      this.el.nativeElement.value = value;
    }
    if (this.NumberType === 'phone') {
      let country = '';
      let city = '';
      let phone = '';
      switch (value.length) {
        case 10:
          this.el.nativeElement.value = '';
          country = '';
          city = value.slice(0, 3);
          phone = value.slice(3);
          break;
        default:
          return value;
      }

      phone = phone.slice(0, 3) + '-' + phone.slice(3);
      this.el.nativeElement.value = (
        country +
        ' (' +
        city +
        ') ' +
        phone
      ).trim();
    }
  };
}
