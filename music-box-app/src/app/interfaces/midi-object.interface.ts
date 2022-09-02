import { MidiTrack } from './midi-track.interface';

export interface MidiObject {
  track: MidiTrack[];
  formatType?: number;
  timeDivision: number;
  tracks: number;
}
