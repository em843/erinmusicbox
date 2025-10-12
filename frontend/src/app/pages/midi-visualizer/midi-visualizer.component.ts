import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NoteLayout } from 'src/app/interfaces/note-layout.interface';
import { MidiVisualizerService } from './midi-visualizer.service';
import {
  bh,
  // gh,
  bw,
  cw,
  font,
  gridColor,
  gridColor2,
  guidelineWidth,
  gw,
  letterColor,
  measureColor2,
  mFontSize,
  nlFontSize,
  noteColor,
  noteLetters15,
  noteLetters20,
  noteLetters30,
  nrad,
  // ch,
  p,
  validNotes15,
  validNotes20,
  validNotes30,
} from './name.const';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'midi-visualizer',
  templateUrl: './midi-visualizer.component.html',
})
export class MidiVisualizerComponent {
  // Properties
  private midiObject: any; // TODO type
  private noteLayout: NoteLayout;
  private validNotes: number[];
  private gh: number;
  private ch: number;
  private guidelinesOn: boolean;
  public fileName: string;
  public omittedNoteCount: number;
  public wrongFileExtensionMessage: boolean;
  public midiParsingErrorMessage: boolean;
  public mbt: number;
  public ml: number;
  public sp: number;
  public countdown: number;
  private stripLength: number;
  public form: FormGroup;
  constructor(
    private readonly midiService: MidiVisualizerService,
    private gtag: Gtag
  ) {
    this.validNotes = validNotes15;
    this.mbt = 15;
    this.ml = 4; // TODO
    this.stripLength = gw; // TODO
    this.gh = 280;
    this.ch = 360;
    this.sp = 1;
    this.guidelinesOn = true;
    this.gtag.event('screen_view', {
      app_name: 'erinmusicbox',
      screen_name: 'MIDI Visualizer',
    });
  }
  submitted = false;

  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('boxType', { static: true })
  boxType!: ElementRef<HTMLSelectElement>;
  @ViewChild('measures', { static: true })
  measures!: ElementRef<HTMLSelectElement>;
  @ViewChild('spacing', { static: true })
  spacing!: ElementRef<HTMLSelectElement>;
  @ViewChild('guidelines', { static: true })
  guidelines!: ElementRef<HTMLSelectElement>;

  // Draw initial grid (for aesthetic purposes)
  ngOnInit(): void {
    this.initVisualizer(this.stripLength);
    this.listenForMidiFile();
  }

