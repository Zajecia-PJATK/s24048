import { QuizQuestion } from '../quiz-question';
import { ElementBuilder } from '../../../shared/element-builder';
import { Question } from '../../../shared/question';
import { QuestionType } from '../../../shared/question-type';

export class SingleChoiceQuestion extends QuizQuestion {
    protected readonly question: Question = {shuffle: false, time: 0, type: QuestionType.singleChoice};

    protected render(): void {
        this.append(ElementBuilder.make('h1').withText('question').build())
    }

}
