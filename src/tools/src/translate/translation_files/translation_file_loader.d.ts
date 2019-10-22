/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_file_loader" />
import { TranslationBundle } from '../translator';
import { TranslationParser } from './translation_parsers/translation_parser';
/**
 * Use this class to load a collection of translation files from disk.
 */
export declare class TranslationLoader {
    private translationParsers;
    constructor(translationParsers: TranslationParser[]);
    /**
     * Load and parse the translation files into a collection of `TranslationBundles`.
     *
     * @param translationFilePaths A collection of absolute paths to the translation files.
     */
    loadBundles(translationFilePaths: string[]): TranslationBundle[];
}
