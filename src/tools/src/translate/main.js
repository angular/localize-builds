#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "@angular/compiler-cli/src/ngtsc/file_system", "glob", "yargs", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/arb_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", "@angular/localize/src/tools/src/translate/translator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.translateFiles = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
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
    var arb_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/arb_translation_parser");
    var simple_json_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser");
    var xliff1_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser");
    var xliff2_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser");
    var xtb_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser");
    var translator_1 = require("@angular/localize/src/tools/src/translate/translator");
    if (require.main === module) {
        process.title = 'Angular Localization Message Translator (localize-translate)';
        var args = process.argv.slice(2);
        var options = yargs
            .option('r', {
            alias: 'root',
            required: true,
            describe: 'The root path of the files to translate, either absolute or relative to the current working directory. E.g. `dist/en`.',
            type: 'string',
        })
            .option('s', {
            alias: 'source',
            required: true,
            describe: 'A glob pattern indicating what files to translate, relative to the `root` path. E.g. `bundles/**/*`.',
            type: 'string',
        })
            .option('l', {
            alias: 'source-locale',
            describe: 'The source locale of the application. If this is provided then a copy of the application will be created with no translation but just the `$localize` calls stripped out.',
            type: 'string',
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
            type: 'string',
        })
            .option('target-locales', {
            array: true,
            describe: 'A list of target locales for the translation files, which will override any target locale parsed from the translation file.\n' +
                'E.g. "-t en fr de".',
            type: 'string',
        })
            .option('o', {
            alias: 'outputPath',
            required: true,
            describe: 'A output path pattern to where the translated files will be written.\n' +
                'The path must be either absolute or relative to the current working directory.\n' +
                'The marker `{{LOCALE}}` will be replaced with the target locale. E.g. `dist/{{LOCALE}}`.',
            type: 'string',
        })
            .option('m', {
            alias: 'missingTranslation',
            describe: 'How to handle missing translations.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
            type: 'string',
        })
            .option('d', {
            alias: 'duplicateTranslation',
            describe: 'How to handle duplicate translations.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
            type: 'string',
        })
            .strict()
            .help()
            .parse(args);
        var fs = new file_system_1.NodeJSFileSystem();
        file_system_1.setFileSystem(fs);
        var sourceRootPath = options.r;
        var sourceFilePaths = glob.sync(options.s, { cwd: sourceRootPath, nodir: true });
        var translationFilePaths = convertArraysFromArgs(options.t);
        var outputPathFn = output_path_1.getOutputPathFn(fs.resolve(options.o));
        var diagnostics = new diagnostics_1.Diagnostics();
        var missingTranslation = options.m;
        var duplicateTranslation = options.d;
        var sourceLocale = options.l;
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
            new arb_translation_parser_1.ArbTranslationParser(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILDJFQUF5SDtJQUN6SCwyQkFBNkI7SUFDN0IsNkJBQStCO0lBRS9CLDJFQUF1RTtJQUN2RSw2SEFBZ0Y7SUFDaEYscUZBQTREO0lBQzVELDBJQUE0RjtJQUM1RixxSEFBeUU7SUFDekUsaUpBQW9HO0lBQ3BHLGlLQUFtSDtJQUNuSCx1SkFBMEc7SUFDMUcsdUpBQTBHO0lBQzFHLGlKQUFvRztJQUNwRyxtRkFBd0M7SUFFeEMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixPQUFPLENBQUMsS0FBSyxHQUFHLDhEQUE4RCxDQUFDO1FBQy9FLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUNULEtBQUs7YUFDQSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSix3SEFBd0g7WUFDNUgsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osc0dBQXNHO1lBQzFHLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsZUFBZTtZQUN0QixRQUFRLEVBQ0osMktBQTJLO1lBQy9LLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7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QUFDLFNBQVMsQ0FBQyxDQUFDO1FBQXRGLENBQXNGLENBQUMsQ0FBQztRQUVoRyxJQUFNLFlBQVksR0FDZCxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUN0RixjQUFjLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1QyxpQkFBaUIsQ0FBQyxjQUFjLENBQzVCLGVBQWUsQ0FBQyxHQUFHLENBQUMsMEJBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFDekYsWUFBWSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQTFDRCx3Q0EwQ0M7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxJQUFjO1FBQzNDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FDWCxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDLENBQUMsQ0FBQztZQUNwRCxHQUFHLEVBRkEsQ0FFQSxDQUFDLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dldEZpbGVTeXN0ZW0sIE5vZGVKU0ZpbGVTeXN0ZW0sIHNldEZpbGVTeXN0ZW0sIHJlbGF0aXZlRnJvbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtBc3NldFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi9hc3NldF9maWxlcy9hc3NldF90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7Z2V0T3V0cHV0UGF0aEZuLCBPdXRwdXRQYXRoRm59IGZyb20gJy4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7VHJhbnNsYXRpb25Mb2FkZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fbG9hZGVyJztcbmltcG9ydCB7QXJiVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9hcmJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7U2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvc2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYxVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjFfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WHRiVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94dGJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7VHJhbnNsYXRvcn0gZnJvbSAnLi90cmFuc2xhdG9yJztcblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIHByb2Nlc3MudGl0bGUgPSAnQW5ndWxhciBMb2NhbGl6YXRpb24gTWVzc2FnZSBUcmFuc2xhdG9yIChsb2NhbGl6ZS10cmFuc2xhdGUpJztcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgY29uc3Qgb3B0aW9ucyA9XG4gICAgICB5YXJnc1xuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguIEUuZy4gYGJ1bmRsZXMvKiovKmAuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UtbG9jYWxlJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgc291cmNlIGxvY2FsZSBvZiB0aGUgYXBwbGljYXRpb24uIElmIHRoaXMgaXMgcHJvdmlkZWQgdGhlbiBhIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIHdpbGwgYmUgY3JlYXRlZCB3aXRoIG5vIHRyYW5zbGF0aW9uIGJ1dCBqdXN0IHRoZSBgJGxvY2FsaXplYCBjYWxscyBzdHJpcHBlZCBvdXQuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCd0Jywge1xuICAgICAgICAgICAgYWxpYXM6ICd0cmFuc2xhdGlvbnMnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgcGF0aHMgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVzIHRvIGxvYWQsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBgLXQgc3JjL2xvY2FsZS9tZXNzYWdlcy5lbi54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5kZS54bGZgLlxcbicgK1xuICAgICAgICAgICAgICAgICdJZiB5b3Ugd2FudCB0byBtZXJnZSBtdWx0aXBsZSB0cmFuc2xhdGlvbiBmaWxlcyBmb3IgZWFjaCBsb2NhbGUsIHRoZW4gcHJvdmlkZSB0aGUgbGlzdCBvZiBmaWxlcyBpbiBhbiBhcnJheS5cXG4nICtcbiAgICAgICAgICAgICAgICAnTm90ZSB0aGF0IHRoZSBhcnJheXMgbXVzdCBiZSBpbiBkb3VibGUgcXVvdGVzIGlmIHlvdSBpbmNsdWRlIGFueSB3aGl0ZXNwYWNlIHdpdGhpbiB0aGUgYXJyYXkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0UuZy4gYC10IFwiW3NyYy9sb2NhbGUvbWVzc2FnZXMuZW4ueGxmLCBzcmMvbG9jYWxlL21lc3NhZ2VzLTIuZW4ueGxmXVwiIFtzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZixzcmMvbG9jYWxlL21lc3NhZ2VzLTIuZnIueGxmXWAnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ3RhcmdldC1sb2NhbGVzJywge1xuICAgICAgICAgICAgYXJyYXk6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBsaXN0IG9mIHRhcmdldCBsb2NhbGVzIGZvciB0aGUgdHJhbnNsYXRpb24gZmlsZXMsIHdoaWNoIHdpbGwgb3ZlcnJpZGUgYW55IHRhcmdldCBsb2NhbGUgcGFyc2VkIGZyb20gdGhlIHRyYW5zbGF0aW9uIGZpbGUuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0UuZy4gXCItdCBlbiBmciBkZVwiLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnb3V0cHV0UGF0aCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnQSBvdXRwdXQgcGF0aCBwYXR0ZXJuIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGVkIGZpbGVzIHdpbGwgYmUgd3JpdHRlbi5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhlIHBhdGggbXVzdCBiZSBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLiBgZGlzdC97e0xPQ0FMRX19YC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ20nLCB7XG4gICAgICAgICAgICBhbGlhczogJ21pc3NpbmdUcmFuc2xhdGlvbicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0hvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdkJywge1xuICAgICAgICAgICAgYWxpYXM6ICdkdXBsaWNhdGVUcmFuc2xhdGlvbicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0hvdyB0byBoYW5kbGUgZHVwbGljYXRlIHRyYW5zbGF0aW9ucy4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydlcnJvcicsICd3YXJuaW5nJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZnMgPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnMucjtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID0gZ2xvYi5zeW5jKG9wdGlvbnMucywge2N3ZDogc291cmNlUm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZVBhdGhzOiAoc3RyaW5nfHN0cmluZ1tdKVtdID0gY29udmVydEFycmF5c0Zyb21BcmdzKG9wdGlvbnMudCk7XG4gIGNvbnN0IG91dHB1dFBhdGhGbiA9IGdldE91dHB1dFBhdGhGbihmcy5yZXNvbHZlKG9wdGlvbnMubykpO1xuICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICBjb25zdCBtaXNzaW5nVHJhbnNsYXRpb24gPSBvcHRpb25zLm0gYXMgRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIGNvbnN0IGR1cGxpY2F0ZVRyYW5zbGF0aW9uID0gb3B0aW9ucy5kIGFzIERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICBjb25zdCBzb3VyY2VMb2NhbGU6IHN0cmluZ3x1bmRlZmluZWQgPSBvcHRpb25zLmw7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZUxvY2FsZXM6IHN0cmluZ1tdID0gb3B0aW9uc1sndGFyZ2V0LWxvY2FsZXMnXSB8fCBbXTtcblxuICB0cmFuc2xhdGVGaWxlcyh7XG4gICAgc291cmNlUm9vdFBhdGgsXG4gICAgc291cmNlRmlsZVBhdGhzLFxuICAgIHRyYW5zbGF0aW9uRmlsZVBhdGhzLFxuICAgIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMsXG4gICAgb3V0cHV0UGF0aEZuLFxuICAgIGRpYWdub3N0aWNzLFxuICAgIG1pc3NpbmdUcmFuc2xhdGlvbixcbiAgICBkdXBsaWNhdGVUcmFuc2xhdGlvbixcbiAgICBzb3VyY2VMb2NhbGVcbiAgfSk7XG5cbiAgZGlhZ25vc3RpY3MubWVzc2FnZXMuZm9yRWFjaChtID0+IGNvbnNvbGUud2FybihgJHttLnR5cGV9OiAke20ubWVzc2FnZX1gKSk7XG4gIHByb2Nlc3MuZXhpdChkaWFnbm9zdGljcy5oYXNFcnJvcnMgPyAxIDogMCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlRmlsZXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSByb290IHBhdGggb2YgdGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmdcbiAgICogZGlyZWN0b3J5LiBFLmcuIGBkaXN0L2VuYFxuICAgKi9cbiAgc291cmNlUm9vdFBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIHJlbGF0aXZlIHRvIHRoZSBgcm9vdGAgcGF0aC5cbiAgICovXG4gIHNvdXJjZUZpbGVQYXRoczogc3RyaW5nW107XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMgdG8gbG9hZCwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50XG4gICAqIHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBGb3IgZWFjaCBsb2NhbGUgdG8gYmUgdHJhbnNsYXRlZCwgdGhlcmUgc2hvdWxkIGJlIGFuIGVsZW1lbnQgaW4gYHRyYW5zbGF0aW9uRmlsZVBhdGhzYC5cbiAgICogRWFjaCBlbGVtZW50IGlzIGVpdGhlciBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlLCBvciBhbiBhcnJheSBvZiBhYnNvbHV0ZSBwYXRoc1xuICAgKiB0byB0cmFuc2xhdGlvbiBmaWxlcywgZm9yIHRoYXQgbG9jYWxlLlxuICAgKlxuICAgKiBJZiB0aGUgZWxlbWVudCBjb250YWlucyBtb3JlIHRoYW4gb25lIHRyYW5zbGF0aW9uIGZpbGUsIHRoZW4gdGhlIHRyYW5zbGF0aW9ucyBhcmUgbWVyZ2VkLlxuICAgKlxuICAgKiBJZiBhbGxvd2VkIGJ5IHRoZSBgZHVwbGljYXRlVHJhbnNsYXRpb25gIHByb3BlcnR5LCB3aGVuIG1vcmUgdGhhbiBvbmUgdHJhbnNsYXRpb24gaGFzIHRoZSBzYW1lXG4gICAqIG1lc3NhZ2UgaWQsIHRoZSBtZXNzYWdlIGZyb20gdGhlIGVhcmxpZXIgdHJhbnNsYXRpb24gZmlsZSBpbiB0aGUgYXJyYXkgaXMgdXNlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZSBmaWxlcyBhcmUgYFthcHAueGxmLCBsaWItMS54bGYsIGxpYi0yLnhsaWZdYCB0aGVuIGEgbWVzc2FnZSB0aGF0IGFwcGVhcnMgaW5cbiAgICogYGFwcC54bGZgIHdpbGwgb3ZlcnJpZGUgdGhlIHNhbWUgbWVzc2FnZSBpbiBgbGliLTEueGxmYCBvciBgbGliLTIueGxmYC5cbiAgICovXG4gIHRyYW5zbGF0aW9uRmlsZVBhdGhzOiAoc3RyaW5nfHN0cmluZ1tdKVtdO1xuICAvKipcbiAgICogQSBjb2xsZWN0aW9uIG9mIHRoZSB0YXJnZXQgbG9jYWxlcyBmb3IgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBhIGxvY2FsZSBwcm92aWRlZCBpbiBgdHJhbnNsYXRpb25GaWxlTG9jYWxlc2AgdGhlbiB0aGlzIGlzIHVzZWQgcmF0aGVyIHRoYW4gYVxuICAgKiBsb2NhbGUgZXh0cmFjdGVkIGZyb20gdGhlIGZpbGUgaXRzZWxmLlxuICAgKiBJZiB0aGVyZSBpcyBuZWl0aGVyIGEgcHJvdmlkZWQgbG9jYWxlIG5vciBhIGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgZmlsZSwgdGhlbiBhbiBlcnJvciBpc1xuICAgKiB0aHJvd24uXG4gICAqIElmIHRoZXJlIGFyZSBib3RoIGEgcHJvdmlkZWQgbG9jYWxlIGFuZCBhIGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgZmlsZSwgYW5kIHRoZXkgYXJlIG5vdCB0aGVcbiAgICogc2FtZSwgdGhlbiBhIHdhcm5pbmcgaXMgcmVwb3J0ZWQuXG4gICAqL1xuICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiAoc3RyaW5nfHVuZGVmaW5lZClbXTtcbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGUgb3V0cHV0IHBhdGggb2Ygd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZVxuICAgKiB3cml0dGVuLiBUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy5cbiAgICogYGRpc3Qve3tMT0NBTEV9fWAuXG4gICAqL1xuICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbjtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCB0aGF0IHdpbGwgcmVjZWl2ZSBhbnkgZGlhZ25vc3RpY3MgbWVzc2FnZXMgZHVlIHRvIHRoZSBwcm9jZXNzaW5nLlxuICAgKi9cbiAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzO1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBtaXNzaW5nIHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIG1pc3NpbmdUcmFuc2xhdGlvbjogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIC8qKlxuICAgKiBIb3cgdG8gaGFuZGxlIGR1cGxpY2F0ZSB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICBkdXBsaWNhdGVUcmFuc2xhdGlvbjogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgZmlsZXMuXG4gICAqIElmIHRoaXMgaXMgcHJvdmlkZWQgdGhlbiBhIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIHdpbGwgYmUgY3JlYXRlZCB3aXRoIG5vIHRyYW5zbGF0aW9uIGJ1dCBqdXN0XG4gICAqIHRoZSBgJGxvY2FsaXplYCBjYWxscyBzdHJpcHBlZCBvdXQuXG4gICAqL1xuICBzb3VyY2VMb2NhbGU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGVGaWxlcyh7XG4gIHNvdXJjZVJvb3RQYXRoLFxuICBzb3VyY2VGaWxlUGF0aHMsXG4gIHRyYW5zbGF0aW9uRmlsZVBhdGhzLFxuICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzLFxuICBvdXRwdXRQYXRoRm4sXG4gIGRpYWdub3N0aWNzLFxuICBtaXNzaW5nVHJhbnNsYXRpb24sXG4gIGR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICBzb3VyY2VMb2NhbGVcbn06IFRyYW5zbGF0ZUZpbGVzT3B0aW9ucykge1xuICBjb25zdCBmcyA9IGdldEZpbGVTeXN0ZW0oKTtcbiAgY29uc3QgdHJhbnNsYXRpb25Mb2FkZXIgPSBuZXcgVHJhbnNsYXRpb25Mb2FkZXIoXG4gICAgICBmcyxcbiAgICAgIFtcbiAgICAgICAgbmV3IFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBYbGlmZjFUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgWHRiVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFNpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgQXJiVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgIF0sXG4gICAgICBkdXBsaWNhdGVUcmFuc2xhdGlvbiwgZGlhZ25vc3RpY3MpO1xuXG4gIGNvbnN0IHJlc291cmNlUHJvY2Vzc29yID0gbmV3IFRyYW5zbGF0b3IoXG4gICAgICBmcyxcbiAgICAgIFtcbiAgICAgICAgbmV3IFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIoZnMsIHttaXNzaW5nVHJhbnNsYXRpb259KSxcbiAgICAgICAgbmV3IEFzc2V0VHJhbnNsYXRpb25IYW5kbGVyKGZzKSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljcyk7XG5cbiAgLy8gQ29udmVydCBhbGwgdGhlIGB0cmFuc2xhdGlvbkZpbGVQYXRoc2AgZWxlbWVudHMgdG8gYXJyYXlzLlxuICBjb25zdCB0cmFuc2xhdGlvbkZpbGVQYXRoc0FycmF5cyA9IHRyYW5zbGF0aW9uRmlsZVBhdGhzLm1hcChcbiAgICAgIGZpbGVQYXRocyA9PlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkoZmlsZVBhdGhzKSA/IGZpbGVQYXRocy5tYXAocCA9PiBmcy5yZXNvbHZlKHApKSA6IFtmcy5yZXNvbHZlKGZpbGVQYXRocyldKTtcblxuICBjb25zdCB0cmFuc2xhdGlvbnMgPVxuICAgICAgdHJhbnNsYXRpb25Mb2FkZXIubG9hZEJ1bmRsZXModHJhbnNsYXRpb25GaWxlUGF0aHNBcnJheXMsIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMpO1xuICBzb3VyY2VSb290UGF0aCA9IGZzLnJlc29sdmUoc291cmNlUm9vdFBhdGgpO1xuICByZXNvdXJjZVByb2Nlc3Nvci50cmFuc2xhdGVGaWxlcyhcbiAgICAgIHNvdXJjZUZpbGVQYXRocy5tYXAocmVsYXRpdmVGcm9tKSwgZnMucmVzb2x2ZShzb3VyY2VSb290UGF0aCksIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zLFxuICAgICAgc291cmNlTG9jYWxlKTtcbn1cblxuLyoqXG4gKiBQYXJzZSBlYWNoIG9mIHRoZSBnaXZlbiBzdHJpbmcgYGFyZ3NgIGFuZCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5IGlmIGl0IGlzIG9mIHRoZSBmb3JtXG4gKiBgW2FiYywgZGVmLCBnaGldYCwgaS5lLiBpdCBpcyBlbmNsb3NlZCBpbiBzcXVhcmUgYnJhY2tldHMgd2l0aCBjb21tYSBkZWxpbWl0ZWQgaXRlbXMuXG4gKiBAcGFyYW0gYXJncyBUaGUgc3RyaW5nIHRvIHBvdGVudGlhbGx5IGNvbnZlcnQgdG8gYXJyYXlzLlxuICovXG5mdW5jdGlvbiBjb252ZXJ0QXJyYXlzRnJvbUFyZ3MoYXJnczogc3RyaW5nW10pOiAoc3RyaW5nfHN0cmluZ1tdKVtdIHtcbiAgcmV0dXJuIGFyZ3MubWFwKFxuICAgICAgYXJnID0+IChhcmcuc3RhcnRzV2l0aCgnWycpICYmIGFyZy5lbmRzV2l0aCgnXScpKSA/XG4gICAgICAgICAgYXJnLnNsaWNlKDEsIC0xKS5zcGxpdCgnLCcpLm1hcChhcmcgPT4gYXJnLnRyaW0oKSkgOlxuICAgICAgICAgIGFyZyk7XG59XG4iXX0=