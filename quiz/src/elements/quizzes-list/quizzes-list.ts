import './quizzes-list.scss';
import { QuizPreview } from '../quiz-preview/quiz-preview';
import { ElementBuilder } from '../../shared/element-builder';
import { QuizManager } from '../../shared/quiz-manager';
import { WebComponent } from '../web-component';
import { Attrs } from '../attrs';
import { NavigationManager } from '../../shared/navigation-manager';

export class QuizzesList extends WebComponent {
    constructor() {
        super();

        const quizzesListItems = QuizManager
            .loadAll()
            .map(quiz => new QuizPreview()
                .setAttr(Attrs.quizId, quiz.id)
            );

        this
            .addChild(ElementBuilder
                .make('h2')
                .withText('Quizzes:')
                .build()
            )
            .addChildren(quizzesListItems)
            .addChild(ElementBuilder
                .make('section')
                .withClassName('create-quiz')
                .withChild(ElementBuilder
                    .make('h2')
                    .withText('Create your own quiz!')
                    .build()
                )
                .withChild(ElementBuilder
                    .make('a')
                    .withClassName('button')
                    .withText('Create new quiz')
                    .withAttr('href', NavigationManager.getAbsoluteUrl('edit'))
                    .build()
                )
                .build()
            );
    }
}
