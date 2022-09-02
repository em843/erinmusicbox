import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MidiVisualizerModule } from './components/midi-visualizer/midi-visualizer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MidiVisualizerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
