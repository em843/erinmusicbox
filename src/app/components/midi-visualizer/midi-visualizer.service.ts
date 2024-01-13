import { Injectable } from '@angular/core';
import { MidiObject } from 'src/app/interfaces/midi-object.interface';
import * as MidiParser from 'midi-parser-js';
import { bw, deltaMagic } from './name.const';
import { Note } from 'src/app/interfaces/note.interface';
import { NoteLayout } from 'src/app/interfaces/note-layout.interface';

@Injectable({
  providedIn: 'root',
})
export class MidiVisualizerService {
  private omittedNoteCount: number;
  private xPixels: number; // x position in pixels
  private xBoxes: number; // x position in boxes
  private noteArray: Note[];
  private source: string;
  private stripLength: number;

  constructor() {
    this.omittedNoteCount = 0;
    this.xPixels = 0;
    this.xBoxes = 0;
    this.noteArray = [];
    this.source = '';
    this.stripLength = 0;
  }

  /*
  Params: 
  fileSource: MIDI file from Music Box Maniacs

  Returns: a NoteLayout object containing all Note objects for the tune
  */
  parseMidi(fileSource: HTMLInputElement): Promise<MidiObject> {
    return new Promise((resolve, reject) => {
      MidiParser.parse(fileSource, (midiObject: MidiObject) => {
        resolve(midiObject);
      });
      // You might also want to handle potential errors by calling reject()
    });
  }

  /*
  Params: 
  midiObject: Parsed MIDI object from MidiParser
  validNotes: list of valid notes (15, 20, or 30 note box)
  onNotesParsed: callback function. What happens after processing is finished

  Returns: a NoteLayout object containing all Note objects for the tune
  */
  processMidi(
    midiObject: any, // TODO type?
    validNotes: number[],
    onNotesParsed: (noteLayout: NoteLayout) => void
  ) {
    console.log('obj');
    console.log(midiObject);
    console.log('Valid notes:');
    console.log(validNotes);
    let firstNote: number = -1;
    let events = midiObject.track[1].event;

    // Get rid of non-note info
    for (let i = 0; i < events.length; i++) {
      console.log('Checking for the first note...');
      let data = events[i].data;
      if (typeof data === 'string') {
        this.source = data;
      } else if (Array.isArray(data)) {
        // Once we find a note, break the loop.
        firstNote = i;
        console.log('Found first note at index ' + firstNote);
        break;
      }
    }
    if (firstNote == -1) {
      throw Error('No notes found');
    }

    for (let i = firstNote; i < events.length - 1; i++) {
      // For each note in track chunk
      // Get note event (either on/off)
      let currEvent = events[i];
      console.log(currEvent);
      // Add deltaTime to x tracker
      // Increment xPixels
      this.xPixels += (currEvent.deltaTime / deltaMagic) * bw; // Increment deltaTime
      console.log('xSum: ' + this.xPixels);
      // Increment xBoxes
      this.xBoxes += currEvent.deltaTime / deltaMagic; // Increment deltaTime
      console.log('xBoxesSum: ' + this.xBoxes);
      // If it's a 'note on' event, place it; otherwise ignore it
      if (currEvent.type == 9) {
        if (Array.isArray(currEvent.data)) {
          let rowNum = this.searchFor(currEvent.data[0], validNotes);
          if (rowNum != -1) {
            // If the note is within the box's range
            this.noteArray.push({
              xPositionBoxes: this.xBoxes,
              yPositionBoxes: rowNum,
            });
          } else {
            console.log('Invalid value ' + currEvent.data[0]);
            console.log('Cannot place note.');
            this.omittedNoteCount++;
          }
        }
      }
    }
    this.stripLength = this.xPixels;
    onNotesParsed({
      notes: this.noteArray,
      omittedNoteCount: this.omittedNoteCount,
      source: this.source,
      stripLength: this.stripLength,
    });
  }

  /* Searches a sorted array for the item.
      Will eventually implement binary search but I am lazy 

      Returns: INDEX of valid note, NOT midi value of note
      
      */
  searchFor(item: number, array: number[]) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == item) {
        return i; // item found
      }
    }
    return -1; // item not found
  }
}
