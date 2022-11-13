import './quiz-preview.scss';
import { ElementBuilder } from '../../shared/element-builder';
import { Quiz } from '../../shared/quiz';
import { QuizManager } from '../../shared/quiz-manager';
import { WebComponent } from '../web-component';
import { NavigationManager } from '../../shared/navigation-manager';
import { Attrs } from '../attrs';

export class QuizPreview extends WebComponent {
    public static readonly observedAttributes = [Attrs.quizId];
    private quiz?: Quiz;

    constructor() {
        super();
        this
            .setAttributeHandler(Attrs.quizId, v => this.onQuizIdChange(parseInt(v)));
    }

    private onQuizIdChange(quizId: number) {
        this.quiz = QuizManager.read(quizId);

        const title = ElementBuilder
            .make('span')
            .withClassName('quiz-title')
            .withText(this.quiz.name)
            .build();

        const description = ElementBuilder
            .make('span')
            .withClassName('quiz-description')
            .withText(this.quiz.description)
            .build();

        const openQuizButton = ElementBuilder
            .make<HTMLButtonElement>('button')
            .withEventHandler('click', () => NavigationManager.openQuizSetupPage(this.quiz!.id))
            .withText('Open')
            .build();

        this
            .removeChildren()
            .addChild(title)
            .addChild(description)
            .addChild(openQuizButton)
    }
}