import { QuestionType } from './question-type';

export interface Question {
    readonly type: QuestionType;
    time: number;
    shuffle: boolean;
}
