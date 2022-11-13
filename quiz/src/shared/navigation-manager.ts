import { encodeGetParams } from './encode-get-params';

export class NavigationManager {
    private static readonly base = import.meta.env.BASE_URL;
    // https://stackoverflow.com/a/901144/7132461
    public static readonly params: Record<string, string> = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop as string),
    }) as unknown as Record<string, string>;

    public static openQuizSetupPage(quizId: number): void {
        this.navigateByUrl('setup', { quizId });
    }

    private static navigateByUrl(relativeUrl: string, parameters: Record<string, string | number>): void {
        const absoluteUrl = `${location.origin}${NavigationManager.base}${relativeUrl}`;
        const encodedParams = encodeGetParams(parameters);

        location.assign(`${absoluteUrl}/?${encodedParams}`);
    }
}
