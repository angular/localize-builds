#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "glob", "path", "yargs", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_file_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translator", "@angular/localize/src/tools/src/diagnostics"], factory);
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
    var translation_file_loader_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_file_loader");
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
            describe: 'A glob pattern indicating what translation files to load, either absolute or relative to the current working directory. E.g. `my_proj/src/locale/messages.*.xlf.',
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
        var translationFilePaths = glob.sync(options['t'], { absolute: true, nodir: true });
        var outputPathFn = output_path_1.getOutputPathFn(options['o']);
        var diagnostics = new diagnostics_1.Diagnostics();
        var missingTranslation = options['m'];
        var sourceLocale = options['l'];
        translateFiles({ sourceRootPath: sourceRootPath, sourceFilePaths: sourceFilePaths, translationFilePaths: translationFilePaths, outputPathFn: outputPathFn, diagnostics: diagnostics,
            missingTranslation: missingTranslation, sourceLocale: sourceLocale });
        diagnostics.messages.forEach(function (m) { return console.warn(m.type + ": " + m.message); });
        process.exit(diagnostics.hasErrors ? 1 : 0);
    }
    function translateFiles(_a) {
        var sourceRootPath = _a.sourceRootPath, sourceFilePaths = _a.sourceFilePaths, translationFilePaths = _a.translationFilePaths, outputPathFn = _a.outputPathFn, diagnostics = _a.diagnostics, missingTranslation = _a.missingTranslation, sourceLocale = _a.sourceLocale;
        var translationLoader = new translation_file_loader_1.TranslationLoader([
            new xliff2_translation_parser_1.Xliff2TranslationParser(),
            new xliff1_translation_parser_1.Xliff1TranslationParser(),
            new simple_json_translation_parser_1.SimpleJsonTranslationParser(),
        ]);
        var resourceProcessor = new translator_1.Translator([
            new source_file_translation_handler_1.SourceFileTranslationHandler({ missingTranslation: missingTranslation }),
            new asset_translation_handler_1.AssetTranslationHandler(),
        ], diagnostics);
        var translations = translationLoader.loadBundles(translationFilePaths);
        sourceRootPath = path_1.resolve(sourceRootPath);
        resourceProcessor.translateFiles(sourceFilePaths, sourceRootPath, outputPathFn, translations, sourceLocale);
    }
    exports.translateFiles = translateFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsNkhBQWdGO0lBQ2hGLHFGQUE0RDtJQUM1RCwwSUFBNEY7SUFFNUYsK0hBQThFO0lBQzlFLDZLQUErSDtJQUMvSCw4SkFBaUg7SUFDakgsOEpBQWlIO0lBQ2pILG1GQUF3QztJQUN4QywyRUFBMkM7SUFFM0MsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osd0hBQXdIO1NBQzdILENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSixzR0FBc0c7U0FDM0csQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsZUFBZTtZQUN0QixRQUFRLEVBQ0osMktBQTJLO1NBQ2hMLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGNBQWM7WUFDckIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osa0tBQWtLO1NBQ3ZLLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osK0pBQStKO1NBQ3BLLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixRQUFRLEVBQUUscUNBQXFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxTQUFTO1NBQ25CLENBQUM7YUFDRCxJQUFJLEVBQUU7YUFDTixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQU0sZUFBZSxHQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNoRixJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNwRixJQUFNLFlBQVksR0FBRyw2QkFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQU0sV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQU0sa0JBQWtCLEdBQStCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRSxJQUFNLFlBQVksR0FBcUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBELGNBQWMsQ0FBQyxFQUFDLGNBQWMsZ0JBQUEsRUFBRSxlQUFlLGlCQUFBLEVBQUUsb0JBQW9CLHNCQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUUsV0FBVyxhQUFBO1lBQ2hGLGtCQUFrQixvQkFBQSxFQUFFLFlBQVksY0FBQSxFQUFDLENBQUMsQ0FBQztRQUVuRCxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUksQ0FBQyxDQUFDLElBQUksVUFBSyxDQUFDLENBQUMsT0FBUyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFZRCxTQUFnQixjQUFjLENBQUMsRUFFcUM7WUFGcEMsa0NBQWMsRUFBRSxvQ0FBZSxFQUFFLDhDQUFvQixFQUFFLDhCQUFZLEVBQ25FLDRCQUFXLEVBQUUsMENBQWtCLEVBQy9CLDhCQUFZO1FBQzFDLElBQU0saUJBQWlCLEdBQUcsSUFBSSwyQ0FBaUIsQ0FBQztZQUM5QyxJQUFJLG1EQUF1QixFQUFFO1lBQzdCLElBQUksbURBQXVCLEVBQUU7WUFDN0IsSUFBSSw0REFBMkIsRUFBRTtTQUNsQyxDQUFDLENBQUM7UUFFSCxJQUFNLGlCQUFpQixHQUFHLElBQUksdUJBQVUsQ0FDcEM7WUFDRSxJQUFJLDhEQUE0QixDQUFDLEVBQUMsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztZQUN0RCxJQUFJLG1EQUF1QixFQUFFO1NBQzlCLEVBQ0QsV0FBVyxDQUFDLENBQUM7UUFFakIsSUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDekUsY0FBYyxHQUFHLGNBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6QyxpQkFBaUIsQ0FBQyxjQUFjLENBQzVCLGVBQWUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBcEJELHdDQW9CQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0Fzc2V0VHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtnZXRPdXRwdXRQYXRoRm4sIE91dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1NvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vc291cmNlX2ZpbGVzL3NvdXJjZV9maWxlX3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneX0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkxvYWRlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9maWxlX2xvYWRlcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3NpbXBsZV9qc29uL3NpbXBsZV9qc29uX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1hsaWZmMVRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxL3hsaWZmMV90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjJUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMi94bGlmZjJfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7VHJhbnNsYXRvcn0gZnJvbSAnLi90cmFuc2xhdG9yJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdyJywge1xuICAgICAgICAgICAgYWxpYXM6ICdyb290JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1RoZSByb290IHBhdGggb2YgdGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBFLmcuIGBkaXN0L2VuYC4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byB0cmFuc2xhdGUsIHJlbGF0aXZlIHRvIHRoZSBgcm9vdGAgcGF0aC4gRS5nLiBgYnVuZGxlcy8qKi8qYC4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UtbG9jYWxlJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgc291cmNlIGxvY2FsZSBvZiB0aGUgYXBwbGljYXRpb24uIElmIHRoaXMgaXMgcHJvdmlkZWQgdGhlbiBhIGNvcHkgb2YgdGhlIGFwcGxpY2F0aW9uIHdpbGwgYmUgY3JlYXRlZCB3aXRoIG5vIHRyYW5zbGF0aW9uIGJ1dCBqdXN0IHRoZSBgJGxvY2FsaXplYCBjYWxscyBzdHJpcHBlZCBvdXQuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAndHJhbnNsYXRpb25zJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEUuZy4gYG15X3Byb2ovc3JjL2xvY2FsZS9tZXNzYWdlcy4qLnhsZi4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnb3V0cHV0UGF0aCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIG91dHB1dCBwYXRoIHBhdHRlcm4gdG8gd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuLiBUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy4gYGRpc3Qve3tMT0NBTEV9fWAuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbScsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnbWlzc2luZ1RyYW5zbGF0aW9uJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBtaXNzaW5nIHRyYW5zbGF0aW9ucy4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydlcnJvcicsICd3YXJuaW5nJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3dhcm5pbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnNbJ3InXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID1cbiAgICAgIGdsb2Iuc3luYyhvcHRpb25zWydzJ10sIHthYnNvbHV0ZTogdHJ1ZSwgY3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHMgPSBnbG9iLnN5bmMob3B0aW9uc1sndCddLCB7YWJzb2x1dGU6IHRydWUsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IG91dHB1dFBhdGhGbiA9IGdldE91dHB1dFBhdGhGbihvcHRpb25zWydvJ10pO1xuICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICBjb25zdCBtaXNzaW5nVHJhbnNsYXRpb246IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5ID0gb3B0aW9uc1snbSddO1xuICBjb25zdCBzb3VyY2VMb2NhbGU6IHN0cmluZ3x1bmRlZmluZWQgPSBvcHRpb25zWydsJ107XG5cbiAgdHJhbnNsYXRlRmlsZXMoe3NvdXJjZVJvb3RQYXRoLCBzb3VyY2VGaWxlUGF0aHMsIHRyYW5zbGF0aW9uRmlsZVBhdGhzLCBvdXRwdXRQYXRoRm4sIGRpYWdub3N0aWNzLFxuICAgICAgICAgICAgICAgICAgbWlzc2luZ1RyYW5zbGF0aW9uLCBzb3VyY2VMb2NhbGV9KTtcblxuICBkaWFnbm9zdGljcy5tZXNzYWdlcy5mb3JFYWNoKG0gPT4gY29uc29sZS53YXJuKGAke20udHlwZX06ICR7bS5tZXNzYWdlfWApKTtcbiAgcHJvY2Vzcy5leGl0KGRpYWdub3N0aWNzLmhhc0Vycm9ycyA/IDEgOiAwKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGVGaWxlc09wdGlvbnMge1xuICBzb3VyY2VSb290UGF0aDogc3RyaW5nO1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICB0cmFuc2xhdGlvbkZpbGVQYXRoczogc3RyaW5nW107XG4gIG91dHB1dFBhdGhGbjogT3V0cHV0UGF0aEZuO1xuICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3M7XG4gIG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k7XG4gIHNvdXJjZUxvY2FsZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZUZpbGVzKHtzb3VyY2VSb290UGF0aCwgc291cmNlRmlsZVBhdGhzLCB0cmFuc2xhdGlvbkZpbGVQYXRocywgb3V0cHV0UGF0aEZuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFnbm9zdGljcywgbWlzc2luZ1RyYW5zbGF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMb2NhbGV9OiBUcmFuc2xhdGVGaWxlc09wdGlvbnMpIHtcbiAgY29uc3QgdHJhbnNsYXRpb25Mb2FkZXIgPSBuZXcgVHJhbnNsYXRpb25Mb2FkZXIoW1xuICAgIG5ldyBYbGlmZjJUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgIG5ldyBYbGlmZjFUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgXSk7XG5cbiAgY29uc3QgcmVzb3VyY2VQcm9jZXNzb3IgPSBuZXcgVHJhbnNsYXRvcihcbiAgICAgIFtcbiAgICAgICAgbmV3IFNvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXIoe21pc3NpbmdUcmFuc2xhdGlvbn0pLFxuICAgICAgICBuZXcgQXNzZXRUcmFuc2xhdGlvbkhhbmRsZXIoKSxcbiAgICAgIF0sXG4gICAgICBkaWFnbm9zdGljcyk7XG5cbiAgY29uc3QgdHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25Mb2FkZXIubG9hZEJ1bmRsZXModHJhbnNsYXRpb25GaWxlUGF0aHMpO1xuICBzb3VyY2VSb290UGF0aCA9IHJlc29sdmUoc291cmNlUm9vdFBhdGgpO1xuICByZXNvdXJjZVByb2Nlc3Nvci50cmFuc2xhdGVGaWxlcyhcbiAgICAgIHNvdXJjZUZpbGVQYXRocywgc291cmNlUm9vdFBhdGgsIG91dHB1dFBhdGhGbiwgdHJhbnNsYXRpb25zLCBzb3VyY2VMb2NhbGUpO1xufVxuIl19