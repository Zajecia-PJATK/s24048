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
