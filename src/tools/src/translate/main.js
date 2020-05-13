#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "glob", "path", "yargs", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", "@angular/localize/src/tools/src/translate/translator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var glob = require("glob");
    var path_1 = require("path");
    var yargs = require("yargs");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    var asset_translation_handler_1 = require("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler");
    var output_path_1 = require("@angular/localize/src/tools/src/translate/output_path");
    var source_file_translation_handler_1 = require("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler");
    var translation_loader_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_loader");
    var simple_json_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser");
    var xliff1_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser");
    var xliff2_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser");
    var xtb_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser");
    var translator_1 = require("@angular/localize/src/tools/src/translate/translator");
    if (require.main === module) {
        var args = process.argv.slice(2);
        var options = yargs
            .option('r', {
            alias: 'root',
            required: true,
            describe: 'The root path of the files to translate, either absolute or relative to the current working directory. E.g. `dist/en`.',
        })
            .option('s', {
            alias: 'source',
            required: true,
            describe: 'A glob pattern indicating what files to translate, relative to the `root` path. E.g. `bundles/**/*`.',
        })
            .option('l', {
            alias: 'source-locale',
            describe: 'The source locale of the application. If this is provided then a copy of the application will be created with no translation but just the `$localize` calls stripped out.',
        })
            .option('t', {
            alias: 'translations',
            required: true,
            array: true,
            describe: 'A list of paths to the translation files to load, either absolute or relative to the current working directory.\n' +
                'E.g. `-t src/locale/messages.en.xlf src/locale/messages.fr.xlf src/locale/messages.de.xlf`.\n' +
                'If you want to merge multiple translation files for each locale, then provide the list of files in an array.\n' +
                'Note that the arrays must be in double quotes if you include any whitespace within the array.\n' +
                'E.g. `-t "[src/locale/messages.en.xlf, src/locale/messages-2.en.xlf]" [src/locale/messages.fr.xlf,src/locale/messages-2.fr.xlf]`',
        })
            .option('target-locales', {
            array: true,
            describe: 'A list of target locales for the translation files, which will override any target locale parsed from the translation file.\n' +
                'E.g. "-t en fr de".',
        })
            .option('o', {
            alias: 'outputPath',
            required: true,
            describe: 'A output path pattern to where the translated files will be written. The marker `{{LOCALE}}` will be replaced with the target locale. E.g. `dist/{{LOCALE}}`.'
        })
            .option('m', {
            alias: 'missingTranslation',
            describe: 'How to handle missing translations.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
        })
            .option('d', {
            alias: 'duplicateTranslation',
            describe: 'How to handle duplicate translations.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
        })
            .strict()
            .help()
            .parse(args);
        var sourceRootPath = options['r'];
        var sourceFilePaths = glob.sync(options['s'], { absolute: true, cwd: sourceRootPath, nodir: true });
        var translationFilePaths = convertArraysFromArgs(options['t']);
        var outputPathFn = output_path_1.getOutputPathFn(options['o']);
        var diagnostics = new diagnostics_1.Diagnostics();
        var missingTranslation = options['m'];
        var duplicateTranslation = options['d'];
        var sourceLocale = options['l'];
        var translationFileLocales = options['target-locales'] || [];
        translateFiles({
            sourceRootPath: sourceRootPath,
            sourceFilePaths: sourceFilePaths,
            translationFilePaths: translationFilePaths,
            translationFileLocales: translationFileLocales,
            outputPathFn: outputPathFn,
            diagnostics: diagnostics,
            missingTranslation: missingTranslation,
            duplicateTranslation: duplicateTranslation,
            sourceLocale: sourceLocale
        });
        diagnostics.messages.forEach(function (m) { return console.warn(m.type + ": " + m.message); });
        process.exit(diagnostics.hasErrors ? 1 : 0);
    }
    function translateFiles(_a) {
        var sourceRootPath = _a.sourceRootPath, sourceFilePaths = _a.sourceFilePaths, translationFilePaths = _a.translationFilePaths, translationFileLocales = _a.translationFileLocales, outputPathFn = _a.outputPathFn, diagnostics = _a.diagnostics, missingTranslation = _a.missingTranslation, duplicateTranslation = _a.duplicateTranslation, sourceLocale = _a.sourceLocale;
        var translationLoader = new translation_loader_1.TranslationLoader([
            new xliff2_translation_parser_1.Xliff2TranslationParser(),
            new xliff1_translation_parser_1.Xliff1TranslationParser(),
            new xtb_translation_parser_1.XtbTranslationParser(),
            new simple_json_translation_parser_1.SimpleJsonTranslationParser(),
        ], duplicateTranslation, diagnostics);
        var resourceProcessor = new translator_1.Translator([
            new source_file_translation_handler_1.SourceFileTranslationHandler({ missingTranslation: missingTranslation }),
            new asset_translation_handler_1.AssetTranslationHandler(),
        ], diagnostics);
        // Convert all the `translationFilePaths` elements to arrays.
        var translationFilePathsArrays = translationFilePaths.map(function (filePaths) { return Array.isArray(filePaths) ? filePaths : [filePaths]; });
        var translations = translationLoader.loadBundles(translationFilePathsArrays, translationFileLocales);
        sourceRootPath = path_1.resolve(sourceRootPath);
        resourceProcessor.translateFiles(sourceFilePaths, sourceRootPath, outputPathFn, translations, sourceLocale);
    }
    exports.translateFiles = translateFiles;
    /**
     * Parse each of the given string `args` and convert it to an array if it is of the form
     * `[abc, def, ghi]`, i.e. it is enclosed in square brackets with comma delimited items.
     * @param args The string to potentially convert to arrays.
     */
    function convertArraysFromArgs(args) {
        return args.map(function (arg) { return (arg.startsWith('[') && arg.endsWith(']')) ?
            arg.slice(1, -1).split(',').map(function (arg) { return arg.trim(); }) :
            arg; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsMkVBQXVFO0lBQ3ZFLDZIQUFnRjtJQUNoRixxRkFBNEQ7SUFDNUQsMElBQTRGO0lBQzVGLHFIQUF5RTtJQUN6RSxpS0FBbUg7SUFDbkgsdUpBQTBHO0lBQzFHLHVKQUEwRztJQUMxRyxpSkFBb0c7SUFDcEcsbUZBQXdDO0lBRXhDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQ1QsS0FBSzthQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLHdIQUF3SDtTQUM3SCxDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osc0dBQXNHO1NBQzNHLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGVBQWU7WUFDdEIsUUFBUSxFQUNKLDJLQUEySztTQUNoTCxDQUFDO2FBRUQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQ0osbUhBQW1IO2dCQUNuSCwrRkFBK0Y7Z0JBQy9GLGdIQUFnSDtn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LElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDLENBQUMsQ0FBQztZQUNwRCxHQUFHLEVBRkEsQ0FFQSxDQUFDLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3ksIERpYWdub3N0aWNzfSBmcm9tICcuLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0Fzc2V0VHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtnZXRPdXRwdXRQYXRoRm4sIE91dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1NvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vc291cmNlX2ZpbGVzL3NvdXJjZV9maWxlX3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkxvYWRlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9sb2FkZXInO1xuaW1wb3J0IHtTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMV90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjJUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYdGJUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3h0Yl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtUcmFuc2xhdG9yfSBmcm9tICcuL3RyYW5zbGF0b3InO1xuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgY29uc3Qgb3B0aW9ucyA9XG4gICAgICB5YXJnc1xuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdzJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBnbG9iIHBhdHRlcm4gaW5kaWNhdGluZyB3aGF0IGZpbGVzIHRvIHRyYW5zbGF0ZSwgcmVsYXRpdmUgdG8gdGhlIGByb290YCBwYXRoLiBFLmcuIGBidW5kbGVzLyoqLypgLicsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ2wnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZS1sb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1RoZSBzb3VyY2UgbG9jYWxlIG9mIHRoZSBhcHBsaWNhdGlvbi4gSWYgdGhpcyBpcyBwcm92aWRlZCB0aGVuIGEgY29weSBvZiB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBjcmVhdGVkIHdpdGggbm8gdHJhbnNsYXRpb24gYnV0IGp1c3QgdGhlIGAkbG9jYWxpemVgIGNhbGxzIHN0cmlwcGVkIG91dC4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCd0Jywge1xuICAgICAgICAgICAgYWxpYXM6ICd0cmFuc2xhdGlvbnMnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgcGF0aHMgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVzIHRvIGxvYWQsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBgLXQgc3JjL2xvY2FsZS9tZXNzYWdlcy5lbi54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5kZS54bGZgLlxcbicgK1xuICAgICAgICAgICAgICAgICdJZiB5b3Ugd2FudCB0byBtZXJnZSBtdWx0aXBsZSB0cmFuc2xhdGlvbiBmaWxlcyBmb3IgZWFjaCBsb2NhbGUsIHRoZW4gcHJvdmlkZSB0aGUgbGlzdCBvZiBmaWxlcyBpbiBhbiBhcnJheS5cXG4nICtcbiAgICAgICAgICAgICAgICAnTm90ZSB0aGF0IHRoZSBhcnJheXMgbXVzdCBiZSBpbiBkb3VibGUgcXVvdGVzIGlmIHlvdSBpbmNsdWRlIGFueSB3aGl0ZXNwYWNlIHdpdGhpbiB0aGUgYXJyYXkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0UuZy4gYC10IFwiW3NyYy9sb2NhbGUvbWVzc2FnZXMuZW4ueGxmLCBzcmMvbG9jYWxlL21lc3NhZ2VzLTIuZW4ueGxmXVwiIFtzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZixzcmMvbG9jYWxlL21lc3NhZ2VzLTIuZnIueGxmXWAnLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCd0YXJnZXQtbG9jYWxlcycsIHtcbiAgICAgICAgICAgIGFycmF5OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgbGlzdCBvZiB0YXJnZXQgbG9jYWxlcyBmb3IgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLCB3aGljaCB3aWxsIG92ZXJyaWRlIGFueSB0YXJnZXQgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSB0cmFuc2xhdGlvbiBmaWxlLlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIFwiLXQgZW4gZnIgZGVcIi4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdvJywge1xuICAgICAgICAgICAgYWxpYXM6ICdvdXRwdXRQYXRoJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0Egb3V0cHV0IHBhdGggcGF0dGVybiB0byB3aGVyZSB0aGUgdHJhbnNsYXRlZCBmaWxlcyB3aWxsIGJlIHdyaXR0ZW4uIFRoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLiBgZGlzdC97e0xPQ0FMRX19YC4nXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ20nLCB7XG4gICAgICAgICAgICBhbGlhczogJ21pc3NpbmdUcmFuc2xhdGlvbicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0hvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignZCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnZHVwbGljYXRlVHJhbnNsYXRpb24nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIGR1cGxpY2F0ZSB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLnN0cmljdCgpXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnNbJ3InXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID1cbiAgICAgIGdsb2Iuc3luYyhvcHRpb25zWydzJ10sIHthYnNvbHV0ZTogdHJ1ZSwgY3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHM6IChzdHJpbmd8c3RyaW5nW10pW10gPSBjb252ZXJ0QXJyYXlzRnJvbUFyZ3Mob3B0aW9uc1sndCddKTtcbiAgY29uc3Qgb3V0cHV0UGF0aEZuID0gZ2V0T3V0cHV0UGF0aEZuKG9wdGlvbnNbJ28nXSk7XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gIGNvbnN0IG1pc3NpbmdUcmFuc2xhdGlvbjogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3kgPSBvcHRpb25zWydtJ107XG4gIGNvbnN0IGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSA9IG9wdGlvbnNbJ2QnXTtcbiAgY29uc3Qgc291cmNlTG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkID0gb3B0aW9uc1snbCddO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiBzdHJpbmdbXSA9IG9wdGlvbnNbJ3RhcmdldC1sb2NhbGVzJ10gfHwgW107XG5cbiAgdHJhbnNsYXRlRmlsZXMoe1xuICAgIHNvdXJjZVJvb3RQYXRoLFxuICAgIHNvdXJjZUZpbGVQYXRocyxcbiAgICB0cmFuc2xhdGlvbkZpbGVQYXRocyxcbiAgICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzLFxuICAgIG91dHB1dFBhdGhGbixcbiAgICBkaWFnbm9zdGljcyxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb24sXG4gICAgZHVwbGljYXRlVHJhbnNsYXRpb24sXG4gICAgc291cmNlTG9jYWxlXG4gIH0pO1xuXG4gIGRpYWdub3N0aWNzLm1lc3NhZ2VzLmZvckVhY2gobSA9PiBjb25zb2xlLndhcm4oYCR7bS50eXBlfTogJHttLm1lc3NhZ2V9YCkpO1xuICBwcm9jZXNzLmV4aXQoZGlhZ25vc3RpY3MuaGFzRXJyb3JzID8gMSA6IDApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZpbGVzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nXG4gICAqIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmBcbiAgICovXG4gIHNvdXJjZVJvb3RQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguXG4gICAqL1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcGF0aHMgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVzIHRvIGxvYWQsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudFxuICAgKiB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICpcbiAgICogRm9yIGVhY2ggbG9jYWxlIHRvIGJlIHRyYW5zbGF0ZWQsIHRoZXJlIHNob3VsZCBiZSBhbiBlbGVtZW50IGluIGB0cmFuc2xhdGlvbkZpbGVQYXRoc2AuXG4gICAqIEVhY2ggZWxlbWVudCBpcyBlaXRoZXIgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgdHJhbnNsYXRpb24gZmlsZSwgb3IgYW4gYXJyYXkgb2YgYWJzb2x1dGUgcGF0aHNcbiAgICogdG8gdHJhbnNsYXRpb24gZmlsZXMsIGZvciB0aGF0IGxvY2FsZS5cbiAgICpcbiAgICogSWYgdGhlIGVsZW1lbnQgY29udGFpbnMgbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBmaWxlLCB0aGVuIHRoZSB0cmFuc2xhdGlvbnMgYXJlIG1lcmdlZC5cbiAgICpcbiAgICogSWYgYWxsb3dlZCBieSB0aGUgYGR1cGxpY2F0ZVRyYW5zbGF0aW9uYCBwcm9wZXJ0eSwgd2hlbiBtb3JlIHRoYW4gb25lIHRyYW5zbGF0aW9uIGhhcyB0aGUgc2FtZVxuICAgKiBtZXNzYWdlIGlkLCB0aGUgbWVzc2FnZSBmcm9tIHRoZSBlYXJsaWVyIHRyYW5zbGF0aW9uIGZpbGUgaW4gdGhlIGFycmF5IGlzIHVzZWQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgZmlsZXMgYXJlIGBbYXBwLnhsZiwgbGliLTEueGxmLCBsaWItMi54bGlmXWAgdGhlbiBhIG1lc3NhZ2UgdGhhdCBhcHBlYXJzIGluXG4gICAqIGBhcHAueGxmYCB3aWxsIG92ZXJyaWRlIHRoZSBzYW1lIG1lc3NhZ2UgaW4gYGxpYi0xLnhsZmAgb3IgYGxpYi0yLnhsZmAuXG4gICAqL1xuICB0cmFuc2xhdGlvbkZpbGVQYXRoczogKHN0cmluZ3xzdHJpbmdbXSlbXTtcbiAgLyoqXG4gICAqIEEgY29sbGVjdGlvbiBvZiB0aGUgdGFyZ2V0IGxvY2FsZXMgZm9yIHRoZSB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogSWYgdGhlcmUgaXMgYSBsb2NhbGUgcHJvdmlkZWQgaW4gYHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNgIHRoZW4gdGhpcyBpcyB1c2VkIHJhdGhlciB0aGFuIGFcbiAgICogbG9jYWxlIGV4dHJhY3RlZCBmcm9tIHRoZSBmaWxlIGl0c2VsZi5cbiAgICogSWYgdGhlcmUgaXMgbmVpdGhlciBhIHByb3ZpZGVkIGxvY2FsZSBub3IgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIHRoZW4gYW4gZXJyb3IgaXNcbiAgICogdGhyb3duLlxuICAgKiBJZiB0aGVyZSBhcmUgYm90aCBhIHByb3ZpZGVkIGxvY2FsZSBhbmQgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIGFuZCB0aGV5IGFyZSBub3QgdGhlXG4gICAqIHNhbWUsIHRoZW4gYSB3YXJuaW5nIGlzIHJlcG9ydGVkLlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW107XG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgdGhlIG91dHB1dCBwYXRoIG9mIHdoZXJlIHRoZSB0cmFuc2xhdGVkIGZpbGVzIHdpbGwgYmUgd3JpdHRlbi5cbiAgICogVGhlIG1hcmtlciBge3tMT0NBTEV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0YXJnZXQgbG9jYWxlLiBFLmcuIGBkaXN0L3t7TE9DQUxFfX1gLlxuICAgKi9cbiAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm47XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdGhhdCB3aWxsIHJlY2VpdmUgYW55IGRpYWdub3N0aWNzIG1lc3NhZ2VzIGR1ZSB0byB0aGUgcHJvY2Vzc2luZy5cbiAgICovXG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBkdXBsaWNhdGUgdHJhbnNsYXRpb25zLlxuICAgKi9cbiAgZHVwbGljYXRlVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICAvKipcbiAgICogVGhlIGxvY2FsZSBvZiB0aGUgc291cmNlIGZpbGVzLlxuICAgKiBJZiB0aGlzIGlzIHByb3ZpZGVkIHRoZW4gYSBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgd2l0aCBubyB0cmFuc2xhdGlvbiBidXQganVzdFxuICAgKiB0aGUgYCRsb2NhbGl6ZWAgY2FsbHMgc3RyaXBwZWQgb3V0LlxuICAgKi9cbiAgc291cmNlTG9jYWxlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlRmlsZXMoe1xuICBzb3VyY2VSb290UGF0aCxcbiAgc291cmNlRmlsZVBhdGhzLFxuICB0cmFuc2xhdGlvbkZpbGVQYXRocyxcbiAgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyxcbiAgb3V0cHV0UGF0aEZuLFxuICBkaWFnbm9zdGljcyxcbiAgbWlzc2luZ1RyYW5zbGF0aW9uLFxuICBkdXBsaWNhdGVUcmFuc2xhdGlvbixcbiAgc291cmNlTG9jYWxlXG59OiBUcmFuc2xhdGVGaWxlc09wdGlvbnMpIHtcbiAgY29uc3QgdHJhbnNsYXRpb25Mb2FkZXIgPSBuZXcgVHJhbnNsYXRpb25Mb2FkZXIoXG4gICAgICBbXG4gICAgICAgIG5ldyBYbGlmZjJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFh0YlRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgIF0sXG4gICAgICBkdXBsaWNhdGVUcmFuc2xhdGlvbiwgZGlhZ25vc3RpY3MpO1xuXG4gIGNvbnN0IHJlc291cmNlUHJvY2Vzc29yID0gbmV3IFRyYW5zbGF0b3IoXG4gICAgICBbXG4gICAgICAgIG5ldyBTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyKHttaXNzaW5nVHJhbnNsYXRpb259KSxcbiAgICAgICAgbmV3IEFzc2V0VHJhbnNsYXRpb25IYW5kbGVyKCksXG4gICAgICBdLFxuICAgICAgZGlhZ25vc3RpY3MpO1xuXG4gIC8vIENvbnZlcnQgYWxsIHRoZSBgdHJhbnNsYXRpb25GaWxlUGF0aHNgIGVsZW1lbnRzIHRvIGFycmF5cy5cbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHNBcnJheXMgPVxuICAgICAgdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKGZpbGVQYXRocyA9PiBBcnJheS5pc0FycmF5KGZpbGVQYXRocykgPyBmaWxlUGF0aHMgOiBbZmlsZVBhdGhzXSk7XG5cbiAgY29uc3QgdHJhbnNsYXRpb25zID1cbiAgICAgIHRyYW5zbGF0aW9uTG9hZGVyLmxvYWRCdW5kbGVzKHRyYW5zbGF0aW9uRmlsZVBhdGhzQXJyYXlzLCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzKTtcbiAgc291cmNlUm9vdFBhdGggPSByZXNvbHZlKHNvdXJjZVJvb3RQYXRoKTtcbiAgcmVzb3VyY2VQcm9jZXNzb3IudHJhbnNsYXRlRmlsZXMoXG4gICAgICBzb3VyY2VGaWxlUGF0aHMsIHNvdXJjZVJvb3RQYXRoLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9ucywgc291cmNlTG9jYWxlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSBlYWNoIG9mIHRoZSBnaXZlbiBzdHJpbmcgYGFyZ3NgIGFuZCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5IGlmIGl0IGlzIG9mIHRoZSBmb3JtXG4gKiBgW2FiYywgZGVmLCBnaGldYCwgaS5lLiBpdCBpcyBlbmNsb3NlZCBpbiBzcXVhcmUgYnJhY2tldHMgd2l0aCBjb21tYSBkZWxpbWl0ZWQgaXRlbXMuXG4gKiBAcGFyYW0gYXJncyBUaGUgc3RyaW5nIHRvIHBvdGVudGlhbGx5IGNvbnZlcnQgdG8gYXJyYXlzLlxuICovXG5mdW5jdGlvbiBjb252ZXJ0QXJyYXlzRnJvbUFyZ3MoYXJnczogc3RyaW5nW10pOiAoc3RyaW5nfHN0cmluZ1tdKVtdIHtcbiAgcmV0dXJuIGFyZ3MubWFwKFxuICAgICAgYXJnID0+IChhcmcuc3RhcnRzV2l0aCgnWycpICYmIGFyZy5lbmRzV2l0aCgnXScpKSA/XG4gICAgICAgICAgYXJnLnNsaWNlKDEsIC0xKS5zcGxpdCgnLCcpLm1hcChhcmcgPT4gYXJnLnRyaW0oKSkgOlxuICAgICAgICAgIGFyZyk7XG59Il19