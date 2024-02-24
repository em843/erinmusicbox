import { Component } from '@angular/core';
import { melodies } from '../melody-catalog/melody-catalog.const';
import { Melody } from 'src/app/interfaces/melody.interface';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
// @Injectable()
export class HomeComponent {
  public featuredMelody: Melody = melodies[0];
}
