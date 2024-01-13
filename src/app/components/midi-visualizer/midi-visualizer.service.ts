import { ElementRef, Inject, Injectable } from '@angular/core';
import { MidiObject } from 'src/app/interfaces/midi-object.interface';
// import { MidiObject } from 'src/app/interfaces/midiObject.interface';
// import { parse } from 'midi-parser-js';
import * as MidiParser from 'midi-parser-js';
import {
  cw,
  // ch,
  p,
  gw,
  // gh,
  bw,
  bh,
  //   nrad,
  validNotes15,
  validNotes20,
  validNotes30,
  letterColor,
  gridColor,
  noteColor,
  measureColor2,
  nlFontSize,
  mFontSize,
  fontSize,
  font,
  noteLetters15,
  noteLetters20,
  noteLetters30,
} from './name.const';
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

  // params: midi object
  // return: note layout object
  parseMidi(
    fileSource: HTMLInputElement,
    validNotes: number[],
    onNotesParsed: (noteLayout: NoteLayout) => void
  ) {
    console.log(fileSource);
    // Begin processing MIDI file
    // let midiParser = require('midi-parser-js');
    MidiParser.parse(fileSource, (midiObject: MidiObject) => {
      console.log('source');
      console.log(fileSource);
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
        console.log(this.xPixels + ' = ' + currEvent.deltaTime + ' / ' + bw);
        this.xPixels += currEvent.deltaTime * bw; // Increment deltaTime // used to divide deltaTime by sp
        console.log('xPixels: ' + this.xPixels);
        // Increment xBoxes
        console.log(this.xBoxes + ' = ' + currEvent.deltaTime);
        this.xBoxes += currEvent.deltaTime; // Increment deltaTime
        console.log('xBoxes: ' + this.xBoxes);
        // If it's a 'note on' event, place it; otherwise ignore it
        if (currEvent.type == 9) {
          if (Array.isArray(currEvent.data)) {
            let rowNum = this.searchFor(currEvent.data[0], validNotes);
            if (rowNum != -1) {
              // If the note is within the box's range
              this.noteArray.push({
                xPositionBoxes: this.xBoxes,
                noteValue: rowNum,
              });
              // this.placeNote(c, this.xPixels, rowNum, noteColor);
            } else {
              console.log('Invalid value ' + currEvent.data[0]);
              console.log('Cannot place note.');
              this.omittedNoteCount++;
            }
          }
        }
      }
      this.stripLength = this.xBoxes;
      onNotesParsed({
        notes: this.noteArray,
        omittedNoteCount: this.omittedNoteCount,
        source: this.source,
      });
    });
  }

  /* Searches a sorted array for the item.
      Will eventually implement binary search but I am lazy */
  searchFor(item: number, array: number[]) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == item) {
        return i; // item found
      }
    }
    return -1; // item not found
  }

  // // Gets param from URL
  // function getParameter(paramName) {
  //     let parameters = new URLSearchParams(window.location.search);
  //     return parameters.get(paramName)
  // }

  // // Sets param in URL
  // function setParameter(paramName, paramValue) {
  //     let parameters = new URLSearchParams(window.location.search);
  //     return parameters.set(paramName, paramValue)
  // }
}
