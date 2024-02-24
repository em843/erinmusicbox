import { NgModule } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MelodyCardComponent } from './melody-card/melody-card.component';

@NgModule({
  declarations: [AccordionComponent, MelodyCardComponent],
  imports: [CommonModule, MatExpansionModule],
  exports: [AccordionComponent, MelodyCardComponent],
})
export class ComponentModule {}
