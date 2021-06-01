/*
Author: Erin
Created: 4/20/21
Modified: 4/21/21 parse events in MIDI data

TODO: Find a way to determine which MIDI event is events and which is title
TODO: Add support for multiple tracks
*/

function onLoad(midiData) {
    console.log("load successful");
    
    // select the INPUT element that will handle
    // the file selection.
    let source = document.getElementById("filereader");
    
MidiParser.parse(source, function (obj) {
console.log(obj);

// is number of elements in "data" array a good way to tell what events are notes?


var firstNote;
var events = obj.track[1].event;
for (var i = 0; i < events.length; i++)
{
    console.log("Checking for the first note...");
    if (Array.isArray(events[i].data)) { // Once we find a note, break the loop.
        firstNote = i;
        console.log("Found first note at index " + firstNote);
        break;
    }
}
console.log("Time to process events.");


for (var i = firstNote; i < events.length-1; i++)
{
    var currEvent = events[i];
    if (currEvent.data[1] !=0 ) { // if it's a 'note on' event, place it; otherwise ignore it
        console.log(currEvent);
        placeNote(currEvent.data[0], currEvent[0])
    }
}

// initialize note grid (don't implement yet)
// for each note in track chunk
    // display small circle in canvas
    // use timedelta and note value to determine position

});
}



function placeNote(value, deltaTime, stage){
    var stage = new createjs.Stage("demoCanvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 4);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
    //console.log("Note placed.");
}