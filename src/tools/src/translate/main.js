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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUNBOzs7Ozs7T0FNRztJQUNILDJFQUF5SDtJQUN6SCwyQkFBNkI7SUFDN0IsNkJBQStCO0lBRS9CLDJFQUF1RTtJQUN2RSw2SEFBZ0Y7SUFDaEYscUZBQTREO0lBQzVELDBJQUE0RjtJQUM1RixxSEFBeUU7SUFDekUsaUpBQW9HO0lBQ3BHLGlLQUFtSDtJQUNuSCx1SkFBMEc7SUFDMUcsdUpBQTBHO0lBQzFHLGlKQUFvRztJQUNwRyxtRkFBd0M7SUFFeEMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osd0hBQXdIO1lBQzVILElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLHNHQUFzRztZQUMxRyxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGVBQWU7WUFDdEIsUUFBUSxFQUNKLDJLQUEySztZQUMvSyxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGNBQWM7WUFDckIsUUFBUSxFQUFFLElB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QUM7UUFFaEcsSUFBTSxZQUFZLEdBQ2QsaUJBQWlCLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDdEYsY0FBYyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUMsaUJBQWlCLENBQUMsY0FBYyxDQUM1QixlQUFlLENBQUMsR0FBRyxDQUFDLDBCQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQ3pGLFlBQVksQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUExQ0Qsd0NBMENDO0lBRUQ7Ozs7T0FJRztJQUNILFNBQVMscUJBQXFCLENBQUMsSUFBYztRQUMzQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQ1gsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsR0FBRyxFQUZBLENBRUEsQ0FBQyxDQUFDO0lBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtLCByZWxhdGl2ZUZyb219IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgRGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QXNzZXRUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vYXNzZXRfZmlsZXMvYXNzZXRfdHJhbnNsYXRpb25faGFuZGxlcic7XG5pbXBvcnQge2dldE91dHB1dFBhdGhGbiwgT3V0cHV0UGF0aEZufSBmcm9tICcuL291dHB1dF9wYXRoJztcbmltcG9ydCB7U291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdHJhbnNsYXRpb25faGFuZGxlcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uTG9hZGVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX2xvYWRlcic7XG5pbXBvcnQge0FyYlRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvYXJiX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3NpbXBsZV9qc29uX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1hsaWZmMVRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1hsaWZmMlRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1h0YlRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1RyYW5zbGF0b3J9IGZyb20gJy4vdHJhbnNsYXRvcic7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBjb25zdCBvcHRpb25zID1cbiAgICAgIHlhcmdzXG4gICAgICAgICAgLm9wdGlvbigncicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAncm9vdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmAuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byB0cmFuc2xhdGUsIHJlbGF0aXZlIHRvIHRoZSBgcm9vdGAgcGF0aC4gRS5nLiBgYnVuZGxlcy8qKi8qYC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ2wnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZS1sb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1RoZSBzb3VyY2UgbG9jYWxlIG9mIHRoZSBhcHBsaWNhdGlvbi4gSWYgdGhpcyBpcyBwcm92aWRlZCB0aGVuIGEgY29weSBvZiB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBjcmVhdGVkIHdpdGggbm8gdHJhbnNsYXRpb24gYnV0IGp1c3QgdGhlIGAkbG9jYWxpemVgIGNhbGxzIHN0cmlwcGVkIG91dC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ3QnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3RyYW5zbGF0aW9ucycsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGFycmF5OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgbGlzdCBvZiBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMgdG8gbG9hZCwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIGAtdCBzcmMvbG9jYWxlL21lc3NhZ2VzLmVuLnhsZiBzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZiBzcmMvbG9jYWxlL21lc3NhZ2VzLmRlLnhsZmAuXFxuJyArXG4gICAgICAgICAgICAgICAgJ0lmIHlvdSB3YW50IHRvIG1lcmdlIG11bHRpcGxlIHRyYW5zbGF0aW9uIGZpbGVzIGZvciBlYWNoIGxvY2FsZSwgdGhlbiBwcm92aWRlIHRoZSBsaXN0IG9mIGZpbGVzIGluIGFuIGFycmF5LlxcbicgK1xuICAgICAgICAgICAgICAgICdOb3RlIHRoYXQgdGhlIGFycmF5cyBtdXN0IGJlIGluIGRvdWJsZSBxdW90ZXMgaWYgeW91IGluY2x1ZGUgYW55IHdoaXRlc3BhY2Ugd2l0aGluIHRoZSBhcnJheS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBgLXQgXCJbc3JjL2xvY2FsZS9tZXNzYWdlcy5lbi54bGYsIHNyYy9sb2NhbGUvbWVzc2FnZXMtMi5lbi54bGZdXCIgW3NyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmLHNyYy9sb2NhbGUvbWVzc2FnZXMtMi5mci54bGZdYCcsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndGFyZ2V0LWxvY2FsZXMnLCB7XG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgdGFyZ2V0IGxvY2FsZXMgZm9yIHRoZSB0cmFuc2xhdGlvbiBmaWxlcywgd2hpY2ggd2lsbCBvdmVycmlkZSBhbnkgdGFyZ2V0IGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgdHJhbnNsYXRpb24gZmlsZS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBcIi10IGVuIGZyIGRlXCIuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdvJywge1xuICAgICAgICAgICAgYWxpYXM6ICdvdXRwdXRQYXRoJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdBIG91dHB1dCBwYXRoIHBhdHRlcm4gdG8gd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGUgcGF0aCBtdXN0IGJlIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhlIG1hcmtlciBge3tMT0NBTEV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0YXJnZXQgbG9jYWxlLiBFLmcuIGBkaXN0L3t7TE9DQUxFfX1gLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbScsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnbWlzc2luZ1RyYW5zbGF0aW9uJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBtaXNzaW5nIHRyYW5zbGF0aW9ucy4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydlcnJvcicsICd3YXJuaW5nJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ2QnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2R1cGxpY2F0ZVRyYW5zbGF0aW9uJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBkdXBsaWNhdGUgdHJhbnNsYXRpb25zLicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLnN0cmljdCgpXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBmcyA9IG5ldyBOb2RlSlNGaWxlU3lzdGVtKCk7XG4gIHNldEZpbGVTeXN0ZW0oZnMpO1xuXG4gIGNvbnN0IHNvdXJjZVJvb3RQYXRoID0gb3B0aW9ucy5yO1xuICBjb25zdCBzb3VyY2VGaWxlUGF0aHMgPSBnbG9iLnN5bmMob3B0aW9ucy5zLCB7Y3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHM6IChzdHJpbmd8c3RyaW5nW10pW10gPSBjb252ZXJ0QXJyYXlzRnJvbUFyZ3Mob3B0aW9ucy50KTtcbiAgY29uc3Qgb3V0cHV0UGF0aEZuID0gZ2V0T3V0cHV0UGF0aEZuKGZzLnJlc29sdmUob3B0aW9ucy5vKSk7XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gIGNvbnN0IG1pc3NpbmdUcmFuc2xhdGlvbiA9IG9wdGlvbnMubSBhcyBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgY29uc3QgZHVwbGljYXRlVHJhbnNsYXRpb24gPSBvcHRpb25zLmQgYXMgRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIGNvbnN0IHNvdXJjZUxvY2FsZTogc3RyaW5nfHVuZGVmaW5lZCA9IG9wdGlvbnMubDtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogc3RyaW5nW10gPSBvcHRpb25zWyd0YXJnZXQtbG9jYWxlcyddIHx8IFtdO1xuXG4gIHRyYW5zbGF0ZUZpbGVzKHtcbiAgICBzb3VyY2VSb290UGF0aCxcbiAgICBzb3VyY2VGaWxlUGF0aHMsXG4gICAgdHJhbnNsYXRpb25GaWxlUGF0aHMsXG4gICAgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyxcbiAgICBvdXRwdXRQYXRoRm4sXG4gICAgZGlhZ25vc3RpY3MsXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uLFxuICAgIGR1cGxpY2F0ZVRyYW5zbGF0aW9uLFxuICAgIHNvdXJjZUxvY2FsZVxuICB9KTtcblxuICBkaWFnbm9zdGljcy5tZXNzYWdlcy5mb3JFYWNoKG0gPT4gY29uc29sZS53YXJuKGAke20udHlwZX06ICR7bS5tZXNzYWdlfWApKTtcbiAgcHJvY2Vzcy5leGl0KGRpYWdub3N0aWNzLmhhc0Vycm9ycyA/IDEgOiAwKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGaWxlc09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZ1xuICAgKiBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gXG4gICAqL1xuICBzb3VyY2VSb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgcmVsYXRpdmUgdG8gdGhlIGByb290YCBwYXRoLlxuICAgKi9cbiAgc291cmNlRmlsZVBhdGhzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHBhdGhzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnRcbiAgICogd29ya2luZyBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEZvciBlYWNoIGxvY2FsZSB0byBiZSB0cmFuc2xhdGVkLCB0aGVyZSBzaG91bGQgYmUgYW4gZWxlbWVudCBpbiBgdHJhbnNsYXRpb25GaWxlUGF0aHNgLlxuICAgKiBFYWNoIGVsZW1lbnQgaXMgZWl0aGVyIGFuIGFic29sdXRlIHBhdGggdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGUsIG9yIGFuIGFycmF5IG9mIGFic29sdXRlIHBhdGhzXG4gICAqIHRvIHRyYW5zbGF0aW9uIGZpbGVzLCBmb3IgdGhhdCBsb2NhbGUuXG4gICAqXG4gICAqIElmIHRoZSBlbGVtZW50IGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgdHJhbnNsYXRpb24gZmlsZSwgdGhlbiB0aGUgdHJhbnNsYXRpb25zIGFyZSBtZXJnZWQuXG4gICAqXG4gICAqIElmIGFsbG93ZWQgYnkgdGhlIGBkdXBsaWNhdGVUcmFuc2xhdGlvbmAgcHJvcGVydHksIHdoZW4gbW9yZSB0aGFuIG9uZSB0cmFuc2xhdGlvbiBoYXMgdGhlIHNhbWVcbiAgICogbWVzc2FnZSBpZCwgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgZWFybGllciB0cmFuc2xhdGlvbiBmaWxlIGluIHRoZSBhcnJheSBpcyB1c2VkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIGZpbGVzIGFyZSBgW2FwcC54bGYsIGxpYi0xLnhsZiwgbGliLTIueGxpZl1gIHRoZW4gYSBtZXNzYWdlIHRoYXQgYXBwZWFycyBpblxuICAgKiBgYXBwLnhsZmAgd2lsbCBvdmVycmlkZSB0aGUgc2FtZSBtZXNzYWdlIGluIGBsaWItMS54bGZgIG9yIGBsaWItMi54bGZgLlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlUGF0aHM6IChzdHJpbmd8c3RyaW5nW10pW107XG4gIC8qKlxuICAgKiBBIGNvbGxlY3Rpb24gb2YgdGhlIHRhcmdldCBsb2NhbGVzIGZvciB0aGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAqXG4gICAqIElmIHRoZXJlIGlzIGEgbG9jYWxlIHByb3ZpZGVkIGluIGB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzYCB0aGVuIHRoaXMgaXMgdXNlZCByYXRoZXIgdGhhbiBhXG4gICAqIGxvY2FsZSBleHRyYWN0ZWQgZnJvbSB0aGUgZmlsZSBpdHNlbGYuXG4gICAqIElmIHRoZXJlIGlzIG5laXRoZXIgYSBwcm92aWRlZCBsb2NhbGUgbm9yIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCB0aGVuIGFuIGVycm9yIGlzXG4gICAqIHRocm93bi5cbiAgICogSWYgdGhlcmUgYXJlIGJvdGggYSBwcm92aWRlZCBsb2NhbGUgYW5kIGEgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSBmaWxlLCBhbmQgdGhleSBhcmUgbm90IHRoZVxuICAgKiBzYW1lLCB0aGVuIGEgd2FybmluZyBpcyByZXBvcnRlZC5cbiAgICovXG4gIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXM6IChzdHJpbmd8dW5kZWZpbmVkKVtdO1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIHRoZSBvdXRwdXQgcGF0aCBvZiB3aGVyZSB0aGUgdHJhbnNsYXRlZCBmaWxlcyB3aWxsIGJlXG4gICAqIHdyaXR0ZW4uIFRoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLlxuICAgKiBgZGlzdC97e0xPQ0FMRX19YC5cbiAgICovXG4gIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuO1xuICAvKipcbiAgICogQW4gb2JqZWN0IHRoYXQgd2lsbCByZWNlaXZlIGFueSBkaWFnbm9zdGljcyBtZXNzYWdlcyBkdWUgdG8gdGhlIHByb2Nlc3NpbmcuXG4gICAqL1xuICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3M7XG4gIC8qKlxuICAgKiBIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLlxuICAgKi9cbiAgbWlzc2luZ1RyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgZHVwbGljYXRlIHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIGR1cGxpY2F0ZVRyYW5zbGF0aW9uOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBmaWxlcy5cbiAgICogSWYgdGhpcyBpcyBwcm92aWRlZCB0aGVuIGEgY29weSBvZiB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBjcmVhdGVkIHdpdGggbm8gdHJhbnNsYXRpb24gYnV0IGp1c3RcbiAgICogdGhlIGAkbG9jYWxpemVgIGNhbGxzIHN0cmlwcGVkIG91dC5cbiAgICovXG4gIHNvdXJjZUxvY2FsZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZUZpbGVzKHtcbiAgc291cmNlUm9vdFBhdGgsXG4gIHNvdXJjZUZpbGVQYXRocyxcbiAgdHJhbnNsYXRpb25GaWxlUGF0aHMsXG4gIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMsXG4gIG91dHB1dFBhdGhGbixcbiAgZGlhZ25vc3RpY3MsXG4gIG1pc3NpbmdUcmFuc2xhdGlvbixcbiAgZHVwbGljYXRlVHJhbnNsYXRpb24sXG4gIHNvdXJjZUxvY2FsZVxufTogVHJhbnNsYXRlRmlsZXNPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCB0cmFuc2xhdGlvbkxvYWRlciA9IG5ldyBUcmFuc2xhdGlvbkxvYWRlcihcbiAgICAgIGZzLFxuICAgICAgW1xuICAgICAgICBuZXcgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFhsaWZmMVRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBYdGJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBBcmJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgXSxcbiAgICAgIGR1cGxpY2F0ZVRyYW5zbGF0aW9uLCBkaWFnbm9zdGljcyk7XG5cbiAgY29uc3QgcmVzb3VyY2VQcm9jZXNzb3IgPSBuZXcgVHJhbnNsYXRvcihcbiAgICAgIGZzLFxuICAgICAgW1xuICAgICAgICBuZXcgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlcihmcywge21pc3NpbmdUcmFuc2xhdGlvbn0pLFxuICAgICAgICBuZXcgQXNzZXRUcmFuc2xhdGlvbkhhbmRsZXIoZnMpLFxuICAgICAgXSxcbiAgICAgIGRpYWdub3N0aWNzKTtcblxuICAvLyBDb252ZXJ0IGFsbCB0aGUgYHRyYW5zbGF0aW9uRmlsZVBhdGhzYCBlbGVtZW50cyB0byBhcnJheXMuXG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZVBhdGhzQXJyYXlzID0gdHJhbnNsYXRpb25GaWxlUGF0aHMubWFwKFxuICAgICAgZmlsZVBhdGhzID0+XG4gICAgICAgICAgQXJyYXkuaXNBcnJheShmaWxlUGF0aHMpID8gZmlsZVBhdGhzLm1hcChwID0+IGZzLnJlc29sdmUocCkpIDogW2ZzLnJlc29sdmUoZmlsZVBhdGhzKV0pO1xuXG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9XG4gICAgICB0cmFuc2xhdGlvbkxvYWRlci5sb2FkQnVuZGxlcyh0cmFuc2xhdGlvbkZpbGVQYXRoc0FycmF5cywgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyk7XG4gIHNvdXJjZVJvb3RQYXRoID0gZnMucmVzb2x2ZShzb3VyY2VSb290UGF0aCk7XG4gIHJlc291cmNlUHJvY2Vzc29yLnRyYW5zbGF0ZUZpbGVzKFxuICAgICAgc291cmNlRmlsZVBhdGhzLm1hcChyZWxhdGl2ZUZyb20pLCBmcy5yZXNvbHZlKHNvdXJjZVJvb3RQYXRoKSwgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnMsXG4gICAgICBzb3VyY2VMb2NhbGUpO1xufVxuXG4vKipcbiAqIFBhcnNlIGVhY2ggb2YgdGhlIGdpdmVuIHN0cmluZyBgYXJnc2AgYW5kIGNvbnZlcnQgaXQgdG8gYW4gYXJyYXkgaWYgaXQgaXMgb2YgdGhlIGZvcm1cbiAqIGBbYWJjLCBkZWYsIGdoaV1gLCBpLmUuIGl0IGlzIGVuY2xvc2VkIGluIHNxdWFyZSBicmFja2V0cyB3aXRoIGNvbW1hIGRlbGltaXRlZCBpdGVtcy5cbiAqIEBwYXJhbSBhcmdzIFRoZSBzdHJpbmcgdG8gcG90ZW50aWFsbHkgY29udmVydCB0byBhcnJheXMuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRBcnJheXNGcm9tQXJncyhhcmdzOiBzdHJpbmdbXSk6IChzdHJpbmd8c3RyaW5nW10pW10ge1xuICByZXR1cm4gYXJncy5tYXAoXG4gICAgICBhcmcgPT4gKGFyZy5zdGFydHNXaXRoKCdbJykgJiYgYXJnLmVuZHNXaXRoKCddJykpID9cbiAgICAgICAgICBhcmcuc2xpY2UoMSwgLTEpLnNwbGl0KCcsJykubWFwKGFyZyA9PiBhcmcudHJpbSgpKSA6XG4gICAgICAgICAgYXJnKTtcbn1cbiJdfQ==