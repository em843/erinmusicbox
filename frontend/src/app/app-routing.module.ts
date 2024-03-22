import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { MidiVisualizerComponent } from './pages/midi-visualizer/midi-visualizer.component';
import { MelodyCatalogComponent } from './pages/melody-catalog/melody-catalog.component';
import { AboutComponent } from './pages/about/about.component';
import { QuizComponent } from './pages/quiz/quiz.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'melody-catalog', component: MelodyCatalogComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'midi-visualizer', component: MidiVisualizerComponent },
  { path: 'about', component: AboutComponent },
  { path: 'quiz', component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
