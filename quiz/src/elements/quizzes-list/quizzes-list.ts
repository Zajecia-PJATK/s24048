import './quizzes-list.scss';
import { QuizzesListItem } from './quizzes-list-item/quizzes-list-item';
import { Quiz } from '../../shared/quiz';
import { ElementBuilder } from '../../shared/element-builder';
import { QuizManager } from '../../shared/quiz-manager';

export class QuizzesList extends HTMLElement {
    constructor() {
        super();

        const quizzes: Quiz[] = new Array(10).fill(0).map((_, i) => ({
            id: i,
            name: `Quiz #${i}`,
            description: `Sample quiz. Sample quiz. Sample quiz. Sample quiz. Sample quiz. Sample quiz.`
        }));

        quizzes.forEach(QuizManager.save);

        const quizzesListItems = quizzes
            .map(quiz => new QuizzesListItem().setQuizId(quiz.id));

        const ul = ElementBuilder
            .make<HTMLUListElement>('ul')
            .withChild(ElementBuilder
                .make('h2')
                .withText('Quizzes:')
                .build()
            )
            .withChildren(quizzesListItems)
            .build();

        this.append(ul);
    }
}
