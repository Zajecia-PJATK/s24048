import { BoldItalicStrikethroughParser } from './markdown/bold-italic-strikethrough-parser';

export class MarkdownMapper {
    public static md2html(md: string): string {
        return new BoldItalicStrikethroughParser(md)
            .parseBoldItalicStrikethrough()
            .parseQuotesLists()
            .parseHeadersHorizontalLine();
    }
}
