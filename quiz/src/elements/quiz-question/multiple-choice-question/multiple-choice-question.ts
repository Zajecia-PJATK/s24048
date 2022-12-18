import { QuizQuestion } from '../quiz-question';
import { Question } from '../../../shared/question';
import { QuizManager } from '../../../shared/quiz-manager';
import { QuestionType } from '../../../shared/question-type';
import { ReactiveSelect } from '../../reactive-inputs/reactive-select/reactive-select';
import { Attrs } from '../../attrs';
import { ElementBuilder } from '../../../shared/element-builder';

export class MultipleChoiceQuestion extends QuizQuestion {
    protected readonly question: Question = {
        id: QuizManager.nextQuizId,
        shuffle: false,
        time: 0,
        type: QuestionType.singleChoice,
        text: 'Select positive colors',
        options: ['black', 'red', 'green', 'blue'],
        correct: ['1m'],
    };

    protected render(): void {
        const answerSelect = new ReactiveSelect()
            .setAttr<ReactiveSelect>(Attrs.type, 'multiple')
            .withInitialState({
                options: this.question.options.map(v => ({text: v, value: v}))
            });

        this.append(
            ElementBuilder
                .make('h1')
                .withText(this.question.text)
                .build(),
            answerSelect
        )
    }
}
