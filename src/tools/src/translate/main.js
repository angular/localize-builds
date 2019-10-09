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
        translateFiles({ sourceRootPath: sourceRootPath, sourceFilePaths: sourceFilePaths, translationFilePaths: translationFilePaths, outputPathFn: outputPathFn, diagnostics: diagnostics,
            missingTranslation: missingTranslation });
        diagnostics.messages.forEach(function (m) { return console.warn(m.type + ": " + m.message); });
        process.exit(diagnostics.hasErrors ? 1 : 0);
    }
    function translateFiles(_a) {
        var sourceRootPath = _a.sourceRootPath, sourceFilePaths = _a.sourceFilePaths, translationFilePaths = _a.translationFilePaths, outputPathFn = _a.outputPathFn, diagnostics = _a.diagnostics, missingTranslation = _a.missingTranslation;
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
        resourceProcessor.translateFiles(sourceFilePaths, sourceRootPath, outputPathFn, translations);
    }
    exports.translateFiles = translateFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsNkhBQWdGO0lBQ2hGLHFGQUE0RDtJQUM1RCwwSUFBNEY7SUFFNUYsK0hBQThFO0lBQzlFLDZLQUErSDtJQUMvSCw4SkFBaUg7SUFDakgsOEpBQWlIO0lBQ2pILG1GQUF3QztJQUN4QywyRUFBMkM7SUFFM0MsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osd0hBQXdIO1NBQzdILENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSixzR0FBc0c7U0FDM0csQ0FBQzthQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsY0FBYztZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSixrS0FBa0s7U0FDdkssQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsWUFBWTtZQUNuQixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSiwrSkFBK0o7U0FDcEssQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsb0JBQW9CO1lBQzNCLFFBQVEsRUFBRSxxQ0FBcUM7WUFDL0MsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7WUFDdkMsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQzthQUNELElBQUksRUFBRTthQUNOLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBTSxlQUFlLEdBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2hGLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3BGLElBQU0sWUFBWSxHQUFHLDZCQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7UUFDdEMsSUFBTSxrQkFBa0IsR0FBK0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBFLGNBQWMsQ0FBQyxFQUFDLGNBQWMsZ0JBQUEsRUFBRSxlQUFlLGlCQUFBLEVBQUUsb0JBQW9CLHNCQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUUsV0FBVyxhQUFBO1lBQ2hGLGtCQUFrQixvQkFBQSxFQUFDLENBQUMsQ0FBQztRQUVyQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUksQ0FBQyxDQUFDLElBQUksVUFBSyxDQUFDLENBQUMsT0FBUyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFXRCxTQUFnQixjQUFjLENBQUMsRUFDd0Q7WUFEdkQsa0NBQWMsRUFBRSxvQ0FBZSxFQUFFLDhDQUFvQixFQUFFLDhCQUFZLEVBQ25FLDRCQUFXLEVBQUUsMENBQWtCO1FBQzdELElBQU0saUJBQWlCLEdBQUcsSUFBSSwyQ0FBaUIsQ0FBQztZQUM5QyxJQUFJLG1EQUF1QixFQUFFO1lBQzdCLElBQUksbURBQXVCLEVBQUU7WUFDN0IsSUFBSSw0REFBMkIsRUFBRTtTQUNsQyxDQUFDLENBQUM7UUFFSCxJQUFNLGlCQUFpQixHQUFHLElBQUksdUJBQVUsQ0FDcEM7WUFDRSxJQUFJLDhEQUE0QixDQUFDLEVBQUMsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztZQUN0RCxJQUFJLG1EQUF1QixFQUFFO1NBQzlCLEVBQ0QsV0FBVyxDQUFDLENBQUM7UUFFakIsSUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDekUsY0FBYyxHQUFHLGNBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6QyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQWxCRCx3Q0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHtyZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtBc3NldFRyYW5zbGF0aW9uSGFuZGxlcn0gZnJvbSAnLi9hc3NldF9maWxlcy9hc3NldF90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7Z2V0T3V0cHV0UGF0aEZuLCBPdXRwdXRQYXRoRm59IGZyb20gJy4vb3V0cHV0X3BhdGgnO1xuaW1wb3J0IHtTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL3NvdXJjZV9maWxlcy9zb3VyY2VfZmlsZV90cmFuc2xhdGlvbl9oYW5kbGVyJztcbmltcG9ydCB7TWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3l9IGZyb20gJy4vc291cmNlX2ZpbGVzL3NvdXJjZV9maWxlX3V0aWxzJztcbmltcG9ydCB7VHJhbnNsYXRpb25Mb2FkZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fZmlsZV9sb2FkZXInO1xuaW1wb3J0IHtTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbi9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMS94bGlmZjFfdHJhbnNsYXRpb25fcGFyc2VyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy94bGlmZjIveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1RyYW5zbGF0b3J9IGZyb20gJy4vdHJhbnNsYXRvcic7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi9kaWFnbm9zdGljcyc7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBjb25zdCBvcHRpb25zID1cbiAgICAgIHlhcmdzXG4gICAgICAgICAgLm9wdGlvbigncicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAncm9vdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdUaGUgcm9vdCBwYXRoIG9mIHRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gRS5nLiBgZGlzdC9lbmAuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gdHJhbnNsYXRlLCByZWxhdGl2ZSB0byB0aGUgYHJvb3RgIHBhdGguIEUuZy4gYGJ1bmRsZXMvKiovKmAuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAndHJhbnNsYXRpb25zJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCB0cmFuc2xhdGlvbiBmaWxlcyB0byBsb2FkLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEUuZy4gYG15X3Byb2ovc3JjL2xvY2FsZS9tZXNzYWdlcy4qLnhsZi4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnb3V0cHV0UGF0aCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIG91dHB1dCBwYXRoIHBhdHRlcm4gdG8gd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuLiBUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy4gYGRpc3Qve3tMT0NBTEV9fWAuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbScsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnbWlzc2luZ1RyYW5zbGF0aW9uJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBtaXNzaW5nIHRyYW5zbGF0aW9ucy4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydlcnJvcicsICd3YXJuaW5nJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3dhcm5pbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgIC5wYXJzZShhcmdzKTtcblxuICBjb25zdCBzb3VyY2VSb290UGF0aCA9IG9wdGlvbnNbJ3InXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID1cbiAgICAgIGdsb2Iuc3luYyhvcHRpb25zWydzJ10sIHthYnNvbHV0ZTogdHJ1ZSwgY3dkOiBzb3VyY2VSb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlUGF0aHMgPSBnbG9iLnN5bmMob3B0aW9uc1sndCddLCB7YWJzb2x1dGU6IHRydWUsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IG91dHB1dFBhdGhGbiA9IGdldE91dHB1dFBhdGhGbihvcHRpb25zWydvJ10pO1xuICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICBjb25zdCBtaXNzaW5nVHJhbnNsYXRpb246IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5ID0gb3B0aW9uc1snbSddO1xuXG4gIHRyYW5zbGF0ZUZpbGVzKHtzb3VyY2VSb290UGF0aCwgc291cmNlRmlsZVBhdGhzLCB0cmFuc2xhdGlvbkZpbGVQYXRocywgb3V0cHV0UGF0aEZuLCBkaWFnbm9zdGljcyxcbiAgICAgICAgICAgICAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbn0pO1xuXG4gIGRpYWdub3N0aWNzLm1lc3NhZ2VzLmZvckVhY2gobSA9PiBjb25zb2xlLndhcm4oYCR7bS50eXBlfTogJHttLm1lc3NhZ2V9YCkpO1xuICBwcm9jZXNzLmV4aXQoZGlhZ25vc3RpY3MuaGFzRXJyb3JzID8gMSA6IDApO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zbGF0ZUZpbGVzT3B0aW9ucyB7XG4gIHNvdXJjZVJvb3RQYXRoOiBzdHJpbmc7XG4gIHNvdXJjZUZpbGVQYXRoczogc3RyaW5nW107XG4gIHRyYW5zbGF0aW9uRmlsZVBhdGhzOiBzdHJpbmdbXTtcbiAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm47XG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgbWlzc2luZ1RyYW5zbGF0aW9uOiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZUZpbGVzKHtzb3VyY2VSb290UGF0aCwgc291cmNlRmlsZVBhdGhzLCB0cmFuc2xhdGlvbkZpbGVQYXRocywgb3V0cHV0UGF0aEZuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFnbm9zdGljcywgbWlzc2luZ1RyYW5zbGF0aW9ufTogVHJhbnNsYXRlRmlsZXNPcHRpb25zKSB7XG4gIGNvbnN0IHRyYW5zbGF0aW9uTG9hZGVyID0gbmV3IFRyYW5zbGF0aW9uTG9hZGVyKFtcbiAgICBuZXcgWGxpZmYyVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICBuZXcgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICBuZXcgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyKCksXG4gIF0pO1xuXG4gIGNvbnN0IHJlc291cmNlUHJvY2Vzc29yID0gbmV3IFRyYW5zbGF0b3IoXG4gICAgICBbXG4gICAgICAgIG5ldyBTb3VyY2VGaWxlVHJhbnNsYXRpb25IYW5kbGVyKHttaXNzaW5nVHJhbnNsYXRpb259KSxcbiAgICAgICAgbmV3IEFzc2V0VHJhbnNsYXRpb25IYW5kbGVyKCksXG4gICAgICBdLFxuICAgICAgZGlhZ25vc3RpY3MpO1xuXG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9uTG9hZGVyLmxvYWRCdW5kbGVzKHRyYW5zbGF0aW9uRmlsZVBhdGhzKTtcbiAgc291cmNlUm9vdFBhdGggPSByZXNvbHZlKHNvdXJjZVJvb3RQYXRoKTtcbiAgcmVzb3VyY2VQcm9jZXNzb3IudHJhbnNsYXRlRmlsZXMoc291cmNlRmlsZVBhdGhzLCBzb3VyY2VSb290UGF0aCwgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnMpO1xufVxuIl19