import './quiz-preview.scss';
import { ElementBuilder } from '../../shared/element-builder';
import { Quiz } from '../../shared/quiz';
import { QuizManager } from '../../shared/quiz-manager';
import { WebComponent } from '../web-component';
import { NavigationManager } from '../../shared/navigation-manager';
import { Attrs } from '../attrs';

export class QuizPreview extends WebComponent {
    public static readonly observedAttributes = [Attrs.quizId, Attrs.type, Attrs.disabled];
    private quiz?: Quiz;
    private type?: string;
    private disabled?: boolean;

    constructor() {
        super();
        this
            .setAttributeHandler(Attrs.quizId, v => { this.quiz = QuizManager.read(parseInt(v)); this.tryRender() })
            .setAttributeHandler(Attrs.type, v => { this.type = v; this.tryRender() })
            .setAttributeHandler(Attrs.disabled, v => { this.disabled = v == 'true'; this.tryRender() });
    }

    private tryRender() {
        !!this.type && !!this.quiz && this.render();
    }

    private render() {
        const title = ElementBuilder
            .make('span')
            .withClassName('quiz-title')
            .withText(this.quiz!.name)
            .build();

        const description = ElementBuilder
            .make('span')
            .withClassName('quiz-description')
            .withText(this.quiz!.description)
            .build();

        const openQuizButton = ElementBuilder
            .make('a')
            .withClassName('button')
            .withClassName('not-rounded')
            .withAttr('href', NavigationManager.getAbsoluteUrl(this.type !== 'setup' ? 'setup' : 'question', {quizId: this.quiz!.id}))
            .withText(this.type === 'setup' ? 'Start' : 'Open');

        if (this.disabled) {
            openQuizButton
                .withoutAttr('href')
                .withClassName('disabled');
        }

        this
            .removeChildren()
            .addChild(title)
            .addChild(description)
            .addChild(openQuizButton.build())

        if (this.type !== 'setup') return;

        this
            .addChild(ElementBuilder
                .make('section')
                .withClassName('details')
                .withChild(ElementBuilder
                    .make('p')
                    .withText('Time to solve: 23 minutes.')
                    .build()
                )
                .build()
            );
    }
}
