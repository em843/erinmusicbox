import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MidiVisualizerModule } from './pages/midi-visualizer/midi-visualizer.module';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, BlogComponent],
  imports: [BrowserModule, MidiVisualizerModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
