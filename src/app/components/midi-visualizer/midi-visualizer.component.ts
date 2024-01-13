import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MidiVisualizerService } from 'src/app/components/midi-visualizer/midi-visualizer.service';
import { MidiObject } from 'src/app/interfaces/midi-object.interface';
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

@Component({
  selector: 'midi-visualizer',
  templateUrl: './midi-visualizer.component.html',
})
// @Injectable()
export class MidiVisualizerComponent {
  // Properties
  private validNotes: number[];
  private gh: number;
  private ch: number;
  //   private midiObject: any;
  public mbt: number;
  public ml: number;
  private stripLength: number;
  public form: FormGroup;
  constructor(
    private readonly midiService: MidiVisualizerService,
    private readonly formBuilder: FormBuilder
  ) {
    this.validNotes = validNotes15;
    this.mbt = 15;
    this.ml = 4; // TODO
    this.stripLength = gw; // TODO
    this.gh = 280;
    this.ch = 360;
  }
  submitted = false;

  @ViewChild('myCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('boxType', { static: true })
  boxType!: ElementRef<HTMLSelectElement>;
  @ViewChild('measures', { static: true })
  measures!: ElementRef<HTMLSelectElement>;
  // @ViewChild('filereader', { static: true })
  // midiSource!: ElementRef;
  @ViewChild('spacing', { static: true })
  sp!: ElementRef<number>;

  // Draw initial grid (for aesthetic purposes)
  ngOnInit(): void {
    this.initVisualizer();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
    this.listenForMidiFile();
  }

  onSubmit(): void {
    console.log(this.form);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      console.log('form is valid');
      console.log(this.form.value);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listenForMidiFile() {
    const variable = document.getElementById(
      'filereader'
    ) as any as HTMLInputElement;
    this.midiService.parseMidi(variable, this.validNotes, (noteLayout) => {
      console.log(noteLayout);
      // place notes
    });
    // if (variable.files) {
    //   if (variable.files.length) {
    //     console.log(variable.files);
    //     this.midiService.parse(variable.files[0], this.validNotes);
    //   }
    // }
  }
  // placeNote(c, notePlacement, noteValue, noteColor) {
  //   let xpos = notePlacement + p; // change to calculated formula once you find one that works
  //   let ypos = noteValue * -bh + (gh + 2 * bh); // change to calculated formula once you find one that works
  //   drawCircle(c, xpos, ypos, nrad, noteColor);
  //   console.log(
  //     'Note with value ' + noteValue + ' should be visible on screen.'
  //   );
  // }

  // drawCircle(c, x, y, radius, fill) {
  //   c.beginPath();
  //   c.arc(x, y, radius, 0, 2 * Math.PI, false);
  //   if (fill) {
  //     c.fillStyle = fill;
  //     c.fill();
  //   }
  // }

  // // TODO: This needs to go somewhere
  // if (this.omittedNotes > 0) {
  //   console.log('Omitted: ' + this.omittedNotes);
  //   // Display text on canvas:
  //   c.font = fontSize + 'px ' + font;
  //   c.fillStyle = letterColor;
  //   c.fillText('Warning: ' + this.omittedNotes + ' notes omitted.', 40, 400);
  // }

  ngAfterViewInit() {}

  getContext() {
    return this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  initVisualizer() {
    let context = this.initializeCanvas(this.canvas.nativeElement);
    this.drawLetters(context, this.mbt);
    this.drawGrid(context, gridColor, gw);
    this.drawMeasures(context, this.ml, this.stripLength);
  }

  // Functions
  initializeCanvas(canvas: HTMLCanvasElement) {
    console.log('init canvas');
    console.log(canvas);
    canvas.width = cw;
    canvas.height = this.ch;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.globalCompositeOperation = 'destination-over';
    return context;
  }

  // Canvas component TODO (refactor someday?)
  drawGrid(
    context: CanvasRenderingContext2D,
    gridColor: string,
    gridLen: number
  ) {
    console.log('drawing grid...');
    context.beginPath();
    context.strokeStyle = gridColor;
    for (let x = 0; x < gridLen + 1; x += bw) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, this.gh + p);
    }
    for (let y = 0; y < this.gh + 1; y += bh) {
      context.moveTo(p, 0.5 + y + p);
      context.lineTo(gridLen + p, 0.5 + y + p);
    }
    context.stroke();
    console.log('grid drawn');
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
    console.log(
      'drawing measures of length ' +
        mlBoxes +
        ' until measure ' +
        stripLength / measureP
    );
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
    console.log(this.mbt);
    if (this.mbt == 15) {
      this.gh = 280;
    } else if (this.mbt == 20) {
      this.gh = 380;
    } else {
      this.gh = 580;
    }
    // Set new canvas height
    this.ch = this.gh + 80;
    this.initVisualizer();
  }
  // Set measure lengths
  setMeasureLength() {
    console.log('set measure length');
    console.log(this.measures);
    this.ml = parseInt(this.measures.nativeElement.value);
    this.initVisualizer();
  }

  // Note Layout component (TODO: refactor)
  // Set spacing in between notes
  setSpacing() {
    // console.log('Spacing before: ' + sp);
    // sp = eval(document.getElementById('spacing').value);
    // console.log('Spacing: ' + sp);
    // if (!midiObject) {
    //   console.log('Please select a MIDI file');
    //   return;
    // }
    // // Re-initialize canvas
    // c = initializeCanvas(canvas);
    // // Redraw notes + grid
    // stripLength = processNotes(midiObject, c, (1 / sp) * 240, validNotes);
    // this.drawGrid(c, gridColor, stripLength * bw + ml);
    // this.drawLetters(c, mbt);
    // // Draw measures
    // this.drawMeasures(context, this.ml, this.stripLength);
    // console.log('Spacing: ' + sp);
  }

  // // Training functions
}
