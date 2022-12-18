import { Quiz } from './quiz';

export class QuizManager {
    private static readonly quizKeyPrefix = 'Q';
    private static currentQuestionId = Number(sessionStorage.getItem('currentQuestionId')) ?? 0;

    public static save(quiz: Quiz): void {
        const key = QuizManager.getQuizStorageKey(quiz.id);
        const value = JSON.stringify(quiz);

        localStorage.setItem(key, value);
    }

    public static read(quizId: number): Quiz {
        const key = QuizManager.getQuizStorageKey(quizId);
        const value = localStorage.getItem(key)!; // TODO: Add error handling

        return JSON.parse(value); // TODO: Add cache to save CPU on JSON parsing
    }

    public static loadAll(): Quiz[] {
        return Object
            .keys(localStorage)
            .filter(key => key.startsWith(this.quizKeyPrefix))
            .map(quizKey => localStorage.getItem(quizKey)!)
            .map(json => JSON.parse(json));
    }

    public static get nextQuizId() {
        sessionStorage.setItem('currentQuestionId', String(++this.currentQuestionId));
        return this.currentQuestionId;
    }

    private static getQuizStorageKey(quizId: number): string {
        return `${this.quizKeyPrefix}${quizId}`;
    }
}
