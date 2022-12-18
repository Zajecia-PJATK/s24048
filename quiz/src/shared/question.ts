import { QuestionType } from './question-type';

export interface Question {
    readonly id: number;
    readonly type: QuestionType;
    time: number;
    shuffle: boolean;
    text: string;
    options: string[];
    correct: string[];
}
