import { Injectable } from '@angular/core';
import { MidiObject } from 'src/app/interfaces/midi-object.interface';
import * as MidiParser from 'midi-parser-js';
import { bw } from './name.const';
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
  private timeDivision: number; // ticks per quarter note from MIDI file

  constructor() {
    this.omittedNoteCount = 0;
    this.xPixels = 0;
    this.xBoxes = 0;
    this.noteArray = [];
    this.source = '';
    this.stripLength = 0;
    this.timeDivision = 240; // default fallback value (formerly "deltaMagic")
  }

  resetValues() {
    this.omittedNoteCount = 0;
    this.xPixels = 0;
    this.xBoxes = 0;
    this.noteArray = [];
    this.source = '';
    this.stripLength = 0;
    this.timeDivision = 240; // reset to former deltaMagic value (MBM default)
  }

  /*
  @param fileSource: MIDI file from Music Box Maniacs
  @return a NoteLayout object containing all Note objects for the tune
  */
  parseMidi(fileSource: HTMLInputElement): Promise<MidiObject> {
    return new Promise((resolve, reject) => {
      MidiParser.parse(fileSource, (midiObject: MidiObject) => {
        console.log("fileSource:", `${fileSource}`);
        console.log("midiObject", midiObject);
        resolve(midiObject);
      });
      // TODO handle potential errors by calling reject()
    });
  }

  // Get events properly depending on format type
  //@see https://github.com/colxi/midi-parser-js/wiki/MIDI-File-Format-Specifications#header-chunk
  getMidiEvents(midiObject: MidiObject) {
    if (midiObject.formatType === 0) {
      return midiObject.track[0].event;
    } else if (midiObject.formatType === 1) {
      //Return events from the first track that contains notes.
      //TODO provide user an option to specify which track to use
      return  midiObject.track[1].event;
    } else if (midiObject.formatType === 2) {
      //TODO is this correct?
      return  midiObject.track[1].event;
    }
    return midiObject.track[1].event;
  }


  /*
  @param midiObject: Parsed MIDI object from MidiParser
  @param validNotes: list of valid notes (15, 20, or 30 note box)
  @param onNotesParsed: callback function. What happens after processing is finished
  @return a NoteLayout object containing all Note objects for the tune
  */
  processMidi(
    midiObject: MidiObject,
    validNotes: number[],
    onNotesParsed: (noteLayout: NoteLayout) => void
  ) {
    this.resetValues();
    
    // Extract and process time division from MIDI object
    this.timeDivision = this.getEffectiveTimeDivision(midiObject.timeDivision);
    let firstNote: number = -1;
    let events = this.getMidiEvents(midiObject);

    // Get rid of non-note info
    for (let i = 0; i < events.length; i++) {
      // Checking for the first note...
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
      // For each note in track chunk, get note event (either on/off)
      let currEvent = events[i];
      // Add deltaTime to x tracker
      // Increment xPixels (convert ticks to pixels using file's specific time division)
      this.xPixels += (currEvent.deltaTime / this.timeDivision) * bw;
      // Increment xBoxes (convert ticks to quarter note units)
      this.xBoxes += currEvent.deltaTime / this.timeDivision;
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

  /**
   * Gets the effective time division for converting delta times to musical time.
   * Handles both ticks-per-quarter-note and SMPTE formats.
   * @param timeDivision - Raw time division value from MIDI header
   * @returns Effective ticks per quarter note
   */
  private getEffectiveTimeDivision(timeDivision: number): number {
    // Check if top bit is set (SMPTE format)
    if (timeDivision & 0x8000) {
      // SMPTE format: top 7 bits = frames per second, bottom 8 bits = ticks per frame
      const framesPerSecond = (timeDivision & 0x7F00) >> 8;
      const ticksPerFrame = timeDivision & 0x00FF;
      
      console.log(`SMPTE format detected: ${framesPerSecond} fps, ${ticksPerFrame} ticks/frame`);
      
      // Convert SMPTE to approximate ticks per quarter note
      // Assume 120 BPM (2 beats per second) for conversion
      const beatsPerSecond = 2;
      const ticksPerSecond = framesPerSecond * ticksPerFrame;
      return Math.round(ticksPerSecond / beatsPerSecond);
    } else {
      // Standard ticks per quarter note format
      console.log(`Standard format: ${timeDivision} ticks per quarter note`);
      return timeDivision;
    }
  }

  /**
   * Gets diagnostic information about the current MIDI file's timing
   * @returns Object with timing information
   */
  getTimingInfo() {
    return {
      timeDivision: this.timeDivision,
      ticksPerQuarterNote: this.timeDivision,
      // At 120 BPM, each quarter note = 0.5 seconds
      // So each tick = 0.5 / timeDivision seconds
      secondsPerTick: 0.5 / this.timeDivision,
      // Conversion factor used in visualization
      pixelsPerQuarterNote: bw,
      // Comparison with old hardcoded value
      oldDeltaMagic: 240,
      scalingFactor: this.timeDivision / 240
    };
  }

  /* Searches a sorted array for the item.
      Will eventually implement binary search but I am lazy 

      @return INDEX of valid note, NOT midi value of note
      
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
