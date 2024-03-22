import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MidiVisualizerModule } from './pages/midi-visualizer/midi-visualizer.module';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentModule } from './components/component.module';
import { MelodyCatalogComponent } from './pages/melody-catalog/melody-catalog.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './pages/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { AudioPlaybackService } from './services/audio-playback.service';
import { QuizService } from './services/quiz.service';
import { QuizComponent } from './pages/quiz/quiz.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  providers: [AudioPlaybackService, QuizService],
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BlogComponent,
    MelodyCatalogComponent,
    FooterComponent,
    AboutComponent,
    QuizComponent,
  ],
  imports: [
    BrowserModule,
    MidiVisualizerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentModule,
    FormsModule,
    MatInputModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
