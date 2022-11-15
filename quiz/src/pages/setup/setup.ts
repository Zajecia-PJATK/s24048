import { QuizPreview } from '../../elements/quiz-preview/quiz-preview';
import { NavigationManager } from '../../shared/navigation-manager';
import { Attrs } from '../../elements/attrs';
import { ReactiveInput } from '../../elements/reactive-input/reactive-input';

const quizPreview = document.querySelector('quiz-preview')!;

const { quizId } = NavigationManager.params;
quizPreview.setAttribute(Attrs.quizId, quizId);

addEventListener(ReactiveInput.stateChangeEventType, event => {
    // @ts-ignore
    quizPreview.setAttribute(Attrs.disabled, (!event.detail.valid).toString());
});

customElements.define('quiz-preview', QuizPreview);
customElements.define('reactive-input', ReactiveInput);
