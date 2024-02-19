import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AudioPlaybackService } from '../../services/audio-playback.service'; // Adjust the path as needed
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-melody-card',
  templateUrl: './melody-card.component.html',
  // styleUrls: ['./app-melody-card.component.css'] // Optional if you have specific styles
})
export class MelodyCardComponent implements OnInit, OnDestroy {
  @Input() melody: any; // Assuming melody has 'title', 'description', and 'url'
  isPlaying = false; // Track playback state
  audioPromise: Promise<void> | undefined; // To handle play() promise
  private audioChangeSub!: Subscription;

  constructor(private audioPlaybackService: AudioPlaybackService) {}

  ngOnInit(): void {
    // Subscribe to audio change events
    this.audioChangeSub = this.audioPlaybackService.onAudioChange.subscribe(
      () => {
        // If this card's audio is not the currently playing audio, set isPlaying to false
        if (this.audioPlaybackService.currentAudio !== this.melody.url) {
          this.isPlaying = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.audioChangeSub.unsubscribe();
  }

  toggleAudioPlayback(audioElement: HTMLAudioElement): void {
    if (!audioElement) return; // Guard clause

    if (this.isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset audio to the start
      this.isPlaying = false;
    } else {
      this.audioPromise = this.audioPlaybackService.playAudio(audioElement);
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
