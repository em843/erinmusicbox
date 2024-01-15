import { MidiEventData } from './midi-event-data.interface';

export interface MidiEvent {
  //   [index: number]: MidiEventData;
  data?: number | number[] | string;
  channel?: number;
  deltaTime: number;
  metaType?: number;
  type: number;
}
