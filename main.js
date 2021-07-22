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
var cw = window.innerWidth*8;
var ch = 360;
// Define grid parameters 
var p = 40; // grid padding
var gw = 10500; // default grid width
var gh = 280; // grid height
var bw = 40; // box width
var bh = 20; // box height
// Define note parameters
var fontSize = 18; // note letter font size
var nrad = 7; // note circle radius
// Define colors/aesthetics
gridColor = "black" // Grid line color
letterColor = "black" // Note letter color
noteColor = "#448097" // Note/hole/circle color

// Define accepted note values (for 15 note box)
// C4-C6 excluding sharps and flats
var validNotes15 = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]

function onLoad() {
    console.log("load successful");

    // Background color
    // Add behind elements.
    // c.globalCompositeOperation = 'destination-over'
    // Now draw!
    //c.fillStyle = "mintcream";
    //c.fillRect(0, 0, canvas.width, canvas.height);

    // Define canvas
    var canvas = document.querySelector('canvas');
    console.log(canvas)
    canvas.width = cw;
    canvas.height = ch;
    var c = canvas.getContext('2d');

    // Draw initial grid (for aesthetic purposes)
    drawLetters(c, letterColor)
    drawGrid(c, gridColor, gw)
    // Draw measures
    var ml = 8 // hard-coding this for now
    drawMeasures(ml)

    // Select the INPUT element that will handle the file selection.
    let source = document.getElementById("filereader");

    // Begin processing MIDI file
    MidiParser.parse(source, function (obj) {
        console.log("source")
        console.log(source)
        console.log("obj")
        console.log(obj);

        // // Re-initialize canvas
        // canvas.width = cw;
        // canvas.height = ch;
        // var c = canvas.getContext('2d');

        var dt = 240; // delta time value for one box (default = 240)
        // 320 for 2/3 spacing MBM
        // TODO: make this more understandable in code and configure for MBM and online sequencer

        var stripLength = processNotes(obj, c, dt, bw, validNotes15)
        
        c.globalCompositeOperation='destination-over';

        // Redraw grid
        drawGrid(c, gridColor, (stripLength * bw) + ml)

        // Draw measures
        drawMeasures()
    
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
function processNotes(midiObject, c, sp, bw, validNotes) {
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
    console.log("Omitted: " + omittedNotes)

    if (omittedNotes > 0){
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
    var sp = document.getElementById("spacing").value;
    processNotes(obj, c, (1/sp) * 240, bw, validNotes15) // 240 is default value for MBM midi files
    //TODO: Figure out the logic for calling this function... should i reload the page??? idk
}

// Set measure length
function drawMeasures() {
    var ml = document.getElementById("measures").value * 2;
    console.log("drawing measures of length " + ml)
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