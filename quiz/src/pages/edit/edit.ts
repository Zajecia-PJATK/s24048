import { ElementBuilder } from '../../shared/element-builder';
import { NavigationManager } from '../../shared/navigation-manager';
import { ReactiveInput } from '../../elements/reactive-input/reactive-input';
import { Attrs } from '../../elements/attrs';
import { Quiz } from '../../shared/quiz';
import { QuizManager } from '../../shared/quiz-manager';
import { getQuestionTypeName, QuestionType } from '../../shared/question-type';
import { QuizQuestion } from '../../elements/quiz-question/quiz-question';
import { SingleChoiceQuestion } from '../../elements/quiz-question/single-choice-question/single-choice-question';

customElements.define('reactive-input', ReactiveInput);
customElements.define('single-choice-question', SingleChoiceQuestion);

const section = document.querySelector('section')!;

const h1 = ElementBuilder
    .make('h1')
    .withText(NavigationManager.params['new'] !== null ? 'Create quiz' : 'Edit quiz')
    .build();

const titleInput = new ReactiveInput()
    .addClass('full-width')
    .addClass('narrow')
    .setAttr(Attrs.label, 'Title')
    .setAttr(Attrs.storage, 'current.quiz.title')
    .setAttr(Attrs.type, 'text');

const descriptionInput = new ReactiveInput()
    .addClass('full-width')
    .addClass('narrow')
    .setAttr(Attrs.label, 'Description')
    .setAttr(Attrs.storage, 'current.quiz.description')
    .setAttr(Attrs.type, 'textarea');

const submit = ElementBuilder
    .make('button')
    .withAttr('type', 'submit')
    .withClassName('button')
    .withText('Add')
    .build();

const questionTypeSelectOptions = Object
    .keys(QuestionType)
    .map(Number)
    .filter(v => !isNaN(v))
    .map(v => ElementBuilder
        .make('option')
        .withAttr('value', String(v))
        .withText(getQuestionTypeName(v))
        .build()
    );

const questions: QuizQuestion[] = [];
const addQuestionSection = ElementBuilder
    .make('section')
    .withClassName('add-question')
    .withChild(ElementBuilder
        .make('select')
        .withChildren(questionTypeSelectOptions)
        .build()
    )
    .withChild(ElementBuilder
        .make('button')
        .withText('Add question')
        .withEventHandler('click', event => {
            event.preventDefault();
            questions.push(new SingleChoiceQuestion());
            render();
        })
        .build()
    )
    .build();

const render = () => {
    section.innerHTML = '';

    const form = ElementBuilder
        .make('form')
        .withClassName('full-width')
        .withChild(titleInput)
        .withChild(descriptionInput)
        .withChild(addQuestionSection)
        .withChild(ElementBuilder
            .make('section')
            .withClassName('questions')
            .withChildren(questions)
            .build()
        )
        .withChild(submit)
        .withEventHandler('submit', event => {
            event.preventDefault();
            const id = Math.trunc(Math.random() * 100 + 1);

            const quiz: Quiz = {
                description: descriptionInput.querySelector('textarea')!.value,
                id,
                name: titleInput.querySelector('input')!.value
            };

            QuizManager.save(quiz);

            localStorage.removeItem('current.quiz.title');
            localStorage.removeItem('current.quiz.description');

            NavigationManager.goToHome();
        })
        .build();


    section
        .append(h1, form);
};

render();
