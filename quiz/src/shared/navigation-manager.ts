import { encodeGetParams } from './encode-get-params';

export class NavigationManager {
    private static readonly base = import.meta.env.BASE_URL;

    public static openQuizSetupPage(quizId: number): void {
        this.navigateByUrl('setup', { quizId });
    }

    private static navigateByUrl(relativeUrl: string, parameters: Record<string, string | number>): void {
        const absoluteUrl = `${location.origin}${NavigationManager.base}${relativeUrl}`;
        const encodedParams = encodeGetParams(parameters);

        location.assign(`${absoluteUrl}/?${encodedParams}`);
    }
}
