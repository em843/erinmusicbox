import { MidiEvent } from './midi-event.interface';

export interface MidiTrack {
  // [index: number]: MidiEvent;
  event: MidiEvent[];
}
