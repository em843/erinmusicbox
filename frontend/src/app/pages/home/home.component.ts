import { Component } from '@angular/core';
import { melodies } from '../melody-catalog/melody-catalog.const';
import { Melody } from 'src/app/interfaces/melody.interface';
import { socialLinks } from 'src/app/const/links.const';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
// @Injectable()
export class HomeComponent {
  constructor(private gtag: Gtag) {
    this.gtag.event('screen_view', {
      app_name: 'erinmusicbox',
      screen_name: 'Home',
    });
  }
  public featuredMelody: Melody = melodies[0];
  socialLinks = socialLinks;
}
