import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[validador][numeros]',
})
export class ValidadorNumerosDirective {
  @HostListener('keypress', ['$event']) onKeyPress(e: any) {
    const exp = /^[0-9]*$/;
    if (!exp.test(String.fromCharCode(e.charCode))) {
      e.preventDefault();
    }
  }
}

@Directive({
  selector: '[validador][letras]',
})
export class ValidadorLetrasDirective {
  @HostListener('keypress', ['$event']) onKeyPress(e: any) {
    const key = e.keyCode;
    if (key < 97 || key > 122) {
      if (key < 65 || key > 91) {
        e.preventDefault();
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
