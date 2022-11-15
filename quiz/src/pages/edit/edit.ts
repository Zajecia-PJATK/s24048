import { Quiz } from '../../shared/quiz';
import { QuizManager } from '../../shared/quiz-manager';

const button = document.querySelector('button')!;

button.addEventListener('click', () => {
    const id = Math.trunc(Math.random() * 100 + 1);

    const quiz: Quiz = {
        description: 'Sample Quiz Sample Quiz Sample Quiz Sample Quiz Sample Quiz Sample Quiz Sample Quiz Sample Quiz',
        id,
        name: `Quiz #${id}`
    };

    QuizManager.save(quiz);
});
