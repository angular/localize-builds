#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "glob", "path", "yargs", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translator", "@angular/localize/src/tools/src/diagnostics"], factory);
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
    var asset_translation_handler_1 = require("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler");
    var output_path_1 = require("@angular/localize/src/tools/src/translate/output_path");
    var source_file_translation_handler_1 = require("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler");
    var translation_loader_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_loader");
    var simple_json_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json/simple_json_translation_parser");
    var xliff1_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_translation_parser");
    var xliff2_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_translation_parser");
    var translator_1 = require("@angular/localize/src/tools/src/translate/translator");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
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
                'E.g. "-t src/locale/messages.en.xlf src/locale/messages.fr.xlf src/locale/messages.de.xlf".',
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
            .help()
            .parse(args);
        var sourceRootPath = options['r'];
        var sourceFilePaths = glob.sync(options['s'], { absolute: true, cwd: sourceRootPath, nodir: true });
        var translationFilePaths = options['t'];
        var outputPathFn = output_path_1.getOutputPathFn(options['o']);
        var diagnostics = new diagnostics_1.Diagnostics();
        var missingTranslation = options['m'];
        var sourceLocale = options['l'];
        var translationFileLocales = options['target-locales'] || [];
        translateFiles({ sourceRootPath: sourceRootPath, sourceFilePaths: sourceFilePaths, translationFilePaths: translationFilePaths, translationFileLocales: translationFileLocales,
            outputPathFn: outputPathFn, diagnostics: diagnostics, missingTranslation: missingTranslation, sourceLocale: sourceLocale });
        diagnostics.messages.forEach(function (m) { return console.warn(m.type + ": " + m.message); });
        process.exit(diagnostics.hasErrors ? 1 : 0);
    }
    function translateFiles(_a) {
        var sourceRootPath = _a.sourceRootPath, sourceFilePaths = _a.sourceFilePaths, translationFilePaths = _a.translationFilePaths, translationFileLocales = _a.translationFileLocales, outputPathFn = _a.outputPathFn, diagnostics = _a.diagnostics, missingTranslation = _a.missingTranslation, sourceLocale = _a.sourceLocale;
        var translationLoader = new translation_loader_1.TranslationLoader([
            new xliff2_translation_parser_1.Xliff2TranslationParser(),
            new xliff1_translation_parser_1.Xliff1TranslationParser(),
            new simple_json_translation_parser_1.SimpleJsonTranslationParser(),
        ], diagnostics);
        var resourceProcessor = new translator_1.Translator([
            new source_file_translation_handler_1.SourceFileTranslationHandler({ missingTranslation: missingTranslation }),
            new asset_translation_handler_1.AssetTranslationHandler(),
        ], diagnostics);
        var translations = translationLoader.loadBundles(translationFilePaths, translationFileLocales);
        sourceRootPath = path_1.resolve(sourceRootPath);
        resourceProcessor.translateFiles(sourceFilePaths, sourceRootPath, outputPathFn, translations, sourceLocale);
    }
    exports.translateFiles = translateFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsNkhBQWdGO0lBQ2hGLHFGQUE0RDtJQUM1RCwwSUFBNEY7SUFFNUYscUhBQXlFO0lBQ3pFLDZLQUErSDtJQUMvSCw4SkFBaUg7SUFDakgsOEpBQWlIO0lBQ2pILG1GQUF3QztJQUN4QywyRUFBMkM7SUFFM0MsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osd0hBQXdIO1NBQzdILENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSixzR0FBc0c7U0FDM0csQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsZUFBZTtZQUN0QixRQUFRLEVBQ0osMktBQTJLO1NBQ2hMLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGNBQWM7WUFDckIsUUFBUSxFQUFFLElBQUk7WUFDZCxLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFDSixtSEFBbUg7Z0JBQ25ILDZGQUE2RjtTQUNsRyxDQUFDO2FBRUQsTUFBTSxDQUFDLGdC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LENBQzVCLGVBQWUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBdEJELHdDQXNCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0Fzc2V0VHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtnZXRPdXRwdXRQYXRoRm4sIE91dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1NvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vc291cmNlX2ZpbGVzL3NvdXJjZV9maWxlX3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneX0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkxvYWRlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9sb2FkZXInO1xuaW1wb3J0IHtTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbi9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMS94bGlmZjFfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjIveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1RyYW5zbGF0b3J9IGZyb20gJy4vdHJhbnNsYXRvcic7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi9kaWFnbm9zdGljcyc7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBjb25zdCBvcHRpb25zID1cbiAgICAgIHlhcmdzXG4gICAgICAgICAgLm9wdGlvbigncicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAncm9vdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmAuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguIEUuZy4gYGJ1bmRsZXMvKiovKmAuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlLWxvY2FsZScsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnVGhlIHNvdXJjZSBsb2NhbGUgb2YgdGhlIGFwcGxpY2F0aW9uLiBJZiB0aGlzIGlzIHByb3ZpZGVkIHRoZW4gYSBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgd2l0aCBubyB0cmFuc2xhdGlvbiBidXQganVzdCB0aGUgYCRsb2NhbGl6ZWAgY2FsbHMgc3RyaXBwZWQgb3V0LicsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ3QnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3RyYW5zbGF0aW9ucycsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGFycmF5OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgbGlzdCBvZiBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMgdG8gbG9hZCwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIFwiLXQgc3JjL2xvY2FsZS9tZXNzYWdlcy5lbi54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYgc3JjL2xvY2FsZS9tZXNzYWdlcy5kZS54bGZcIi4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCd0YXJnZXQtbG9jYWxlcycsIHtcbiAgICAgICAgICAgIGFycmF5OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgbGlzdCBvZiB0YXJnZXQgbG9jYWxlcyBmb3IgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLCB3aGljaCB3aWxsIG92ZXJyaWRlIGFueSB0YXJnZXQgbG9jYWxlIHBhcnNlZCBmcm9tIHRoZSB0cmFuc2xhdGlvbiBmaWxlLlxcbicgK1xuICAgICAgICAgICAgICAgICdFLmcuIFwiLXQgZW4gZnIgZGVcIi4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdvJywge1xuICAgICAgICAgICAgYWxpYXM6ICdvdXRwdXRQYXRoJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0Egb3V0cHV0IHBhdGggcGF0dGVybiB0byB3aGVyZSB0aGUgdHJhbnNsYXRlZCBmaWxlcyB3aWxsIGJlIHdyaXR0ZW4uIFRoZSBtYXJrZXIgYHt7TE9DQUxFfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGFyZ2V0IGxvY2FsZS4gRS5nLiBgZGlzdC97e0xPQ0FMRX19YC4nXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ20nLCB7XG4gICAgICAgICAgICBhbGlhczogJ21pc3NpbmdUcmFuc2xhdGlvbicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0hvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuJyxcbiAgICAgICAgICAgIGNob2ljZXM6IFsnZXJyb3InLCAnd2FybmluZycsICdpZ25vcmUnXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd3YXJuaW5nJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnNbJ3InXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID1cbiAgICAgIGdsb2Iuc3luYyhvcHRpb25zWydzJ10sIHthYnNvbHV0ZTogdHJ1ZSwgY3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHM6IHN0cmluZ1tdID0gb3B0aW9uc1sndCddO1xuICBjb25zdCBvdXRwdXRQYXRoRm4gPSBnZXRPdXRwdXRQYXRoRm4ob3B0aW9uc1snbyddKTtcbiAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgY29uc3QgbWlzc2luZ1RyYW5zbGF0aW9uOiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9IG9wdGlvbnNbJ20nXTtcbiAgY29uc3Qgc291cmNlTG9jYWxlOiBzdHJpbmd8dW5kZWZpbmVkID0gb3B0aW9uc1snbCddO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiBzdHJpbmdbXSA9IG9wdGlvbnNbJ3RhcmdldC1sb2NhbGVzJ10gfHwgW107XG5cbiAgdHJhbnNsYXRlRmlsZXMoe3NvdXJjZVJvb3RQYXRoLCBzb3VyY2VGaWxlUGF0aHMsIHRyYW5zbGF0aW9uRmlsZVBhdGhzLCB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzLFxuICAgICAgICAgICAgICAgICAgb3V0cHV0UGF0aEZuLCBkaWFnbm9zdGljcywgbWlzc2luZ1RyYW5zbGF0aW9uLCBzb3VyY2VMb2NhbGV9KTtcblxuICBkaWFnbm9zdGljcy5tZXNzYWdlcy5mb3JFYWNoKG0gPT4gY29uc29sZS53YXJuKGAke20udHlwZX06ICR7bS5tZXNzYWdlfWApKTtcbiAgcHJvY2Vzcy5leGl0KGRpYWdub3N0aWNzLmhhc0Vycm9ycyA/IDEgOiAwKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGaWxlc09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZ1xuICAgKiBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gXG4gICAqL1xuICBzb3VyY2VSb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgcmVsYXRpdmUgdG8gdGhlIGByb290YCBwYXRoLlxuICAgKi9cbiAgc291cmNlRmlsZVBhdGhzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHBhdGhzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnRcbiAgICogd29ya2luZyBkaXJlY3RvcnkuXG4gICAqL1xuICB0cmFuc2xhdGlvbkZpbGVQYXRoczogc3RyaW5nW107XG4gIC8qKlxuICAgKiBBIGNvbGxlY3Rpb24gb2YgdGhlIHRhcmdldCBsb2NhbGVzIGZvciB0aGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAqL1xuICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzOiAoc3RyaW5nfHVuZGVmaW5lZClbXTtcbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGUgb3V0cHV0IHBhdGggb2Ygd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuLlxuICAgKiBUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy4gYGRpc3Qve3tMT0NBTEV9fWAuXG4gICAqL1xuICBvdXRwdXRQYXRoRm46IE91dHB1dFBhdGhGbjtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCB0aGF0IHdpbGwgcmVjZWl2ZSBhbnkgZGlhZ25vc3RpY3MgbWVzc2FnZXMgZHVlIHRvIHRoZSBwcm9jZXNzaW5nLlxuICAgKi9cbiAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzO1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBtaXNzaW5nIHRyYW5zbGF0aW9ucy5cbiAgICovXG4gIG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k7XG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgZmlsZXMuXG4gICAqIElmIHRoaXMgaXMgcHJvdmlkZWQgdGhlbiBhIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIHdpbGwgYmUgY3JlYXRlZCB3aXRoIG5vIHRyYW5zbGF0aW9uIGJ1dCBqdXN0XG4gICAqIHRoZSBgJGxvY2FsaXplYCBjYWxscyBzdHJpcHBlZCBvdXQuXG4gICAqL1xuICBzb3VyY2VMb2NhbGU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGVGaWxlcyh7c291cmNlUm9vdFBhdGgsIHNvdXJjZUZpbGVQYXRocywgdHJhbnNsYXRpb25GaWxlUGF0aHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMsIG91dHB1dFBhdGhGbiwgZGlhZ25vc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbiwgc291cmNlTG9jYWxlfTogVHJhbnNsYXRlRmlsZXNPcHRpb25zKSB7XG4gIGNvbnN0IHRyYW5zbGF0aW9uTG9hZGVyID0gbmV3IFRyYW5zbGF0aW9uTG9hZGVyKFxuICAgICAgW1xuICAgICAgICBuZXcgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFhsaWZmMVRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljcyk7XG5cbiAgY29uc3QgcmVzb3VyY2VQcm9jZXNzb3IgPSBuZXcgVHJhbnNsYXRvcihcbiAgICAgIFtcbiAgICAgICAgbmV3IFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIoe21pc3NpbmdUcmFuc2xhdGlvbn0pLFxuICAgICAgICBuZXcgQXNzZXRUcmFuc2xhdGlvbkhhbmRsZXIoKSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljcyk7XG5cbiAgY29uc3QgdHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25Mb2FkZXIubG9hZEJ1bmRsZXModHJhbnNsYXRpb25GaWxlUGF0aHMsIHRyYW5zbGF0aW9uRmlsZUxvY2FsZXMpO1xuICBzb3VyY2VSb290UGF0aCA9IHJlc29sdmUoc291cmNlUm9vdFBhdGgpO1xuICByZXNvdXJjZVByb2Nlc3Nvci50cmFuc2xhdGVGaWxlcyhcbiAgICAgIHNvdXJjZUZpbGVQYXRocywgc291cmNlUm9vdFBhdGgsIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zLCBzb3VyY2VMb2NhbGUpO1xufVxuIl19