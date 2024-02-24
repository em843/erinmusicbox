import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioPlaybackService {
  public currentAudio: HTMLAudioElement | null = null;
  public onAudioChange: EventEmitter<void> = new EventEmitter();

  playAudio(newAudio: HTMLAudioElement): Promise<void> {
    if (this.currentAudio && this.currentAudio !== newAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentAudio = newAudio;
    this.onAudioChange.emit(); // Notify all listeners that a new audio is playing

    return newAudio.play();
  }
}
