import { quizIdAttr, QuizPreview } from '../../elements/quiz-preview/quiz-preview';
import { NavigationManager } from '../../shared/navigation-manager';

customElements.define('quiz-preview', QuizPreview);

const quizPreview = document.querySelector('quiz-preview')!;
const { quizId } = NavigationManager.params;

quizPreview.setAttribute(quizIdAttr, quizId);
