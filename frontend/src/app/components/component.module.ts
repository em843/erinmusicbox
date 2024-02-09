import { NgModule } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AccordionComponent],
  imports: [CommonModule],
  exports: [AccordionComponent],
})
export class ComponentModule {}
