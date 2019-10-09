#!/usr/bin/env node
/// <amd-module name="@angular/localize/src/tools/src/translate/main" />
import { OutputPathFn } from './output_path';
import { MissingTranslationStrategy } from './source_files/source_file_utils';
import { Diagnostics } from '../diagnostics';
export interface TranslateFilesOptions {
    sourceRootPath: string;
    sourceFilePaths: string[];
    translationFilePaths: string[];
    outputPathFn: OutputPathFn;
    diagnostics: Diagnostics;
    missingTranslation: MissingTranslationStrategy;
}
export declare function translateFiles({ sourceRootPath, sourceFilePaths, translationFilePaths, outputPathFn, diagnostics, missingTranslation }: TranslateFilesOptions): void;
