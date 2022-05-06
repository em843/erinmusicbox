/*
Author: Erin
Created: 4/20/21
Modified: 4/21/21 parse events in MIDI data
Modified: 4/26/21 display multiple shapes on canvas

WHERE YOU LEFT OFF:
Need to fix logic for passing parameters for setSpacing function so I can make that dropdown work
           
short term
TODO: Figure out proportion formulas for placing notes
TODO: Figure out why dropdown label triggers the hover event
TODO: Wrap on page so it's not one long strip
TODO: Save to PDF button
TODO: Fix spacing dropdown so it actually works
TODO: Create your own function in place of eval()
TODO: Add a type of object (div class?) for warnings like omissions and not having support for 20 notes

long term
TODO: Add support for multiple tracks
TODO: Figure out CSS inches relations for printing

*/

// Define canvas parameters
let cw = window.innerWidth*8;
let ch = 360; //360

// Define grid parameters 
let p = 40; // grid padding
let gw = 10500; // default grid width
let gh = 280; // grid height
let bw = 40; // box width
let bh = 20; // box height

// Define note parameters
const nlFontSize = "14"; // note letter font size
const mFontSize = "16"; // measure number font size
const fontSize = "18"; // normal text font size
const font = "Arial"
let nrad = 7; // note circle radius

// Define colors/aesthetics
const gridColor = "black" // Grid line color
const letterColor = "black" // Note letter color
const noteColor = "#448097" // Note/hole/circle color
// measureColor1: defined in the css file
const measureColor2 = "#EBF7FE"

// Define accepted note values (for 15 note box)
// C4-C6 excluding sharps and flats
const validNotes15 = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
const validNotes20 = validNotes15.concat([86, 88, 89, 91, 93]);
const validNotes30 = [48, 50, 55, 57, 59, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 86, 88];

// Define global variables
let midiObject;
let ctx;
let canvas = document.querySelector('canvas');
let sp = eval(document.getElementById("spacing").value);
let ml = parseInt(document.getElementById("measures").value * 2);
let mbt = parseInt(document.getElementById("boxType").value);
let validNotes;
let stripLength; // length of song in lines (so, number of lines used (i think))

function setValidNotes(mbt) {
    if (mbt == 15) {
        validNotes = validNotes15
    }
    else if (mbt == 20) {
        validNotes = validNotes20
    }
    else if (mbt == 30) {
        validNotes = validNotes30
    }
}
setValidNotes(mbt)

function onLoad() {
    console.log("load successful");

    // Define canvas
    console.log(canvas)
    canvas.width = cw;
    canvas.height = ch;
    let c = canvas.getContext('2d');
    ctx = c;

    // Draw measures
    drawMeasures(c, ml);
    // Draw initial grid (for aesthetic purposes)
    drawLetters(c, letterColor, mbt)
    drawGrid(c, gridColor, gw)
    

    // Select the INPUT element that will handle the file selection.
    let source = document.getElementById("filereader");

    // Begin processing MIDI file
    MidiParser.parse(source, function (obj) {
        console.log("source")
        console.log(source)
        console.log("obj")
        console.log(obj);
        // Set obj to global variable
        midiObject = obj;

        // Re-initialize canvas
        canvas.width = cw;
        canvas.height = ch;
        let c = canvas.getContext('2d');

        stripLength = processNotes(obj, c, (1/sp) * 240, validNotes)
        
        c.globalCompositeOperation='destination-over';

        // Draw measures
        drawMeasures(c, ml);
        // Redraw grid
        drawGrid(c, gridColor, (stripLength * bw) + ml)
        drawLetters(c, letterColor, mbt)
    });
}

function drawGrid(c, gridColor, gridLen){
    console.log("drawing grid...")
    c.beginPath();
    c.strokeStyle = gridColor;
    for (let x = 0; x < gridLen+1; x+=bw) {
        c.moveTo(0.5 + x + p, p);
        c.lineTo(0.5 + x + p, gh + p);
    }
    for (let y = 0; y < gh+1; y+=bh) {
        c.moveTo(p, 0.5 + y + p);
        c.lineTo(gridLen + p, 0.5 + y + p);
    }
    c.stroke();
    console.log("grid drawn")
}

