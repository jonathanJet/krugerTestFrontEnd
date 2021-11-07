import { NgModule } from '@angular/core';
import { ValidadorNumerosDirective, ValidadorLetrasDirective } from './validador.directive';

@NgModule({
  declarations: [ValidadorLetrasDirective, ValidadorNumerosDirective],
  exports: [ValidadorLetrasDirective, ValidadorNumerosDirective],
})
export class ValidadoresModule {}
