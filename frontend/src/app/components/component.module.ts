import { NgModule } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [AccordionComponent],
  imports: [CommonModule, MatExpansionModule],
  exports: [AccordionComponent],
})
export class ComponentModule {}
