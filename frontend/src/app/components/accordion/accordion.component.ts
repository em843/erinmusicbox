import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  faqs = [
    {
      question: 'How to use this tool?',
      answer: 'Instructions on using the tool...',
    },
    {
      question: 'How to upload MIDI files?',
      answer: 'Steps to upload MIDI files...',
    },
    // Add more FAQs as needed
  ];
}