  getContext() {
    return this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  initVisualizer(stripLength: number) {
    const context = this.initializeCanvas(this.canvas.nativeElement);
    this.drawLetters(context, this.mbt);
    //NOTE stripLength * 2 in case the user selects "x2" spacing
    //TODO redraw measures + grid based on strip length and spacing 
    this.drawMeasures(context, this.ml, stripLength * 2);
    this.drawGrid(context, gridColor, stripLength * 2);
  }

  initializeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = cw;
    canvas.height = this.ch;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    return context;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /*
  Listens for MIDI file but is also called when file input changes. 
  This allows the callback to run both for the initial file and all subsequent files. 
  (Yes, it's a little jank, but it works.)
  */
  async listenForMidiFile(event?: Event) {
    let input: HTMLInputElement;
    if (event) {
      input = event.target as HTMLInputElement;
      if (!this.isValidMidiFile(input)) {
        this.initVisualizer(this.stripLength);
        this.wrongFileExtensionMessage = true;
        this.initiateReloadCountdown(8);
        return;
      }
      this.wrongFileExtensionMessage = false;
      this.midiParsingErrorMessage = false;
    } else {
      // On page load. This needs to be here for the first file upload to parse.
      // I know this isn't proper Angular, but using ViewChild to refer to this element makes parsing fail for the initial file.
      input = document.getElementById('filereader') as HTMLInputElement;
    }
    // Get MIDI object
    this.midiService
      .parseMidi(input)
      .then((midiObject) => {
        // Process MIDI
        this.midiObject = midiObject;
        this.midiService.processMidi(
          this.midiObject,
          this.validNotes,
          (noteLayout) => {
            this.redrawNoteStrip(noteLayout);
          }
        );
      })
      .catch((error) => {
        if (!this.wrongFileExtensionMessage) {
          this.midiParsingErrorMessage = true;
        }
        throw new Error('Error parsing MIDI: ' + error);
      });
  }

  /*
  Reloads the page after <seconds> seconds. 
  This function exists because MidiParser's event listener tries to parse bad files and then needs a cooldown before it can parse good MIDI again.
  */
  initiateReloadCountdown(seconds: number) {
    this.countdown = seconds;
    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(intervalId);
        this.reloadNow();
      }
    }, 1000);
  }

  reloadNow() {
    window.location.reload();
  }

  isValidMidiFile(input: HTMLInputElement): boolean {
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      return file.name.endsWith('.mid') || file.type === 'audio/midi';
    }
    return false;
  }

  redrawNoteStrip(noteLayout: NoteLayout) {
    this.noteLayout = noteLayout;
    this.stripLength = noteLayout.stripLength;
    this.initVisualizer(noteLayout.stripLength);
    this.placeNotes(noteLayout);
  }

  placeNotes(noteLayout: NoteLayout) {
    const notes = noteLayout.notes;
    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];
      this.placeNote(note.xPositionBoxes, note.yPositionBoxes);
    }
    this.omittedNoteCount = noteLayout.omittedNoteCount;
  }

  placeNote(notePlacement: number, noteValue: number) {
    let xpos = notePlacement * bw * this.sp + p; // change to calculated formula once you find one that works
    let ypos = noteValue * -bh + (this.gh + 2 * bh); // change to calculated formula once you find one that works
    this.drawCircle(xpos, ypos, this.getContext());
  }

  drawCircle(x: number, y: number, context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(x, y, nrad, 0, 2 * Math.PI, false);
    context.fillStyle = noteColor;
    context.fill();
  }

  // Canvas component TODO (refactor someday?)
  drawGrid(
    context: CanvasRenderingContext2D,
    gridColor: string,
    gridLen: number
  ) {
    context.beginPath();
    context.strokeStyle = gridColor;
    // Draw vertical lines
    for (let x = 0; x < gridLen + 1; x += bw) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, this.gh + p);
    }
    // Draw horizontal lines
    for (let y = 0; y < this.gh + 1; y += bh) {
      context.moveTo(p, 0.5 + y + p);
      context.lineTo(gridLen + p, 0.5 + y + p);
    }
    context.stroke();
    if (this.guidelinesOn) {
      this.drawGuidelines(context, gridLen);
    }
  }

  /*
  Guidelines for each box type for ease of punching.
  */
  drawGuidelines(context: CanvasRenderingContext2D, gridLen: number) {
    context.beginPath();
    context.strokeStyle = gridColor2;
    context.lineWidth = guidelineWidth;
    if (this.mbt == 15) {
      for (let y = bh * 4; y < this.gh - bh; y += bh * 2) {
        context.moveTo(p, 0.5 + y + p);
        context.lineTo(gridLen + p, 0.5 + y + p);
      }
    } else if (this.mbt == 20) {
      for (let y = bh * 2; y < this.gh - bh * 8; y += bh * 2) {
        context.moveTo(p, 0.5 + y + p);
        context.lineTo(gridLen + p, 0.5 + y + p);
      }
      for (let y = this.gh - bh * 5; y < this.gh; y += bh * 2) {
        context.moveTo(p, 0.5 + y + p);
        context.lineTo(gridLen + p, 0.5 + y + p);
      }
    } else if (this.mbt == 30) {
      // Not sure what guidelines to do for 30 note yet
    }
    context.stroke();
  }

  drawLetters(context: CanvasRenderingContext2D, mbt: number) {
    let noteLetters;
    if (mbt == 15) {
      noteLetters = noteLetters15;
    } else if (mbt == 20) {
      noteLetters = noteLetters20;
    } else {
      noteLetters = noteLetters30;
    }
    context.font = nlFontSize + 'px ' + font;
    context.fillStyle = letterColor;
    for (let i = 0; i < noteLetters.length; i++) {
      let y = this.gh - bh * i + (p + 7);
      context.fillText(noteLetters[i], bh, y);
    }
  }

  drawMeasures(
    context: CanvasRenderingContext2D,
    ml: number,
    stripLength: number
  ) {
    if (ml <= 0) {
      return;
    }
    const mlBoxes: number = ml * 2;
    let y = this.gh + 1.5 * p;
    let measureP = mlBoxes * bw; // length, in pixels, of a measure
    context.beginPath();
    context.font = mFontSize + 'px ' + font;
    for (let i = 0; i < stripLength / measureP; i++) {
      context.fillStyle = 'black';
      context.fillText((i + 1).toString(), p + i * measureP, y);
      if (i % 2 == 1) {
        context.fillStyle = measureColor2;
        context.fillRect(p + i * measureP, p, measureP, this.gh);
      }
    }
  }

  setValidNotes(mbt: number) {
    if (mbt == 15) {
      this.validNotes = validNotes15;
    } else if (mbt == 20) {
      this.validNotes = validNotes20;
    } else if (mbt == 30) {
      this.validNotes = validNotes30;
    }
  }
  // Dropdowns
  setBoxType() {
    this.mbt = parseInt(this.boxType.nativeElement.value);
    this.setValidNotes(this.mbt);
    if (this.mbt == 15) {
      this.gh = 280;
    } else if (this.mbt == 20) {
      this.gh = 380;
    } else {
      this.gh = 580;
    }

    // Set new canvas height
    this.ch = this.gh + 80;
    this.initVisualizer(this.stripLength);
    if (this.midiObject) {
      // Reprocess MIDI for new box type
      this.midiService.processMidi(
        this.midiObject,
        this.validNotes,
        (noteLayout) => {
          this.redrawNoteStrip(noteLayout);
        }
      );
    }
  }
  // Set measure lengths
  setMeasureLength() {
    this.ml = parseInt(this.measures.nativeElement.value);
    if (this.noteLayout) {
      // Redraw grid
      this.stripLength = this.noteLayout.stripLength;
      this.initVisualizer(this.noteLayout.stripLength);
      // Place notes
      this.placeNotes(this.noteLayout);
    } else {
      this.initVisualizer(this.stripLength);
    }
  }

  // Note Layout component (TODO: refactor)
  // Set spacing in between notes
  setSpacing() {
    this.sp = parseFloat(this.spacing.nativeElement.value);
    if (this.noteLayout) {
      // Redraw grid
      this.stripLength = this.noteLayout.stripLength;
      this.initVisualizer(this.noteLayout.stripLength);
      // Place notes
      this.placeNotes(this.noteLayout);
    }
  }

  setGuidelines() {
    this.guidelinesOn = this.stringToBool(this.guidelines.nativeElement.value);
    this.initVisualizer(this.stripLength);
  }

  stringToBool(str: string) {
    return str === 'true';
  }
}
