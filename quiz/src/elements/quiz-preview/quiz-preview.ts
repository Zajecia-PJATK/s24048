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

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        switch (attr) {
            case Attrs.quizId: return this.onQuizIdChange(parseInt(newValue));
        }
    }

    public setQuizId(quizId: number): QuizPreview {
        this.setAttribute(Attrs.quizId, `${quizId}`);
        return this;
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
