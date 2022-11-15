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

    public static getAbsoluteUrl(relativeUrl: string, parameters: Record<string, string | number> = {}): string {
        const absoluteUrl = `${location.origin}${NavigationManager.base}${relativeUrl}`;
        const encodedParams = encodeGetParams(parameters);

        return `${absoluteUrl}/?${encodedParams}`;
    }

    public static navigateByUrl(relativeUrl: string, parameters: Record<string, string | number>): void {
        location.assign(this.getAbsoluteUrl(relativeUrl, parameters));
    }

    public static goToHome(): void {
        location.assign(`${location.origin}${NavigationManager.base}`)
    }
}
