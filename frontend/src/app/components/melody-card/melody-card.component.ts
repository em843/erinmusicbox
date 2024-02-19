import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-melody-card',
  templateUrl: './melody-card.component.html',
  // styleUrls: ['./app-melody-card.component.css'] // Optional if you have specific styles
})
export class MelodyCardComponent {
  @Input() melody: any; // Assuming melody has 'title', 'description', and 'url'
  isPlaying = false; // Track playback state
  audioPromise: Promise<void> | undefined; // To handle play() promise

  toggleAudioPlayback(audioElement: HTMLAudioElement): void {
    if (!audioElement) return; // Guard clause

    if (this.isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset audio to the start
      this.isPlaying = false;
    } else {
      this.audioPromise = audioElement.play();
      this.audioPromise
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error('Playback failed:', error);
          this.isPlaying = false;
        });
    }
  }

  audioEnded(): void {
    this.isPlaying = false; // Reset playback state when audio ends
  }
}
