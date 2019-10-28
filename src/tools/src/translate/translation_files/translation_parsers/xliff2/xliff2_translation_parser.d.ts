/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_translation_parser" />
import { ParsedTranslationBundle, TranslationParser } from '../translation_parser';
/**
 * A translation parser that can load translations from XLIFF 2 files.
 *
 * http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
 *
 */
export declare class Xliff2TranslationParser implements TranslationParser {
    canParse(filePath: string, contents: string): boolean;
    parse(filePath: string, contents: string): ParsedTranslationBundle;
}
