import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { MidiVisualizerComponent } from './components/midi-visualizer/midi-visualizer.component';
import { MelodyCatalogComponent } from './components/melody-catalog/melody-catalog.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'melody-catalog', component: MelodyCatalogComponent },
  { path: 'blog', component: BlogComponent },
  { path: '', component: MidiVisualizerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
