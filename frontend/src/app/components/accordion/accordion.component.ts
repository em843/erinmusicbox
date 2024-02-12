import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  faqs = [
    {
      question: 'What does this tool do?',
      answer:
        'Welcome! The Music Box MIDI Visualizer converts MIDI (music note) data into a virtual paper strip for DIY music boxes. You can use the virtual paper strip as a reference when punching holes for your music box. The Visualizer was created as an extension of Music Box Maniacs, enabling users to punch notes in between the lines.',
    },
    {
      question: 'Who should use the Visualizer?',
      answer: `Anyone who has a song with notes that need to be punched in between vertical lines. Some possible use cases are:
        - A tune that has triplets.
        - A tune that has 16th notes.
        - A tune with a tempo of 80 BPM or higher. 
        
        With the Visualizer's 2x note spacing, you can condense a tune to use half the amount of paper and half the turning speed!
        `,
    },
    {
      question: 'How can I use the Visualizer?',
      answer: `1. Click "Select a MIDI File" and upload your .mid or .midi file.\n 2. Use the dropdowns to select your box type, desired spacing, and other settings.\n3. Voila! You now have a reference for your DIY music box. Happy punching!`,
    },
  ];
}
