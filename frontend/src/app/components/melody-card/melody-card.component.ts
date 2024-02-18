import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-melody-card',
  templateUrl: './melody-card.component.html',
  // styleUrls: ['./app-melody-card.component.css'] // Optional if you have specific styles
})
export class MelodyCardComponent {
  @Input() melody: any; // Assuming melody has 'title', 'description', and 'url'

  playMelody(url: string) {
    // Logic to play melody
    console.log('Playing melody:', url);
    // You could extend this method to use Angular's HttpClient to fetch and play the melody, or manipulate an <audio> tag directly.
  }
}
