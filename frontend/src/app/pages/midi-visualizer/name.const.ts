// Define canvas parameters
export const cw: number = window.innerWidth * 8;
// export const ch: number = 360; //360

// Define grid parameters
export const p: number = 40; // grid padding
export const gw: number = 10500; // default grid width
// export const gh: number = 280; // grid height
export const bw: number = 40; // box width
export const bh: number = 20; // box height
export const deltaMagic: number = 240;

// Define note parameters
export const nlFontSize = '14'; // note letter font size
export const mFontSize = '16'; // measure number font size
export const fontSize = '18'; // normal text font size
export const font = 'Arial';
export const nrad: number = 7; // note circle radius

// Define colors/aesthetics
export const gridColor = 'black'; // Grid line color
export const gridColor2 = 'green'; // Grid guideline color
export const guidelineWidth = 3;
export const letterColor = 'black'; // Note letter color
export const noteColor = '#448097'; // Note/hole/circle color
// measureColor1: defined in the css file
export const measureColor2 = '#EBF7FE';

// Define accepted note values (for 15 note box)
// C4-C6 excluding sharps and flats
export const validNotes15: number[] = [
  60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84,
];
export const validNotes20: number[] = validNotes15.concat([86, 88, 89, 91, 93]);
export const validNotes30: number[] = [
  48, 50, 55, 57, 59, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
  76, 77, 78, 79, 80, 81, 82, 83, 84, 86, 88,
];
export const noteLetters15: string[] = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C',
];
export const noteLetters20: string[] = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
];
export const noteLetters30: string[] = [
  'C',
  'D',
  'G',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
  'D',
  'E',
];

// Define global variables
export let midiObject: Object;
export let canvas = document.querySelector('canvas');
// export let sp = eval(document.getElementById('spacing').value);
// export let ml = parseInt(document.getElementById('measures').value * 2);
// export let mbt = parseInt(document.getElementById('boxType').value);
// export let validNotes;
export let stripLength: number; // length of song in lines (so, number of lines used (i think))
