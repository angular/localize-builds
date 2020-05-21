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
    exports.translateFiles = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILDJFQUF5SDtJQUN6SCwyQkFBNkI7SUFDN0IsNkJBQStCO0lBRS9CLDJFQUF1RTtJQUN2RSw2SEFBZ0Y7SUFDaEYscUZBQTREO0lBQzVELDBJQUE0RjtJQUM1RixxSEFBeUU7SUFDekUsaUtBQW1IO0lBQ25ILHVKQUEwRztJQUMxRyx1SkFBMEc7SUFDMUcsaUpBQW9HO0lBQ3BHLG1GQUF3QztJQUV4QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzNCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUNULEtBQUs7YUFDQSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSix3SEFBd0g7U0FDN0gsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLHNHQUFzRztTQUMzRyxDQUFDO2FBRUQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxlQUFlO1lBQ3RCLFFBQVEsRUFDSiwyS0FBMks7U0FDaEwsQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRSxJQUFJO1lBQ1gsUUFBUSxFQUNKLG1IQUFtSDtnQkFDbkgsK0ZBQStGO2dCQUMvRixnSEFBZ0g7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QUFDLEdBQUcsQ0FBQywwQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUN6RixZQUFZLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBekNELHdDQXlDQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTLHFCQUFxQixDQUFDLElBQWM7UUFDM0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUNYLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBVixDQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BELEdBQUcsRUFGQSxDQUVBLENBQUMsQ0FBQztJQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dldEZpbGVTeXN0ZW0sIE5vZGVKU0ZpbGVTeXN0ZW0sIHNldEZpbGVTeXN0ZW0sIHJlbGF0aXZlRnJvbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtBc3NldFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi9hc3NldF9maWxlcy9hc3NldF90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7Z2V0T3V0cHV0UGF0aEZuLCBPdXRwdXRQYXRoRm59IGZyb20gJy4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7VHJhbnNsYXRpb25Mb2FkZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyJztcbmltcG9ydCB7U2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvc2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYxVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjFfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WHRiVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94dGJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7VHJhbnNsYXRvcn0gZnJvbSAnLi90cmFuc2xhdG9yJztcblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdyJywge1xuICAgICAgICAgICAgYWxpYXM6ICdyb290JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1RoZSByb290IHBhdGggb2YgdGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBFLmcuIGBkaXN0L2VuYC4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byB0cmFuc2xhdGUsIHJlbGF0aXZlIHRvIHRoZSBgcm9vdGAgcGF0aC4gRS5nLiBgYnVuZGxlcy8qKi8qYC4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UtbG9jYWxlJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgc291cmNlIGxvY2FsZSBvZiB0aGUgYXBwbGljYXRpb24uIElmIHRoaXMgaXMgcHJvdmlkZWQgdGhlbiBhIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIHdpbGwgYmUgY3JlYXRlZCB3aXRoIG5vIHRyYW5zbGF0aW9uIGJ1dCBqdXN0IHRoZSBgJGxvY2FsaXplYCBjYWxscyBzdHJpcHBlZCBvdXQuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAndHJhbnNsYXRpb25zJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgYXJyYXk6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBsaXN0IG9mIHBhdGhzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0UuZy4gYC10IHNyYy9sb2NhbGUvbWVzc2FnZXMuZW4ueGxmIHNyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmIHNyYy9sb2NhbGUvbWVzc2FnZXMuZGUueGxmYC5cXG4nICtcbiAgICAgICAgICAgICAgICAnSWYgeW91IHdhbnQgdG8gbWVyZ2UgbXVsdGlwbGUgdHJhbnNsYXRpb24gZmlsZXMgZm9yIGVhY2ggbG9jYWxlLCB0aGVuIHByb3ZpZGUgdGhlIGxpc3Qgb2YgZmlsZXMgaW4gYW4gYXJyYXkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ05vdGUgdGhhdCB0aGUgYXJyYXlzIG11c3QgYmUgaW4gZG91YmxlIHF1b3RlcyBpZiB5b3UgaW5jbHVkZSBhbnkgd2hpdGVzcGFjZSB3aXRoaW4gdGhlIGFycmF5LlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIGAtdCBcIltzcmMvbG9jYWxlL21lc3NhZ2VzLmVuLnhsZiwgc3JjL2xvY2FsZS9tZXNzYWdlcy0yLmVuLnhsZl1cIiBbc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYsc3JjL2xvY2FsZS9tZXNzYWdlcy0yLmZyLnhsZl1gJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndGFyZ2V0LWxvY2FsZXMnLCB7XG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgdGFyZ2V0IGxvY2FsZXMgZm9yIHRoZSB0cmFuc2xhdGlvbiBmaWxlcywgd2hpY2ggd2lsbCBvdmVycmlkZSBhbnkgdGFyZ2V0IGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgdHJhbnNsYXRpb24gZmlsZS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBcIi10IGVuIGZyIGRlXCIuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnb3V0cHV0UGF0aCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnQSBvdXRwdXQgcGF0aCBwYXR0ZXJuIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGVkIGZpbGVzIHdpbGwgYmUgd3JpdHRlbi5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhlIHBhdGggbXVzdCBiZSBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLiBgZGlzdC97e0xPQ0FMRX19YC4nXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ20nLCB7XG4gICAgICAgICAgICBhbGlhczogJ21pc3NpbmdUcmFuc2xhdGlvbicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0hvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignZCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnZHVwbGljYXRlVHJhbnNsYXRpb24nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIGR1cGxpY2F0ZSB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLnN0cmljdCgpXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBmcyA9IG5ldyBOb2RlSlNGaWxlU3lzdGVtKCk7XG4gIHNldEZpbGVTeXN0ZW0oZnMpO1xuXG4gIGNvbnN0IHNvdXJjZVJvb3RQYXRoID0gb3B0aW9uc1snciddO1xuICBjb25zdCBzb3VyY2VGaWxlUGF0aHMgPSBnbG9iLnN5bmMob3B0aW9uc1sncyddLCB7Y3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHM6IChzdHJpbmd8c3RyaW5nW10pW10gPSBjb252ZXJ0QXJyYXlzRnJvbUFyZ3Mob3B0aW9uc1sndCddKTtcbiAgY29uc3Qgb3V0cHV0UGF0aEZuID0gZ2V0T3V0cHV0UGF0aEZuKGZzLnJlc29sdmUob3B0aW9uc1snbyddKSk7XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gIGNvbnN0IG1pc3NpbmdUcmFuc2xhdGlvbjogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3kgPSBvcHRpb25zWydtJ107XG4gIGNvbnN0IGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSA9IG9wdGlvbnNbJ2QnXTtcbiAgY29uc3Qgc291cmNlTG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkID0gb3B0aW9uc1snbCddO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiBzdHJpbmdbXSA9IG9wdGlvbnNbJ3RhcmdldC1sb2NhbGVzJ10gfHwgW107XG5cbiAgdHJhbnNsYXRlRmlsZXMoe1xuICAgIHNvdXJjZVJvb3RQYXRoLFxuICAgIHNvdXJjZUZpbGVQYXRocyxcbiAgICB0cmFuc2xhdGlvbkZpbGVQYXRocyxcbiAgICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzLFxuICAgIG91dHB1dFBhdGhGbixcbiAgICBkaWFnbm9zdGljcyxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb24sXG4gICAgZHVwbGljYXRlVHJhbnNsYXRpb24sXG4gICAgc291cmNlTG9jYWxlXG4gIH0pO1xuXG4gIGRpYWdub3N0aWNzLm1lc3NhZ2VzLmZvckVhY2gobSA9PiBjb25zb2xlLndhcm4oYCR7bS50eXBlfTogJHttLm1lc3NhZ2V9YCkpO1xuICBwcm9jZXNzLmV4aXQoZGlhZ25vc3RpY3MuaGFzRXJyb3JzID8gMSA6IDApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZpbGVzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nXG4gICAqIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmBcbiAgICovXG4gIHNvdXJjZVJvb3RQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguXG4gICAqL1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcGF0aHMgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVzIHRvIGxvYWQsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudFxuICAgKiB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICpcbiAgICogRm9yIGVhY2ggbG9jYWxlIHRvIGJlIHRyYW5zbGF0ZWQsIHRoZXJlIHNob3VsZCBiZSBhbiBlbGVtZW50IGluIGB0cmFuc2xhdGlvbkZpbGVQYXRoc2AuXG4gICAqIEVhY2ggZWxlbWVudCBpcyBlaXRoZXIgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgdHJhbnNsYXRpb24gZmlsZSwgb3IgYW4gYXJyYXkgb2YgYWJzb2x1dGUgcGF0aHNcbiAgICogdG8gdHJhbnNsYXRpb24gZmlsZXMsIGZvciB0aGF0IGxvY2FsZS5cbiAgICpcbiAgICogSWYgdGhlIGVsZW1lbnQgY29udGFpbnMgbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBmaWxlLCB0aGVuIHRoZSB0cmFuc2xhdGlvbnMgYXJlIG1lcmdlZC5cbiAgICpcbiAgICogSWYgYWxsb3dlZCBieSB0aGUgYGR1cGxpY2F0ZVRyYW5zbGF0aW9uYCBwcm9wZXJ0eSwgd2hlbiBtb3JlIHRoYW4gb25lIHRyYW5zbGF0aW9uIGhhcyB0aGUgc2FtZVxuICAgKiBtZXNzYWdlIGlkLCB0aGUgbWVzc2FnZSBmcm9tIHRoZSBlYXJsaWVyIHRyYW5zbGF0aW9uIGZpbGUgaW4gdGhlIGFycmF5IGlzIHVzZWQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgZmlsZXMgYXJlIGBbYXBwLnhsZiwgbGliLTEueGxmLCBsaWItMi54bGlmXWAgdGhlbiBhIG1lc3NhZ2UgdGhhdCBhcHBlYXJzIGluXG4gICAqIGBhcHAueGxmYCB3aWxsIG92ZXJyaWRlIHRoZSBzYW1lIG1lc3NhZ2UgaW4gYGxpYi0xLnhsZmAgb3IgYGxpYi0yLnhsZmAuXG4gICAqL1xuICB0cmFuc2xhdGlvbkZpbGVQYXRoczogKHN0cmluZ3xzdHJpbmdbXSlbXTtcbiAgLyoqXG4gICAqIEEgY29sbGVjdGlvbiBvZiB0aGUgdGFyZ2V0IGxvY2FsZXMgZm9yIHRoZSB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogSWYgdGhlcmUgaXMgYSBsb2NhbGUgcHJvdmlkZWQgaW4gYHRyYW5zbGF0aW9uRmlsZUxvY2FsZXNgIHRoZW4gdGhpcyBpcyB1c2VkIHJhdGhlciB0aGFuIGFcbiAgICogbG9jYWxlIGV4dHJhY3RlZCBmcm9tIHRoZSBmaWxlIGl0c2VsZi5cbiAgICogSWYgdGhlcmUgaXMgbmVpdGhlciBhIHByb3ZpZGVkIGxvY2FsZSBub3IgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIHRoZW4gYW4gZXJyb3IgaXNcbiAgICogdGhyb3duLlxuICAgKiBJZiB0aGVyZSBhcmUgYm90aCBhIHByb3ZpZGVkIGxvY2FsZSBhbmQgYSBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIGZpbGUsIGFuZCB0aGV5IGFyZSBub3QgdGhlXG4gICAqIHNhbWUsIHRoZW4gYSB3YXJuaW5nIGlzIHJlcG9ydGVkLlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW107XG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgdGhlIG91dHB1dCBwYXRoIG9mIHdoZXJlIHRoZSB0cmFuc2xhdGVkIGZpbGVzIHdpbGwgYmVcbiAgICogd3JpdHRlbi4gVGhlIG1hcmtlciBge3tMT0NBTEV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0YXJnZXQgbG9jYWxlLiBFLmcuXG4gICAqIGBkaXN0L3t7TE9DQUxFfX1gLlxuICAgKi9cbiAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm47XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdGhhdCB3aWxsIHJlY2VpdmUgYW55IGRpYWdub3N0aWNzIG1lc3NhZ2VzIGR1ZSB0byB0aGUgcHJvY2Vzc2luZy5cbiAgICovXG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICBtaXNzaW5nVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBkdXBsaWNhdGUgdHJhbnNsYXRpb25zLlxuICAgKi9cbiAgZHVwbGljYXRlVHJhbnNsYXRpb246IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICAvKipcbiAgICogVGhlIGxvY2FsZSBvZiB0aGUgc291cmNlIGZpbGVzLlxuICAgKiBJZiB0aGlzIGlzIHByb3ZpZGVkIHRoZW4gYSBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgd2l0aCBubyB0cmFuc2xhdGlvbiBidXQganVzdFxuICAgKiB0aGUgYCRsb2NhbGl6ZWAgY2FsbHMgc3RyaXBwZWQgb3V0LlxuICAgKi9cbiAgc291cmNlTG9jYWxlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlRmlsZXMoe1xuICBzb3VyY2VSb290UGF0aCxcbiAgc291cmNlRmlsZVBhdGhzLFxuICB0cmFuc2xhdGlvbkZpbGVQYXRocyxcbiAgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyxcbiAgb3V0cHV0UGF0aEZuLFxuICBkaWFnbm9zdGljcyxcbiAgbWlzc2luZ1RyYW5zbGF0aW9uLFxuICBkdXBsaWNhdGVUcmFuc2xhdGlvbixcbiAgc291cmNlTG9jYWxlXG59OiBUcmFuc2xhdGVGaWxlc09wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSBnZXRGaWxlU3lzdGVtKCk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uTG9hZGVyID0gbmV3IFRyYW5zbGF0aW9uTG9hZGVyKFxuICAgICAgZnMsXG4gICAgICBbXG4gICAgICAgIG5ldyBYbGlmZjJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFh0YlRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgIF0sXG4gICAgICBkdXBsaWNhdGVUcmFuc2xhdGlvbiwgZGlhZ25vc3RpY3MpO1xuXG4gIGNvbnN0IHJlc291cmNlUHJvY2Vzc29yID0gbmV3IFRyYW5zbGF0b3IoXG4gICAgICBmcyxcbiAgICAgIFtcbiAgICAgICAgbmV3IFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIoZnMsIHttaXNzaW5nVHJhbnNsYXRpb259KSxcbiAgICAgICAgbmV3IEFzc2V0VHJhbnNsYXRpb25IYW5kbGVyKGZzKSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljcyk7XG5cbiAgLy8gQ29udmVydCBhbGwgdGhlIGB0cmFuc2xhdGlvbkZpbGVQYXRoc2AgZWxlbWVudHMgdG8gYXJyYXlzLlxuICBjb25zdCB0cmFuc2xhdGlvbkZpbGVQYXRoc0FycmF5cyA9IHRyYW5zbGF0aW9uRmlsZVBhdGhzLm1hcChcbiAgICAgIGZpbGVQYXRocyA9PlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkoZmlsZVBhdGhzKSA/IGZpbGVQYXRocy5tYXAocCA9PiBmcy5yZXNvbHZlKHApKSA6IFtmcy5yZXNvbHZlKGZpbGVQYXRocyldKTtcblxuICBjb25zdCB0cmFuc2xhdGlvbnMgPVxuICAgICAgdHJhbnNsYXRpb25Mb2FkZXIubG9hZEJ1bmRsZXModHJhbnNsYXRpb25GaWxlUGF0aHNBcnJheXMsIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMpO1xuICBzb3VyY2VSb290UGF0aCA9IGZzLnJlc29sdmUoc291cmNlUm9vdFBhdGgpO1xuICByZXNvdXJjZVByb2Nlc3Nvci50cmFuc2xhdGVGaWxlcyhcbiAgICAgIHNvdXJjZUZpbGVQYXRocy5tYXAocmVsYXRpdmVGcm9tKSwgZnMucmVzb2x2ZShzb3VyY2VSb290UGF0aCksIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zLFxuICAgICAgc291cmNlTG9jYWxlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSBlYWNoIG9mIHRoZSBnaXZlbiBzdHJpbmcgYGFyZ3NgIGFuZCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5IGlmIGl0IGlzIG9mIHRoZSBmb3JtXG4gKiBgW2FiYywgZGVmLCBnaGldYCwgaS5lLiBpdCBpcyBlbmNsb3NlZCBpbiBzcXVhcmUgYnJhY2tldHMgd2l0aCBjb21tYSBkZWxpbWl0ZWQgaXRlbXMuXG4gKiBAcGFyYW0gYXJncyBUaGUgc3RyaW5nIHRvIHBvdGVudGlhbGx5IGNvbnZlcnQgdG8gYXJyYXlzLlxuICovXG5mdW5jdGlvbiBjb252ZXJ0QXJyYXlzRnJvbUFyZ3MoYXJnczogc3RyaW5nW10pOiAoc3RyaW5nfHN0cmluZ1tdKVtdIHtcbiAgcmV0dXJuIGFyZ3MubWFwKFxuICAgICAgYXJnID0+IChhcmcuc3RhcnRzV2l0aCgnWycpICYmIGFyZy5lbmRzV2l0aCgnXScpKSA/XG4gICAgICAgICAgYXJnLnNsaWNlKDEsIC0xKS5zcGxpdCgnLCcpLm1hcChhcmcgPT4gYXJnLnRyaW0oKSkgOlxuICAgICAgICAgIGFyZyk7XG59Il19