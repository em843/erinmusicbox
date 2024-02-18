import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { MidiVisualizerComponent } from './pages/midi-visualizer/midi-visualizer.component';
import { MelodyCatalogComponent } from './pages/melody-catalog/melody-catalog.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'melody-catalog', component: MelodyCatalogComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'midi-visualizer', component: MidiVisualizerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