// Processes all notes. Returns length of song in boxes.
function processNotes(midiObject, c, sp, validNotes) {
    console.log("Valid notes:")
    console.log(validNotes)
    let firstNote;
    let events = midiObject.track[1].event;
    let omittedNotes = 0; // Count omitted notes

    // Get rid of non-note info
    for (let i = 0; i < events.length; i++) {
        console.log("Checking for the first note...");
        if (Array.isArray(events[i].data)) { // Once we find a note, break the loop.
            firstNote = i;
            console.log("Found first note at index " + firstNote);
            break;
        }
    }
    let xsum = 0;
    console.log("Time to process events.");
    for (let i = firstNote; i < events.length-1; i++) { // For each note in track chunk
        // Get note event (either on/off)
        let currEvent = events[i];
        console.log(currEvent);
        // Add deltaTime to x tracker
        console.log(xsum + " = " + currEvent.deltaTime + " / " + sp + " * " + bw)
        xsum += (currEvent.deltaTime / sp) * bw; // Increment deltaTime
        console.log("xsum: " + xsum);
        // If it's a 'note on' event, place it; otherwise ignore it
        if (currEvent.type == 9) { 
            rowNum = searchFor(currEvent.data[0], validNotes)
            if(rowNum != -1) { // If the note is within the box's range
                placeNote(c, xsum, rowNum, noteColor);
            }
            else {
                console.log("Invalid value " + currEvent.data[0]);
                console.log("Cannot place note.");
                omittedNotes++;

            }
        }
    } 
    if (omittedNotes > 0){
        console.log("Omitted: " + omittedNotes)
        // Display text on canvas:
        c.font = fontSize + "px " + font;
        c.fillStyle = letterColor;
        c.fillText("Warning: " + omittedNotes + " notes omitted.", 40, 400);
    }
    // Old comment: Return length of song in boxes 
    // However, I'm pretty sure this returns the last x pixel position on the canvas.
    return xsum;
}

function placeNote(c, notePlacement, noteValue, noteColor){
    let xpos = notePlacement + p; // change to calculated formula once you find one that works
    let ypos = noteValue*-bh + (gh + 2*bh); // change to calculated formula once you find one that works
    drawCircle(c, xpos, ypos, nrad, noteColor)
    console.log("Note with value " + noteValue + " should be visible on screen.");
}


function drawCircle(ctx, x, y, radius, fill) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
}

/* Searches a sorted array for the item.
Will eventually implement binary search but I am lazy
*/
function searchFor(item, array){
    for (let i = 0; i < array.length; i++){
        if (array[i] == item){
            return i; // item found
        }
    }
    return -1; // item not found
}

// Set spacing in between notes
function setSpacing() {
    console.log("Spacing before: " + sp)
    sp = eval(document.getElementById("spacing").value);
    console.log("Spacing: " + sp)
    if (!midiObject) {
        console.log("Please select a MIDI file");
        return;
    }
    // Re-initialize canvas
    canvas.width = cw;
    canvas.height = ch;
    let c = canvas.getContext('2d');
    c.globalCompositeOperation='destination-over';
    // Redraw notes + grid
    stripLength = processNotes(midiObject, c, (1/sp) * 240, validNotes)
    drawGrid(c, gridColor, (stripLength * bw) + ml)
    drawLetters(c, letterColor, mbt)
    // Draw measures
    drawMeasures(c, ml);
    console.log("Spacing: " + sp);
}

// Reinitialize strip
// function

