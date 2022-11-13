import { Quiz } from './quiz';

export class QuizManager {
    private static readonly quizKeyPrefix = 'Q';

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

    private static getQuizStorageKey(quizId: number): string {
        return `${this.quizKeyPrefix}${quizId}`;
    }
}
