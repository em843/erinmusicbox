import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MidiVisualizerComponent } from './midi-visualizer.component';

@NgModule({
  declarations: [MidiVisualizerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [MidiVisualizerComponent],
  exports: [MidiVisualizerComponent],
})
export class MidiVisualizerModule {}