// Set measure lengths
function setMeasureLength() {
    ml = parseInt(document.getElementById("measures").value) * 2;
    // Re-initialize canvas
    canvas.width = cw;
    canvas.height = ch;
    let c = canvas.getContext('2d');
    c.globalCompositeOperation='destination-over';
    // Draw measures
    drawMeasures(c, ml);
    console.log("Measure length: " + ml);
    // Redraw notes + grid
    if (midiObject) {
        stripLength = processNotes(midiObject, c, (1/sp) * 240, validNotes)
        drawGrid(c, gridColor, (stripLength * bw) + ml)
    }
    else {
        console.log("Please select a MIDI file");
        drawGrid(c, gridColor, gw);
    }
    drawLetters(c, letterColor, mbt);
}
// Draw measures
function drawMeasures(c, ml) {
    if (ml <= 0){
        return;
    }
    if (!stripLength) {
        stripLength = gw
    }
    let y = gh + (1.5 * p);
    let measureP = ml * bw // length, in pixels, of a measure
    c.beginPath();
    c.font = mFontSize+ "px " + font;
    for (let i = 0; i < stripLength/measureP; i++) {
        c.fillStyle = "black";
        c.fillText(i + 1, p + i*measureP, y);
        if (i % 2 == 1) {
            c.fillStyle = measureColor2;
            c.fillRect(p + i*measureP, p, measureP, gh);
        }
    }
    console.log("drawing measures of length " + ml + " until measure " + stripLength/measureP)
}

function drawLetters(c, letterColor, mbt) {
    let noteLetters;
    if (mbt == 15){
        noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", "C"]
    }
    else if (mbt == 20){
        noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", 
                    "C", "D", "E", "F", "G", "A"]
    }
    else {
        noteLetters = ["C", "D", "G", "A", "B",
                    "C", "D", "E", "F", "F#", "G", "G#", "A", "A#", "B", 
                    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
                    "C", "D", "E"]
    }
    

    c.font = nlFontSize+ "px " + font;
    c.fillStyle = letterColor;
    for (let i = 0; i < noteLetters.length; i++){
        let y = gh - (bh*i) + (p + 7)
        c.fillText(noteLetters[i], bh, y);
    }
}

function setBoxType() {
    console.log("starting...")
    mbt = parseInt(document.getElementById("boxType").value);
    setValidNotes(mbt);
    if (mbt==15){
        gh = 280;
    }
    else if (mbt==20){
        gh = 380;
    }
    else {
        gh = 580;
    }
    // Set new canvas height
    ch = gh + 80;
    // Re-initialize canvas
    canvas.width = cw;
    canvas.height = ch;
    let c = canvas.getContext('2d');    
    c.globalCompositeOperation='destination-over';
    // Check for midi file
    if (midiObject) {
        stripLength = processNotes(midiObject, c, (1/sp) * 240, validNotes);
    }
    else {
        console.log("Please select a MIDI file");
        stripLength = cw;
    }
    // Draw measures
    drawMeasures(c, ml);
    // Redraw notes + grid
    drawGrid(c, gridColor, (stripLength * bw) + ml);
    console.log("Grid with height " + ch + " drawn")
    drawLetters(c, letterColor, mbt);
    console.log("Box Type: " + mbt);
}

// Parse with demo file
// HORRIBLE horrible repetition of code here, 
// but i want to get this demo up and running!
getTxt = function (){

    $.ajax({
      url:'text.txt',
      success: function (data){
        //parse your data here
        //you can split into lines using data.split('\n') 
        //an use regex functions to effectively parse it
      }
    });
  }
let runDemo = () => {
    console.log("Running demo...")
     // Select the INPUT element that will handle the file selection.
     let midiFile = "YouAreMySunshine.mid";
     $.ajax({
        url: midiFile,
        success: function (data){
            let encodedFile = btoa(unescape(encodeURIComponent(data)))
          // Begin processing MIDI file
            console.log(encodedFile)
            MidiParser.parse(encodedFile, function (obj) {
                console.log("obj")
                console.log(obj);
                // Set obj to global variable
                midiObject = obj;

                // Re-initialize canvas
                canvas.width = cw;
                canvas.height = ch;
                let c = canvas.getContext('2d');

                let stripLength = processNotes(obj, c, (1/sp) * 240, validNotes)
                
                c.globalCompositeOperation='destination-over';
                // Draw measures
                drawMeasures(c, ml);
                // Redraw grid
                drawGrid(c, gridColor, (stripLength * bw) + ml)
                drawLetters(c, letterColor, mbt)
            });
        }
      });
}
