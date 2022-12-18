import { QuizQuestion } from '../elements/quiz-question/quiz-question';
import { SingleChoiceQuestion } from '../elements/quiz-question/single-choice-question/single-choice-question';
import { MultipleChoiceQuestion } from '../elements/quiz-question/multiple-choice-question/multiple-choice-question';

export enum QuestionType {
    singleChoice,
    multipleChoice,
    trueFalse,
    shortAnswer,
    chooseFromList,
    fillGaps,
    sortElements,
    matchElements,
}

export const getQuestionTypeName = (type: QuestionType): string => {
    switch (type) {
        case QuestionType.singleChoice: return 'Single choice';
        case QuestionType.multipleChoice: return 'Multiple choice';
        case QuestionType.trueFalse: return 'True / false';
        case QuestionType.shortAnswer: return 'Short answer';
        case QuestionType.chooseFromList: return 'Choose from list';
        case QuestionType.fillGaps: return 'Fill gaps';
        case QuestionType.sortElements: return 'Sort elements';
        case QuestionType.matchElements: return 'Match elements';
    }
};

export const getQuestionComponentInstance = (type: QuestionType): QuizQuestion => {
    switch (type) {
        case QuestionType.singleChoice:
            return new SingleChoiceQuestion();
        case QuestionType.multipleChoice:
            return new MultipleChoiceQuestion();
        case QuestionType.trueFalse:
            return new SingleChoiceQuestion();
        case QuestionType.shortAnswer:
            return new SingleChoiceQuestion();
        case QuestionType.chooseFromList:
            return new SingleChoiceQuestion();
        case QuestionType.fillGaps:
            return new SingleChoiceQuestion();
        case QuestionType.sortElements:
            return new SingleChoiceQuestion();
        case QuestionType.matchElements:
            return new SingleChoiceQuestion();
    }
}
