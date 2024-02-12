import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MidiVisualizerComponent } from './midi-visualizer.component';
import { ComponentModule } from '../../components/component.module'; // Adjust the import path as necessary

@NgModule({
  declarations: [MidiVisualizerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ComponentModule],
  exports: [MidiVisualizerComponent],
})
export class MidiVisualizerModule {}
