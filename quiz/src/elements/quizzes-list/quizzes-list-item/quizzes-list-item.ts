import './quizzes-list-item.scss';
import { ElementBuilder } from '../../../shared/element-builder';
import { Quiz } from '../../../shared/quiz';
import { QuizManager } from '../../../shared/quiz-manager';
import { WebComponent } from '../../web-component';
import { NavigationManager } from '../../../shared/navigation-manager';

export const quizIdAttr = 'quizid';
export class QuizzesListItem extends WebComponent {
    public static readonly observedAttributes = [quizIdAttr];
    private quiz?: Quiz;

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        switch (attr) {
            case quizIdAttr: return this.onQuizIdChange(parseInt(newValue));
        }
    }

    public setQuizId(quizId: number): QuizzesListItem {
        this.setAttribute(quizIdAttr, `${quizId}`);
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
