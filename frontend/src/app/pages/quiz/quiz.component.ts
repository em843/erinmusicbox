import { Component } from '@angular/core';
import { QuizNode, QuizService } from '../../services/quiz.service';
import { CardComponent } from 'src/app/components/card/card.component';


@Component({
  selector: 'app-quiz',
  templateUrl: 'quiz.component.html',
  styles: [
    `
      .quiz-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      h2 {
        margin-bottom: 20px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li button {
        margin-top: 10px;
      }
    `,
  ],
})
export class QuizComponent {
  currentNode: QuizNode;
  currentNodeKey: string;
  song: string = '';
  submitted: boolean = false;

  constructor(private quizService: QuizService) {
    this.loadCurrentNode();
  }

  loadCurrentNode() {
    this.currentNode = this.quizService.getCurrentNode();
    this.currentNodeKey = this.quizService.getCurrentNodeKey();
  }

  selectOption(nextNode: string | undefined): void {
    if (nextNode) {
      this.quizService.goToNextNode(nextNode);
      this.loadCurrentNode();
      console.log(this.currentNodeKey);
    } else {
      // Handle end of quiz
    }
  }

  getEncodedSearchUrl(): string {
    const baseUrl = 'https://www.google.com/search?q=';
    const query = encodeURIComponent(`${this.song} music box`);
    return `${baseUrl}${query}`;
  }

  onSubmit() {
    this.submitted = true;
  }
}
