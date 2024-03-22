import { Injectable } from '@angular/core';

export interface QuizNode {
  question: string;
  options: Array<{ answer: string; nextNode?: string }>;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private quizData: { [key: string]: QuizNode } = {
    start: {
      question: "First, let's search for your song online:",
      options: [
        {
          answer: 'I found a box that plays my song!',
          nextNode: 'noDIYNeeded',
        },
        { answer: 'Nothing came up.', nextNode: 'diyConsideration' },
        {
          answer: 'An arrangement came up on MusicBoxManiacs.',
          nextNode: 'arrangementLike',
        },
      ],
    },
    noDIYNeeded: {
      question: 'Yay! No need for a DIY box.',
      options: [],
    },
    arrangementLike: {
      question: 'Do you like it?',
      options: [
        { answer: "It's perfect!", nextNode: 'purchaseDIY' },
        {
          answer:
            'It’s decent, but I want to see what a professional arranger could do',
          nextNode: 'contactForQuote',
        },
        { answer: 'Ehh...', nextNode: 'diyConsideration' },
      ],
    },
    purchaseDIY: {
      question:
        'Wonderful! Purchase a DIY music box and punch out this arrangement.',
      options: [],
    },

    diyConsideration: {
      question: 'Are you okay with a little DIY?',
      options: [
        { answer: 'Yes', nextNode: 'contactForQuote' },
        {
          answer: 'No, and I’d spend over $100 to avoid it.',
          nextNode: 'customMusicBox',
        },
      ],
    },
    contactForQuote: {
      question: 'Contact Erin for a quote.',
      options: [],
    },
    customMusicBox: {
      question:
        'Look into getting a custom music box from Donuma for a timeless gift.',
      options: [],
    },
  };

  //   private previousNode: string = '';
  private currentNode: string = 'start';
  private currentNodeKey = 'start';
  private displayErrorText = false;

  getCurrentNodeKey(): string {
    return this.currentNodeKey;
  }

  constructor() {}

  getCurrentNode(): QuizNode {
    return this.quizData[this.currentNode];
  }

  goToNextNode(nextNode: string): void {
    if (nextNode in this.quizData) {
      // this.previousNode = this.currentNode;
      this.currentNode = nextNode;
      this.currentNodeKey = nextNode;
    } else {
      this.displayErrorText = true;
    }
  }
  //   goToPreviousNode(prevNode: string): void {
  //     if (prevNode in this.quizData) {
  //       this.currentNode = prevNode;
  //       this.currentNodeKey = prevNode;
  //     } else {
  //       this.displayErrorText = true;
  //     }
  //   }
}
