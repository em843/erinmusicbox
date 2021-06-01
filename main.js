/*
Author: Erin
Created: 4/20/21
Modified: 4/21/21 parse events in MIDI data
Modified: 4/26/21 display multiple shapes on canvas

WHERE YOU LEFT OFF:
Trying to figure out a solution for placeNotes() with xPosition, xSum and deltaTime.
I think the solution is to have two separate methods, placeNote and createNote.


short term
TODO: Figure out difference between drawCircle x y parameters and circle.x + circle.y
TODO: Initialize grid
TODO: Figure out proportion formulas for placing notes

long term
TODO: Add support for multiple tracks
*/

// Define canvas parameters
var cw = window.innerWidth*3;
var ch = 360;
// Define grid parameters 
var p = 40; // grid padding
var gw = 3000; // deafult grid width
var gh = 280; // grid height
var bw = 40; // box width
var bh = 20; // box height
var dt = 240; // delta time value for one box
// Define note parameters
var fontSize = 18; // note letter font size
var nrad = 7; // note circle radius
// Define colors/aesthetics
gridColor = "black" // Grid line color
letterColor = "black" // Note letter color
noteColor = "#448097" // Note/hole/circle color

// Define accepted note values (for 15 note box)
// C4-C6 excluding sharps and flats
var validNotes = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]

function onLoad() {
    console.log("load successful");

    // Create canvas
    var canvas = document.querySelector('canvas');
    console.log(canvas)
    canvas.width = cw;
    canvas.height = ch;
    var c = canvas.getContext('2d');

    // Draw initial grid (for aesthetic purposes)
    drawGrid(c, gridColor, letterColor, gw)

    // Select the INPUT element that will handle the file selection.
    let source = document.getElementById("filereader");

    // Begin processing MIDI file
    MidiParser.parse(source, function (obj) {
        console.log("source")
        console.log(source)
        console.log("obj")
        console.log(obj);

        // Count omitted notes
        var omittedNotes = 0;       

        // Re-initialize canvas
        canvas.width = cw;
        canvas.height = ch;
        var c = canvas.getContext('2d');
        
        // Redraw grid
        drawGrid(c, gridColor, letterColor, gw)

        // Parse notes
        var firstNote;
        var events = obj.track[1].event;

        // Get rid of non-note info
        for (var i = 0; i < events.length; i++) {
            console.log("Checking for the first note...");
            if (Array.isArray(events[i].data)) { // Once we find a note, break the loop.
                firstNote = i;
                console.log("Found first note at index " + firstNote);
                break;
            }
        }

        // Process/place notes
        var xsum = 0;
        console.log("Time to process events.");
        for (var i = firstNote; i < events.length-1; i++) { // For each note in track chunk
            // Get note event (either on/off)
            var currEvent = events[i];
            console.log(currEvent);
            // Add deltaTime to x tracker
            xsum += (currEvent.deltaTime / dt) * bw; // Increment deltaTime
            console.log("xsum: " + xsum);
            // If it's a 'note on' event, place it; otherwise ignore it
            if (currEvent.type == 9) { 
                rowNum = searchFor(currEvent.data[0], validNotes)
                if(rowNum != -1) { // If the note is within a 15 note box range
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
        
    
    });

    
    
}

function drawGrid(c, gridColor, letterColor, gridLen){
    
    var noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", "C"]

    c.font = fontSize+ "px Arial";
    c.fillStyle = letterColor;
    for (var i = 0; i < noteLetters.length; i++){
        var y = gh - (bh*i) + (p + 7)
        c.fillText(noteLetters[i], bh, y);
    }
    
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
