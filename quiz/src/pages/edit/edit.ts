import { ElementBuilder } from '../../shared/element-builder';
import { NavigationManager } from '../../shared/navigation-manager';
import { ReactiveInput } from '../../elements/reactive-input/reactive-input';
import { Attrs } from '../../elements/attrs';
import { Quiz } from '../../shared/quiz';
import { QuizManager } from '../../shared/quiz-manager';

customElements.define('reactive-input', ReactiveInput);

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

const form = ElementBuilder
    .make('form')
    .withClassName('full-width')
    .withChild(titleInput)
    .withChild(descriptionInput)
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
