#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system", "glob", "yargs", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", "@angular/localize/src/tools/src/translate/translator"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var glob = require("glob");
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
            describe: 'A output path pattern to where the translated files will be written.\n' +
                'The path must be either absolute or relative to the current working directory.\n' +
                'The marker `{{LOCALE}}` will be replaced with the target locale. E.g. `dist/{{LOCALE}}`.'
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
        var fs = new file_system_1.NodeJSFileSystem();
        file_system_1.setFileSystem(fs);
        var sourceRootPath = options['r'];
        var sourceFilePaths = glob.sync(options['s'], { cwd: sourceRootPath, nodir: true });
        var translationFilePaths = convertArraysFromArgs(options['t']);
        var outputPathFn = output_path_1.getOutputPathFn(fs.resolve(options['o']));
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
        var fs = file_system_1.getFileSystem();
        var translationLoader = new translation_loader_1.TranslationLoader(fs, [
            new xliff2_translation_parser_1.Xliff2TranslationParser(),
            new xliff1_translation_parser_1.Xliff1TranslationParser(),
            new xtb_translation_parser_1.XtbTranslationParser(),
            new simple_json_translation_parser_1.SimpleJsonTranslationParser(),
        ], duplicateTranslation, diagnostics);
        var resourceProcessor = new translator_1.Translator(fs, [
            new source_file_translation_handler_1.SourceFileTranslationHandler(fs, { missingTranslation: missingTranslation }),
            new asset_translation_handler_1.AssetTranslationHandler(fs),
        ], diagnostics);
        // Convert all the `translationFilePaths` elements to arrays.
        var translationFilePathsArrays = translationFilePaths.map(function (filePaths) {
            return Array.isArray(filePaths) ? filePaths.map(function (p) { return fs.resolve(p); }) : [fs.resolve(filePaths)];
        });
        var translations = translationLoader.loadBundles(translationFilePathsArrays, translationFileLocales);
        sourceRootPath = fs.resolve(sourceRootPath);
        resourceProcessor.translateFiles(sourceFilePaths.map(file_system_1.relativeFrom), fs.resolve(sourceRootPath), outputPathFn, translations, sourceLocale);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQXlIO0lBQ3pILDJCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsMkVBQXVFO0lBQ3ZFLDZIQUFnRjtJQUNoRixxRkFBNEQ7SUFDNUQsMElBQTRGO0lBQzVGLHFIQUF5RTtJQUN6RSxpS0FBbUg7SUFDbkgsdUpBQTBHO0lBQzFHLHVKQUEwRztJQUMxRyxpSkFBb0c7SUFDcEcsbUZBQXdDO0lBRXhDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQ1QsS0FBSzthQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLHdIQUF3SDtTQUM3SCxDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osc0dBQXNHO1NBQzNHLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGVBQWU7WUFDdEIsUUFBUSxFQUNKLDJLQUEySztTQUNoTCxDQUFDO2FBRUQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQ0osbUhBQW1IO2dCQUNuSCwrRkFBK0Y7Z0JBQy9GLGdIQUFnSDtn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Y0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFDekYsWUFBWSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQXpDRCx3Q0F5Q0M7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxJQUFjO1FBQzNDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FDWCxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDLENBQUMsQ0FBQztZQUNwRCxHQUFHLEVBRkEsQ0FFQSxDQUFDLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtLCByZWxhdGl2ZUZyb219IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgRGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QXNzZXRUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vYXNzZXRfZmlsZXMvYXNzZXRfdHJhbnNsYXRpb25faGFuZGxlcic7XG5pbXBvcnQge2dldE91dHB1dFBhdGhGbiwgT3V0cHV0UGF0aEZufSBmcm9tICcuL291dHB1dF9wYXRoJztcbmltcG9ydCB7U291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uTG9hZGVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX2xvYWRlcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3NpbXBsZV9qc29uX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1hsaWZmMVRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1hsaWZmMlRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1h0YlRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1RyYW5zbGF0b3J9IGZyb20gJy4vdHJhbnNsYXRvcic7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBjb25zdCBvcHRpb25zID1cbiAgICAgIHlhcmdzXG4gICAgICAgICAgLm9wdGlvbigncicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAncm9vdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmAuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguIEUuZy4gYGJ1bmRsZXMvKiovKmAuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlLWxvY2FsZScsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnVGhlIHNvdXJjZSBsb2NhbGUgb2YgdGhlIGFwcGxpY2F0aW9uLiBJZiB0aGlzIGlzIHByb3ZpZGVkIHRoZW4gYSBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgd2l0aCBubyB0cmFuc2xhdGlvbiBidXQganVzdCB0aGUgYCRsb2NhbGl6ZWAgY2FsbHMgc3RyaXBwZWQgb3V0LicsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ3QnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3RyYW5zbGF0aW9ucycsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGFycmF5OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgbGlzdCBvZiBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMgdG8gbG9hZCwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIGAtdCBzcmMvbG9jYWxlL21lc3NhZ2VzLmVuLnhsZiBzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZiBzcmMvbG9jYWxlL21lc3NhZ2VzLmRlLnhsZmAuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0lmIHlvdSB3YW50IHRvIG1lcmdlIG11bHRpcGxlIHRyYW5zbGF0aW9uIGZpbGVzIGZvciBlYWNoIGxvY2FsZSwgdGhlbiBwcm92aWRlIHRoZSBsaXN0IG9mIGZpbGVzIGluIGFuIGFycmF5LlxcbicgK1xuICAgICAgICAgICAgICAgICdOb3RlIHRoYXQgdGhlIGFycmF5cyBtdXN0IGJlIGluIGRvdWJsZSBxdW90ZXMgaWYgeW91IGluY2x1ZGUgYW55IHdoaXRlc3BhY2Ugd2l0aGluIHRoZSBhcnJheS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBgLXQgXCJbc3JjL2xvY2FsZS9tZXNzYWdlcy5lbi54bGYsIHNyYy9sb2NhbGUvbWVzc2FnZXMtMi5lbi54bGZdXCIgW3NyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmLHNyYy9sb2NhbGUvbWVzc2FnZXMtMi5mci54bGZdYCcsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ3RhcmdldC1sb2NhbGVzJywge1xuICAgICAgICAgICAgYXJyYXk6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBsaXN0IG9mIHRhcmdldCBsb2NhbGVzIGZvciB0aGUgdHJhbnNsYXRpb24gZmlsZXMsIHdoaWNoIHdpbGwgb3ZlcnJpZGUgYW55IHRhcmdldCBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIHRyYW5zbGF0aW9uIGZpbGUuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0UuZy4gXCItdCBlbiBmciBkZVwiLicsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ28nLCB7XG4gICAgICAgICAgICBhbGlhczogJ291dHB1dFBhdGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0Egb3V0cHV0IHBhdGggcGF0dGVybiB0byB3aGVyZSB0aGUgdHJhbnNsYXRlZCBmaWxlcyB3aWxsIGJlIHdyaXR0ZW4uXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoZSBwYXRoIG11c3QgYmUgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy4gYGRpc3Qve3tMT0NBTEV9fWAuJ1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdtJywge1xuICAgICAgICAgICAgYWxpYXM6ICdtaXNzaW5nVHJhbnNsYXRpb24nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ2QnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2R1cGxpY2F0ZVRyYW5zbGF0aW9uJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBkdXBsaWNhdGUgdHJhbnNsYXRpb25zLicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZnMgPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnNbJ3InXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID0gZ2xvYi5zeW5jKG9wdGlvbnNbJ3MnXSwge2N3ZDogc291cmNlUm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZVBhdGhzOiAoc3RyaW5nfHN0cmluZ1tdKVtdID0gY29udmVydEFycmF5c0Zyb21BcmdzKG9wdGlvbnNbJ3QnXSk7XG4gIGNvbnN0IG91dHB1dFBhdGhGbiA9IGdldE91dHB1dFBhdGhGbihmcy5yZXNvbHZlKG9wdGlvbnNbJ28nXSkpO1xuICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICBjb25zdCBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5ID0gb3B0aW9uc1snbSddO1xuICBjb25zdCBkdXBsaWNhdGVUcmFuc2xhdGlvbjogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3kgPSBvcHRpb25zWydkJ107XG4gIGNvbnN0IHNvdXJjZUxvY2FsZTogc3RyaW5nfHVuZGVmaW5lZCA9IG9wdGlvbnNbJ2wnXTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogc3RyaW5nW10gPSBvcHRpb25zWyd0YXJnZXQtbG9jYWxlcyddIHx8IFtdO1xuXG4gIHRyYW5zbGF0ZUZpbGVzKHtcbiAgICBzb3VyY2VSb290UGF0aCxcbiAgICBzb3VyY2VGaWxlUGF0aHMsXG4gICAgdHJhbnNsYXRpb25GaWxlUGF0aHMsXG4gICAgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyxcbiAgICBvdXRwdXRQYXRoRm4sXG4gICAgZGlhZ25vc3RpY3MsXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uLFxuICAgIGR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICAgIHNvdXJjZUxvY2FsZVxuICB9KTtcblxuICBkaWFnbm9zdGljcy5tZXNzYWdlcy5mb3JFYWNoKG0gPT4gY29uc29sZS53YXJuKGAke20udHlwZX06ICR7bS5tZXNzYWdlfWApKTtcbiAgcHJvY2Vzcy5leGl0KGRpYWdub3N0aWNzLmhhc0Vycm9ycyA/IDEgOiAwKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGaWxlc09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZ1xuICAgKiBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gXG4gICAqL1xuICBzb3VyY2VSb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgcmVsYXRpdmUgdG8gdGhlIGByb290YCBwYXRoLlxuICAgKi9cbiAgc291cmNlRmlsZVBhdGhzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHBhdGhzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnRcbiAgICogd29ya2luZyBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEZvciBlYWNoIGxvY2FsZSB0byBiZSB0cmFuc2xhdGVkLCB0aGVyZSBzaG91bGQgYmUgYW4gZWxlbWVudCBpbiBgdHJhbnNsYXRpb25GaWxlUGF0aHNgLlxuICAgKiBFYWNoIGVsZW1lbnQgaXMgZWl0aGVyIGFuIGFic29sdXRlIHBhdGggdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGUsIG9yIGFuIGFycmF5IG9mIGFic29sdXRlIHBhdGhzXG4gICAqIHRvIHRyYW5zbGF0aW9uIGZpbGVzLCBmb3IgdGhhdCBsb2NhbGUuXG4gICAqXG4gICAqIElmIHRoZSBlbGVtZW50IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgdHJhbnNsYXRpb24gZmlsZSwgdGhlbiB0aGUgdHJhbnNsYXRpb25zIGFyZSBtZXJnZWQuXG4gICAqXG4gICAqIElmIGFsbG93ZWQgYnkgdGhlIGBkdXBsaWNhdGVUcmFuc2xhdGlvbmAgcHJvcGVydHksIHdoZW4gbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBoYXMgdGhlIHNhbWVcbiAgICogbWVzc2FnZSBpZCwgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgZWFybGllciB0cmFuc2xhdGlvbiBmaWxlIGluIHRoZSBhcnJheSBpcyB1c2VkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIGZpbGVzIGFyZSBgW2FwcC54bGYsIGxpYi0xLnhsZiwgbGliLTIueGxpZl1gIHRoZW4gYSBtZXNzYWdlIHRoYXQgYXBwZWFycyBpblxuICAgKiBgYXBwLnhsZmAgd2lsbCBvdmVycmlkZSB0aGUgc2FtZSBtZXNzYWdlIGluIGBsaWItMS54bGZgIG9yIGBsaWItMi54bGZgLlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlUGF0aHM6IChzdHJpbmd8c3RyaW5nW10pW107XG4gIC8qKlxuICAgKiBBIGNvbGxlY3Rpb24gb2YgdGhlIHRhcmdldCBsb2NhbGVzIGZvciB0aGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAqXG4gICAqIElmIHRoZXJlIGlzIGEgbG9jYWxlIHByb3ZpZGVkIGluIGB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzYCB0aGVuIHRoaXMgaXMgdXNlZCByYXRoZXIgdGhhbiBhXG4gICAqIGxvY2FsZSBleHRyYWN0ZWQgZnJvbSB0aGUgZmlsZSBpdHNlbGYuXG4gICAqIElmIHRoZXJlIGlzIG5laXRoZXIgYSBwcm92aWRlZCBsb2NhbGUgbm9yIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCB0aGVuIGFuIGVycm9yIGlzXG4gICAqIHRocm93bi5cbiAgICogSWYgdGhlcmUgYXJlIGJvdGggYSBwcm92aWRlZCBsb2NhbGUgYW5kIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCBhbmQgdGhleSBhcmUgbm90IHRoZVxuICAgKiBzYW1lLCB0aGVuIGEgd2FybmluZyBpcyByZXBvcnRlZC5cbiAgICovXG4gIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXM6IChzdHJpbmd8dW5kZWZpbmVkKVtdO1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIHRoZSBvdXRwdXQgcGF0aCBvZiB3aGVyZSB0aGUgdHJhbnNsYXRlZCBmaWxlcyB3aWxsIGJlXG4gICAqIHdyaXR0ZW4uIFRoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLlxuICAgKiBgZGlzdC97e0xPQ0FMRX19YC5cbiAgICovXG4gIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuO1xuICAvKipcbiAgICogQW4gb2JqZWN0IHRoYXQgd2lsbCByZWNlaXZlIGFueSBkaWFnbm9zdGljcyBtZXNzYWdlcyBkdWUgdG8gdGhlIHByb2Nlc3NpbmcuXG4gICAqL1xuICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3M7XG4gIC8qKlxuICAgKiBIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLlxuICAgKi9cbiAgbWlzc2luZ1RyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgZHVwbGljYXRlIHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBmaWxlcy5cbiAgICogSWYgdGhpcyBpcyBwcm92aWRlZCB0aGVuIGEgY29weSBvZiB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBjcmVhdGVkIHdpdGggbm8gdHJhbnNsYXRpb24gYnV0IGp1c3RcbiAgICogdGhlIGAkbG9jYWxpemVgIGNhbGxzIHN0cmlwcGVkIG91dC5cbiAgICovXG4gIHNvdXJjZUxvY2FsZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZUZpbGVzKHtcbiAgc291cmNlUm9vdFBhdGgsXG4gIHNvdXJjZUZpbGVQYXRocyxcbiAgdHJhbnNsYXRpb25GaWxlUGF0aHMsXG4gIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMsXG4gIG91dHB1dFBhdGhGbixcbiAgZGlhZ25vc3RpY3MsXG4gIG1pc3NpbmdUcmFuc2xhdGlvbixcbiAgZHVwbGljYXRlVHJhbnNsYXRpb24sXG4gIHNvdXJjZUxvY2FsZVxufTogVHJhbnNsYXRlRmlsZXNPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCB0cmFuc2xhdGlvbkxvYWRlciA9IG5ldyBUcmFuc2xhdGlvbkxvYWRlcihcbiAgICAgIGZzLFxuICAgICAgW1xuICAgICAgICBuZXcgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFhsaWZmMVRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBYdGJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICBdLFxuICAgICAgZHVwbGljYXRlVHJhbnNsYXRpb24sIGRpYWdub3N0aWNzKTtcblxuICBjb25zdCByZXNvdXJjZVByb2Nlc3NvciA9IG5ldyBUcmFuc2xhdG9yKFxuICAgICAgZnMsXG4gICAgICBbXG4gICAgICAgIG5ldyBTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyKGZzLCB7bWlzc2luZ1RyYW5zbGF0aW9ufSksXG4gICAgICAgIG5ldyBBc3NldFRyYW5zbGF0aW9uSGFuZGxlcihmcyksXG4gICAgICBdLFxuICAgICAgZGlhZ25vc3RpY3MpO1xuXG4gIC8vIENvbnZlcnQgYWxsIHRoZSBgdHJhbnNsYXRpb25GaWxlUGF0aHNgIGVsZW1lbnRzIHRvIGFycmF5cy5cbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHNBcnJheXMgPSB0cmFuc2xhdGlvbkZpbGVQYXRocy5tYXAoXG4gICAgICBmaWxlUGF0aHMgPT5cbiAgICAgICAgICBBcnJheS5pc0FycmF5KGZpbGVQYXRocykgPyBmaWxlUGF0aHMubWFwKHAgPT4gZnMucmVzb2x2ZShwKSkgOiBbZnMucmVzb2x2ZShmaWxlUGF0aHMpXSk7XG5cbiAgY29uc3QgdHJhbnNsYXRpb25zID1cbiAgICAgIHRyYW5zbGF0aW9uTG9hZGVyLmxvYWRCdW5kbGVzKHRyYW5zbGF0aW9uRmlsZVBhdGhzQXJyYXlzLCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzKTtcbiAgc291cmNlUm9vdFBhdGggPSBmcy5yZXNvbHZlKHNvdXJjZVJvb3RQYXRoKTtcbiAgcmVzb3VyY2VQcm9jZXNzb3IudHJhbnNsYXRlRmlsZXMoXG4gICAgICBzb3VyY2VGaWxlUGF0aHMubWFwKHJlbGF0aXZlRnJvbSksIGZzLnJlc29sdmUoc291cmNlUm9vdFBhdGgpLCBvdXRwdXRQYXRoRm4sIHRyYW5zbGF0aW9ucyxcbiAgICAgIHNvdXJjZUxvY2FsZSk7XG59XG5cbi8qKlxuICogUGFyc2UgZWFjaCBvZiB0aGUgZ2l2ZW4gc3RyaW5nIGBhcmdzYCBhbmQgY29udmVydCBpdCB0byBhbiBhcnJheSBpZiBpdCBpcyBvZiB0aGUgZm9ybVxuICogYFthYmMsIGRlZiwgZ2hpXWAsIGkuZS4gaXQgaXMgZW5jbG9zZWQgaW4gc3F1YXJlIGJyYWNrZXRzIHdpdGggY29tbWEgZGVsaW1pdGVkIGl0ZW1zLlxuICogQHBhcmFtIGFyZ3MgVGhlIHN0cmluZyB0byBwb3RlbnRpYWxseSBjb252ZXJ0IHRvIGFycmF5cy5cbiAqL1xuZnVuY3Rpb24gY29udmVydEFycmF5c0Zyb21BcmdzKGFyZ3M6IHN0cmluZ1tdKTogKHN0cmluZ3xzdHJpbmdbXSlbXSB7XG4gIHJldHVybiBhcmdzLm1hcChcbiAgICAgIGFyZyA9PiAoYXJnLnN0YXJ0c1dpdGgoJ1snKSAmJiBhcmcuZW5kc1dpdGgoJ10nKSkgP1xuICAgICAgICAgIGFyZy5zbGljZSgxLCAtMSkuc3BsaXQoJywnKS5tYXAoYXJnID0+IGFyZy50cmltKCkpIDpcbiAgICAgICAgICBhcmcpO1xufSJdfQ==