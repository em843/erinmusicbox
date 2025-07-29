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
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GtagModule } from 'angular-gtag';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BlogComponent,
    MelodyCatalogComponent,
    FooterComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    MidiVisualizerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentModule,
    FormsModule,
    GtagModule.forRoot({
      trackingId: 'G-XNQFBDS3WF',
      trackPageviews: true,
    }),
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppModule {}
