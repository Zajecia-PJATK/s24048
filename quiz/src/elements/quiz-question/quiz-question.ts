import { WebComponent } from '../web-component';
import { Question } from '../../shared/question';

export abstract class QuizQuestion extends WebComponent {
    protected abstract readonly question: Question;

    constructor() {
        super();

        this.render();
    }

    protected abstract render(): void;
}
