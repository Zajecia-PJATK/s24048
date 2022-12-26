import { BoldItalicStrikethroughCodeParser } from './markdown/bold-italic-strikethrough-code-parser';

export class MarkdownMapper {
    public static md2html(md: string): string {
        return new BoldItalicStrikethroughCodeParser(md)
            .parseBoldItalicStrikethroughCode()
            .parseQuotesLists()
            .parseLinksImages()
            .parseHeadersHorizontalLine()
            .replaceAll('\n\n', '<br>');
    }
}
