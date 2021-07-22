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

long term
TODO: Add support for multiple tracks
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
// Define accepted note values 
// 15 note: C4-C6 excluding sharps and flats
let validNotes15 = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
// 20 note: C4-A6 excluding sharps and flats
let validNotes20 = [];
// 30 note:
let validNotes30 = [];
// Make global objects
let midiObject;
let cxt;
let validNotes;
// Get dropdown values
let mbt = document.getElementById("boxType").value; // Music box type
let ml = document.getElementById("measures").value*2; // Measure length
let sp = document.getElementById("spacing").value; // Note spacing (what to divide deltaTime by)


function onLoad() {
    console.log("load successful");

    // Define canvas
    var canvas = document.querySelector('canvas');
    console.log(canvas)
    canvas.width = cw;
    canvas.height = ch;
    var c = canvas.getContext('2d');
    cxt = c;

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

        // Make midi object global
        midiObject = obj;

        var dt = 240; // delta time value for one box (default = 240)
        // 320 for 2/3 spacing MBM
        // TODO: make this more understandable in code and configure for MBM and online sequencer

        var stripLength = processNotes(obj, c, dt, bw, validNotes15)
        
        c.globalCompositeOperation='destination-over';

        // Redraw grid
        drawGrid(c, gridColor, (stripLength * bw) + ml)

        // Draw measures
        drawMeasures(ml)
    
    });
}

function drawGrid(c, gridColor, gridLen){
    console.log("drawing grid...")
    c.beginPath();
    for (var x = 0; x < gridLen+1; x+=bw) {
        c.moveTo(0.5 + x + p, p);
        c.lineTo(0.5 + x + p, gh + p);
    }
    for (var y = 0; y < gh+1; y+=bh) {
        c.moveTo(p, 0.5 + y + p);
        c.lineTo(gridLen + p, 0.5 + y + p);
    }
    c.strokeStyle = gridColor;
    c.stroke();
    console.log("grid drawn")
}

// Processes all notes. Returns length of song in boxes.
function processNotes(midiObject, c, sp, validNotes) {
    var firstNote;
    var events = midiObject.track[1].event;
    var omittedNotes = 0; // Count omitted notes

    // Get rid of non-note info
    for (var i = 0; i < events.length; i++) {
        console.log("Checking for the first note...");
        if (Array.isArray(events[i].data)) { // Once we find a note, break the loop.
            firstNote = i;
            console.log("Found first note at index " + firstNote);
            break;
        }
    }
    var xsum = 0;
    console.log("Time to process events.");
    for (var i = firstNote; i < events.length-1; i++) { // For each note in track chunk
        // Get note event (either on/off)
        var currEvent = events[i];
        console.log(currEvent);
        // Add deltaTime to x tracker
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
    var xpos = notePlacement + p; // change to calculated formula once you find one that works
    var ypos = noteValue*-bh + (gh + 2*bh); // change to calculated formula once you find one that works
    //console.log("Xpos: " + xpos);
    //console.log("Ypos: " + ypos);
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
    for (var i = 0; i < array.length; i++){
        if (array[i] == item){
            return i; // item found
        }
    }
    return -1; // item not found
}

// Set spacing in between notes
function setSpacing() {
    sp = document.getElementById("spacing").value;
    if (!midiObject) {
        console.log("Please select a MIDI file")
        return;
    }
    processNotes(midiObject, cxt, (1/sp) * 240, validNotes) 
    console.log("Spacing: " + sp)
}

// Set measure length
function setMeasureLength() {
    ml = document.getElementById("measures").value * 2;
    console.log(ml)
    drawMeasures(parseInt(ml))
}

function drawMeasures(ml) {
    console.log("drawing measures of length " + ml)
    // TODO: make measures go
}

function drawLetters(c, letterColor) {
    var noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", "C"]

    c.font = fontSize+ "px Arial";
    c.fillStyle = letterColor;
    for (var i = 0; i < noteLetters.length; i++){
        var y = gh - (bh*i) + (p + 7)
        c.fillText(noteLetters[i], bh, y);
    }
}

function setBoxType() {
    boxType = document.getElementById("boxType").value;
    if (!midiObject) {
        console.log("Please select a MIDI file")
        return;
    }
    validNotes = "validNotes" + boxType
    console.log("box type: " + boxType)
    stripLength = processNotes(midiObject, cxt, sp, validNotes) 
    // Redraw grid
    drawGrid(c, gridColor, (stripLength * bw) + ml)

}

