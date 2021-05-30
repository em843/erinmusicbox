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


// Define grid parameters globally
p = 40; // grid padding
gw = 700; // grid width
gh = 280; // grid height
bw = 40; // box width
bh = 20; // box height


function onLoad(midiData) {
    console.log("load successful");

    // Create canvas
    var canvas = document.querySelector('canvas');
    console.log(canvas)
    canvas.width = window.innerWidth;
    canvas.height = 500;
    var c = canvas.getContext('2d');

    // Define accepted note values (for 15 note box)
    var validNotes = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72]

    // Draw grid
    gridColor = "black" // Grid line color
    letterColor = "black" // Note letter color
    noteColor = "#448097" // Note/hole/circle color
    drawGrid(c, gridColor, letterColor)

    // Select the INPUT element that will handle the file selection.
    let source = document.getElementById("filereader");

    // Begin processing MIDI file
    MidiParser.parse(source, function (obj) {
        console.log("Object " + obj);

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
        console.log("Time to process events.");
        for (var i = firstNote; i < events.length-1; i++) { // For each note in track chunk
            var currEvent = events[i];
            var xSum = 0;
            var omittedNotes = 0;
            if (currEvent.data[1] !=0 ) { // If it's a 'note on' event, place it; otherwise ignore it
                rowNum = searchFor(currEvent.data[0], validNotes)
                if(rowNum != -1) { // If the note is within a 15 note box range
                    console.log(currEvent);
                    console.log("deltaTime: " + currEvent.deltaTime);
                    // Determine xpos (add deltaTime to next note's x position)
                    xSum += currEvent.deltaTime; 
                    placeNote(c, xSum, rowNum, noteColor)
                }
                else {
                    console.log("Cannot place note.")
                    omittedNotes++;
                }
            }
        } 

        if (omittedNotes > 0){
            // Display text on canvas:
            c.font = "18px Arial";
            c.fillStyle = letterColor;
            c.fillText("Warning: " + omittedNotes + " notes omitted.", 40, 400);
        }
        
    
    });

    
    
}

function drawGrid(c, gridColor, letterColor){
    
    var noteLetters = ["C", "D", "E", "F", "G", "A", "B",
                    "C", "D", "E", "F", "G", "A", "B", "C"]

    c.font = "18px Arial";
    c.fillStyle = letterColor;
    for (var i = 0; i < noteLetters.length; i+=1){
        var y = i * bh + (p + 7)
        c.fillText(noteLetters[i], bh, y);
    }
    
    c.beginPath();
    for (var x = 0; x < gw+1; x+=bw) {
        c.moveTo(0.5 + x + p, p);
        c.lineTo(0.5 + x + p, gh + p);
    }
    for (var y = 0; y < gh+1; y+=bh) {
        c.moveTo(p, 0.5 + y + p);
        c.lineTo(gw + p, 0.5 + y + p);
    }
    c.strokeStyle = gridColor;
    c.stroke();
}


function placeNote(c, notePlacement, noteValue, noteColor){
    console.log(notePlacement)
    console.log(noteValue)
    var xpos = notePlacement + p; // change to calculated formula once you find one that works
    var ypos = noteValue*-bh + (gh + 2*bh); // change to calculated formula once you find one that works
    console.log("Xpos: " + xpos);
    console.log("Ypos: " + ypos);
    drawCircle(c, xpos, ypos, 7, noteColor)



    /*
    var yPosition = noteValue; // change to calculated formula once you find one that works
    var xPosition = notePlacement; // change to calculated formula once you find one that works
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(100, yPosition, 4); // change this to xPosition when you figure it out
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
    //console.log("Note should be visible on screen.");
    */
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


/* Discarded code:

        var xPosition;
        var xSum;
        if (typeof xSum === 'undefined') { // if this is the first note placed
            xPosition = 0;
            console.log("First note x position set.")
        }
        else {
            xPosition = xSum + Math.floor(deltaTime/4);
        } 
        xSum = xPosition;

*/