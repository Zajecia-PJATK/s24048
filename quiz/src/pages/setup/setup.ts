import { QuizPreview } from '../../elements/quiz-preview/quiz-preview';
import { NavigationManager } from '../../shared/navigation-manager';
import { Attrs } from '../../elements/attrs';

customElements.define('quiz-preview', QuizPreview);

const quizPreview = document.querySelector('quiz-preview')!;
const { quizId } = NavigationManager.params;

quizPreview.setAttribute(Attrs.quizId, quizId);
