import { Component } from '@angular/core';
import { QuizNode, QuizService } from '../../services/quiz.service';

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

  constructor(private quizService: QuizService) {
    this.currentNode = this.quizService.getCurrentNode();
  }

  selectOption(nextNode: string | undefined): void {
    if (nextNode) {
      this.quizService.goToNextNode(nextNode);
      this.currentNode = this.quizService.getCurrentNode();
    } else {
      // Handle end of quiz
    }
  }
}
