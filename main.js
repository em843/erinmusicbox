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
let ch = 360;
// Define grid parameters 
let p = 40; // grid padding
let gw = 10500; // default grid width
let gh = 280; // grid height
let bw = 40; // box width
let bh = 20; // box height
// Define note parameters
let fontSize = 18; // note letter font size
let nrad = 7; // note circle radius
// Define colors/aesthetics
gridColor = "black" // Grid line color
letterColor = "black" // Note letter color
noteColor = "#448097" // Note/hole/circle color
// Define accepted note values (for 15 note box)
// C4-C6 excluding sharps and flats
let validNotes15 = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
let validNotes20 = validNotes15.concat([86, 88, 89, 91, 93]);
let validNotes30 = [48, 50, 55, 57, 59, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 86, 88];
// Define global variables
let midiObject;
let ctx;
let canvas = document.querySelector('canvas');
let sp = eval(document.getElementById("spacing").value);
let ml = parseInt(document.getElementById("measures").value * 2);
let mbt = parseInt(document.getElementById("boxType").value);
let validNotes;

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

    // Draw initial grid (for aesthetic purposes)
    drawLetters(c, letterColor)
    drawGrid(c, gridColor, gw)
    // Draw measures
    drawMeasures(ml)

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

        let stripLength = processNotes(obj, c, (1/sp) * 240, validNotes)
        
        c.globalCompositeOperation='destination-over';

        // Redraw grid
        drawGrid(c, gridColor, (stripLength * bw) + ml)
        drawLetters(c, letterColor)

        // Draw measures
        drawMeasures(ml)
    
    });
}

function drawGrid(c, gridColor, gridLen){
    console.log("drawing grid...")
    c.beginPath();
    for (let x = 0; x < gridLen+1; x+=bw) {
        c.moveTo(0.5 + x + p, p);
        c.lineTo(0.5 + x + p, gh + p);
    }
    for (let y = 0; y < gh+1; y+=bh) {
        c.moveTo(p, 0.5 + y + p);
        c.lineTo(gridLen + p, 0.5 + y + p);
    }
    c.strokeStyle = gridColor;
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
        c.font = "18px Arial";
        c.fillStyle = letterColor;
        c.fillText("Warning: " + omittedNotes + " notes omitted.", 40, 400);
    }
    // Return length of song in boxes
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
    stripLength = processNotes(midiObject, c, (1/sp) * 240, validNotes)
    c.globalCompositeOperation='destination-over';
    // Redraw grid
    drawGrid(c, gridColor, (stripLength * bw) + ml)
    drawLetters(c, letterColor)

    // Draw measures
    drawMeasures(ml)
    console.log("Spacing: " + sp)
}

// Set measure length
function setMeasureLength() {
    ml = parseInt(document.getElementById("measures").value) * 2;
    console.log("Measure length: " + ml)
    drawMeasures(ml);
}
// Draw measures
function drawMeasures(ml) {
    console.log("drawing measures of length " + ml)
    // TODO: Make measures go
}

function drawLetters(c, letterColor) {
    let noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", "C"]

    c.font = fontSize+ "px Arial";
    c.fillStyle = letterColor;
    for (let i = 0; i < noteLetters.length; i++){
        let y = gh - (bh*i) + (p + 7)
        c.fillText(noteLetters[i], bh, y);
    }
}

function setBoxType() {
    console.log("starting...")
    mbt = parseInt(document.getElementById("boxType").value);
    console.log("Box Type: " + mbt)
    setValidNotes(mbt)
    if (!midiObject) {
        console.log("Please select a MIDI file");
        return;
    }

    // Re-initialize canvas
    canvas.width = cw;
    canvas.height = ch;
    let c = canvas.getContext('2d');

    stripLength = processNotes(midiObject, c, (1/sp) * 240, validNotes)
    
    c.globalCompositeOperation='destination-over';
    // Redraw grid
    drawGrid(c, gridColor, (stripLength * bw) + ml)
    drawLetters(c, letterColor)

    // Draw measures
    drawMeasures(ml)
    
}
