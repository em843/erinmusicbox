import { Component } from '@angular/core';
import { QuizNode, QuizService } from '../../services/quiz.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-quiz',
  template: `
    <div class="quiz-container">
      <h2>{{ currentNode.question }}</h2>
      <ul>
        <li *ngFor="let option of currentNode.options">
          <button (click)="selectOption(option.nextNode)">
            {{ option.answer }}
          </button>
        </li>
      </ul>
    </div>
  `,
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
