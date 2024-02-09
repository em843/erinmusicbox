import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
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

  openedIndex = -1;

  toggle(index: number): void {
    this.openedIndex = this.openedIndex === index ? -1 : index;
  }
}
