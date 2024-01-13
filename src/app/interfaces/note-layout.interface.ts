import { Note } from './note.interface';

export interface NoteLayout {
  notes: Note[];
  omittedNoteCount: number;
  source: string;
  stripLength: number; // in pixels
}
