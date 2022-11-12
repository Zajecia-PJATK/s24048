import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: resolve(__dirname, 'src/pages'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        target: 'esnext',
        rollupOptions: {
            input: {
                home: resolve(__dirname, 'src/pages/index.html'), // List of quizzes
                edit: resolve(__dirname, 'src/pages/edit/index.html'), // Create / edit selected quiz
                quiz: resolve(__dirname, 'src/pages/quiz/index.html'), // View quiz summary
                setup: resolve(__dirname, 'src/pages/setup/index.html'), // One time user setup
                question: resolve(__dirname, 'src/pages/question/index.html'), // Question page
                ranking: resolve(__dirname, 'src/pages/ranking/index.html') // View ranking for quiz
            }
        }
    }
});
