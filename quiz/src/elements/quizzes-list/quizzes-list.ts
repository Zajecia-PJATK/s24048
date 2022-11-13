import './quizzes-list.scss';
import { QuizPreview } from '../quiz-preview/quiz-preview';
import { Quiz } from '../../shared/quiz';
import { ElementBuilder } from '../../shared/element-builder';
import { QuizManager } from '../../shared/quiz-manager';
import { WebComponent } from '../web-component';

export class QuizzesList extends WebComponent {
    constructor() {
        super();

        const quizzes: Quiz[] = new Array(10).fill(0).map((_, i) => ({
            id: i,
            name: `Quiz #${i}`,
            description: `Sample quiz. Sample quiz. Sample quiz. Sample quiz. Sample quiz. Sample quiz.`
        }));

        quizzes.forEach(QuizManager.save);

        const quizzesListItems = quizzes
            .map(quiz => new QuizPreview().setQuizId(quiz.id));

        this
            .addChild(ElementBuilder
                .make('h2')
                .withText('Quizzes:')
                .build()
            )
            .addChildren(quizzesListItems);
    }
}
