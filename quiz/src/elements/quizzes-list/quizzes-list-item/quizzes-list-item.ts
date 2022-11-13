import './quizzes-list-item.scss';
import { ElementBuilder } from '../../../shared/element-builder';
import { Quiz } from '../../../shared/quiz';
import { QuizManager } from '../../../shared/quiz-manager';

export const quizIdAttr = 'quizid';
export class QuizzesListItem extends HTMLElement {
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

    public openQuizSetupPage(): void {
        console.log(this.quiz);
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
            .withEventHandler('click', this.openQuizSetupPage.bind(this))
            .withText('Open')
            .build();

        const article = ElementBuilder
            .make('article')
            .withClassName('quiz-list-item')
            .withChild(title)
            .withChild(description)
            .withChild(openQuizButton)
            .build();

        this.innerHTML = '';
        this.append(article);
    }
}
