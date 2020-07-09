#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/main", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/logging", "glob", "yargs", "@angular/localize/src/tools/src/extract/extraction", "@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSerializer = exports.extractTranslations = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var logging_1 = require("@angular/compiler-cli/src/ngtsc/logging");
    var glob = require("glob");
    var yargs = require("yargs");
    var extraction_1 = require("@angular/localize/src/tools/src/extract/extraction");
    var json_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer");
    var xliff1_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer");
    var xliff2_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer");
    var xmb_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer");
    if (require.main === module) {
        var args = process.argv.slice(2);
        var options = yargs
            .option('l', {
            alias: 'locale',
            describe: 'The locale of the source being processed',
            default: 'en',
        })
            .option('r', {
            alias: 'root',
            default: '.',
            describe: 'The root path for other paths provided in these options.\n' +
                'This should either be absolute or relative to the current working directory.'
        })
            .option('s', {
            alias: 'source',
            required: true,
            describe: 'A glob pattern indicating what files to search for translations, e.g. `./dist/**/*.js`.\n' +
                'This should be relative to the root path.',
        })
            .option('f', {
            alias: 'format',
            required: true,
            choices: ['xmb', 'xlf', 'xlif', 'xliff', 'xlf2', 'xlif2', 'xliff2', 'json'],
            describe: 'The format of the translation file.',
        })
            .option('o', {
            alias: 'outputPath',
            required: true,
            describe: 'A path to where the translation file will be written. This should be relative to the root path.'
        })
            .option('loglevel', {
            describe: 'The lowest severity logging message that should be output.',
            choices: ['debug', 'info', 'warn', 'error'],
        })
            .option('useSourceMaps', {
            type: 'boolean',
            default: true,
            describe: 'Whether to generate source information in the output files by following source-map mappings found in the source files'
        })
            .option('useLegacyIds', {
            type: 'boolean',
            default: true,
            describe: 'Whether to use the legacy id format for messages that were extracted from Angular templates.'
        })
            .strict()
            .help()
            .parse(args);
        var fs = new file_system_1.NodeJSFileSystem();
        file_system_1.setFileSystem(fs);
        var rootPath = options['root'];
        var sourceFilePaths = glob.sync(options['source'], { cwd: rootPath, nodir: true });
        var logLevel = options['loglevel'];
        var logger = new logging_1.ConsoleLogger(logLevel ? logging_1.LogLevel[logLevel] : logging_1.LogLevel.warn);
        extractTranslations({
            rootPath: rootPath,
            sourceFilePaths: sourceFilePaths,
            sourceLocale: options['locale'],
            format: options['format'],
            outputPath: options['outputPath'],
            logger: logger,
            useSourceMaps: options['useSourceMaps'],
            useLegacyIds: options['useLegacyIds'],
        });
    }
    function extractTranslations(_a) {
        var e_1, _b;
        var rootPath = _a.rootPath, sourceFilePaths = _a.sourceFilePaths, sourceLocale = _a.sourceLocale, format = _a.format, output = _a.outputPath, logger = _a.logger, useSourceMaps = _a.useSourceMaps, useLegacyIds = _a.useLegacyIds;
        var fs = file_system_1.getFileSystem();
        var extractor = new extraction_1.MessageExtractor(fs, logger, { basePath: fs.resolve(rootPath), useSourceMaps: useSourceMaps });
        var messages = [];
        try {
            for (var sourceFilePaths_1 = tslib_1.__values(sourceFilePaths), sourceFilePaths_1_1 = sourceFilePaths_1.next(); !sourceFilePaths_1_1.done; sourceFilePaths_1_1 = sourceFilePaths_1.next()) {
                var file = sourceFilePaths_1_1.value;
                messages.push.apply(messages, tslib_1.__spread(extractor.extractMessages(file)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sourceFilePaths_1_1 && !sourceFilePaths_1_1.done && (_b = sourceFilePaths_1.return)) _b.call(sourceFilePaths_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var outputPath = fs.resolve(rootPath, output);
        var serializer = getSerializer(format, sourceLocale, fs.dirname(outputPath), useLegacyIds);
        var translationFile = serializer.serialize(messages);
        fs.ensureDir(fs.dirname(outputPath));
        fs.writeFile(outputPath, translationFile);
    }
    exports.extractTranslations = extractTranslations;
    function getSerializer(format, sourceLocale, rootPath, useLegacyIds) {
        switch (format) {
            case 'xlf':
            case 'xlif':
            case 'xliff':
                return new xliff1_translation_serializer_1.Xliff1TranslationSerializer(sourceLocale, rootPath, useLegacyIds);
            case 'xlf2':
            case 'xlif2':
            case 'xliff2':
                return new xliff2_translation_serializer_1.Xliff2TranslationSerializer(sourceLocale, rootPath, useLegacyIds);
            case 'xmb':
                return new xmb_translation_serializer_1.XmbTranslationSerializer(rootPath, useLegacyIds);
            case 'json':
                return new json_translation_serializer_1.SimpleJsonTranslationSerializer(sourceLocale);
        }
        throw new Error("No translation serializer can handle the provided format: " + format);
    }
    exports.getSerializer = getSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQTJIO0lBQzNILG1FQUF3RjtJQUV4RiwyQkFBNkI7SUFDN0IsNkJBQStCO0lBQy9CLGlGQUE4QztJQUU5QyxxSUFBZ0c7SUFDaEcseUlBQThGO0lBQzlGLHlJQUE4RjtJQUM5RixtSUFBd0Y7SUFFeEYsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLDBDQUEwQztZQUNwRCxPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLE1BQU07WUFDYixPQUFPLEVBQUUsR0FBRztZQUNaLFFBQVEsRUFBRSw0REFBNEQ7Z0JBQ2xFLDhFQUE4RTtTQUNuRixDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osMkZBQTJGO2dCQUMzRiwyQ0FBMkM7U0FDaEQsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVB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TSxVQUFVLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM3RixJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUF4QkQsa0RBd0JDO0lBRUQsU0FBZ0IsYUFBYSxDQUN6QixNQUFjLEVBQUUsWUFBb0IsRUFBRSxRQUF3QixFQUM5RCxZQUFxQjtRQUN2QixRQUFRLE1BQU0sRUFBRTtZQUNkLEtBQUssS0FBSyxDQUFDO1lBQ1gsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxJQUFJLDJEQUEyQixDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDL0UsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssUUFBUTtnQkFDWCxPQUFPLElBQUksMkRBQTJCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMvRSxLQUFLLEtBQUs7Z0JBQ1IsT0FBTyxJQUFJLHFEQUF3QixDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM5RCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyxJQUFJLDZEQUErQixDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQywrREFBNkQsTUFBUSxDQUFDLENBQUM7SUFDekYsQ0FBQztJQWxCRCxzQ0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Z2V0RmlsZVN5c3RlbSwgc2V0RmlsZVN5c3RlbSwgTm9kZUpTRmlsZVN5c3RlbSwgQWJzb2x1dGVGc1BhdGh9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtDb25zb2xlTG9nZ2VyLCBMb2dnZXIsIExvZ0xldmVsfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2xvZ2dpbmcnO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2V9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQge01lc3NhZ2VFeHRyYWN0b3J9IGZyb20gJy4vZXh0cmFjdGlvbic7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7U2ltcGxlSnNvblRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy9qc29uX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgY29uc3Qgb3B0aW9ucyA9XG4gICAgICB5YXJnc1xuICAgICAgICAgIC5vcHRpb24oJ2wnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2xvY2FsZScsXG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBiZWluZyBwcm9jZXNzZWQnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ2VuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgZGVmYXVsdDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgcm9vdCBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byBzZWFyY2ggZm9yIHRyYW5zbGF0aW9ucywgZS5nLiBgLi9kaXN0LyoqLyouanNgLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcm9vdCBwYXRoLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdmJywge1xuICAgICAgICAgICAgYWxpYXM6ICdmb3JtYXQnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ3htYicsICd4bGYnLCAneGxpZicsICd4bGlmZicsICd4bGYyJywgJ3hsaWYyJywgJ3hsaWZmMicsICdqc29uJ10sXG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBmb3JtYXQgb2YgdGhlIHRyYW5zbGF0aW9uIGZpbGUuJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ28nLCB7XG4gICAgICAgICAgICBhbGlhczogJ291dHB1dFBhdGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdsb2dsZXZlbCcsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGxvd2VzdCBzZXZlcml0eSBsb2dnaW5nIG1lc3NhZ2UgdGhhdCBzaG91bGQgYmUgb3V0cHV0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlU291cmNlTWFwcycsIHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnV2hldGhlciB0byBnZW5lcmF0ZSBzb3VyY2UgaW5mb3JtYXRpb24gaW4gdGhlIG91dHB1dCBmaWxlcyBieSBmb2xsb3dpbmcgc291cmNlLW1hcCBtYXBwaW5ncyBmb3VuZCBpbiB0aGUgc291cmNlIGZpbGVzJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlTGVnYWN5SWRzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIHVzZSB0aGUgbGVnYWN5IGlkIGZvcm1hdCBmb3IgbWVzc2FnZXMgdGhhdCB3ZXJlIGV4dHJhY3RlZCBmcm9tIEFuZ3VsYXIgdGVtcGxhdGVzLidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZnMgPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZzKTtcblxuICBjb25zdCByb290UGF0aCA9IG9wdGlvbnNbJ3Jvb3QnXTtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID0gZ2xvYi5zeW5jKG9wdGlvbnNbJ3NvdXJjZSddLCB7Y3dkOiByb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgbG9nTGV2ZWwgPSBvcHRpb25zWydsb2dsZXZlbCddIGFzIChrZXlvZiB0eXBlb2YgTG9nTGV2ZWwpIHwgdW5kZWZpbmVkO1xuICBjb25zdCBsb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcihsb2dMZXZlbCA/IExvZ0xldmVsW2xvZ0xldmVsXSA6IExvZ0xldmVsLndhcm4pO1xuXG5cbiAgZXh0cmFjdFRyYW5zbGF0aW9ucyh7XG4gICAgcm9vdFBhdGgsXG4gICAgc291cmNlRmlsZVBhdGhzLFxuICAgIHNvdXJjZUxvY2FsZTogb3B0aW9uc1snbG9jYWxlJ10sXG4gICAgZm9ybWF0OiBvcHRpb25zWydmb3JtYXQnXSxcbiAgICBvdXRwdXRQYXRoOiBvcHRpb25zWydvdXRwdXRQYXRoJ10sXG4gICAgbG9nZ2VyLFxuICAgIHVzZVNvdXJjZU1hcHM6IG9wdGlvbnNbJ3VzZVNvdXJjZU1hcHMnXSxcbiAgICB1c2VMZWdhY3lJZHM6IG9wdGlvbnNbJ3VzZUxlZ2FjeUlkcyddLFxuICB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHRyYWN0VHJhbnNsYXRpb25zT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkLlxuICAgKi9cbiAgc291cmNlTG9jYWxlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgYmFzZSBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxuICAgKiBUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gICAqL1xuICByb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcGF0aHMgdG8gZmlsZXMgdG8gc2VhcmNoIGZvciB0cmFuc2xhdGlvbnMuIFRoZXNlIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGVcbiAgICogcm9vdFBhdGguXG4gICAqL1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIGZvcm1hdCBvZiB0aGUgdHJhbnNsYXRpb24gZmlsZS5cbiAgICovXG4gIGZvcm1hdDogc3RyaW5nO1xuICAvKipcbiAgICogQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3RQYXRoLlxuICAgKi9cbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGxvZ2dlciB0byB1c2UgZm9yIGRpYWdub3N0aWMgbWVzc2FnZXMuXG4gICAqL1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgc291cmNlIGluZm9ybWF0aW9uIGluIHRoZSBvdXRwdXQgZmlsZXMgYnkgZm9sbG93aW5nIHNvdXJjZS1tYXAgbWFwcGluZ3NcbiAgICogZm91bmQgaW4gdGhlIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIHRoZSBsZWdhY3kgaWQgZm9ybWF0IGZvciBtZXNzYWdlcyB0aGF0IHdlcmUgZXh0cmFjdGVkIGZyb20gQW5ndWxhciB0ZW1wbGF0ZXNcbiAgICovXG4gIHVzZUxlZ2FjeUlkczogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RUcmFuc2xhdGlvbnMoe1xuICByb290UGF0aCxcbiAgc291cmNlRmlsZVBhdGhzLFxuICBzb3VyY2VMb2NhbGUsXG4gIGZvcm1hdCxcbiAgb3V0cHV0UGF0aDogb3V0cHV0LFxuICBsb2dnZXIsXG4gIHVzZVNvdXJjZU1hcHMsXG4gIHVzZUxlZ2FjeUlkc1xufTogRXh0cmFjdFRyYW5zbGF0aW9uc09wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSBnZXRGaWxlU3lzdGVtKCk7XG4gIGNvbnN0IGV4dHJhY3RvciA9XG4gICAgICBuZXcgTWVzc2FnZUV4dHJhY3RvcihmcywgbG9nZ2VyLCB7YmFzZVBhdGg6IGZzLnJlc29sdmUocm9vdFBhdGgpLCB1c2VTb3VyY2VNYXBzfSk7XG5cbiAgY29uc3QgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdID0gW107XG4gIGZvciAoY29uc3QgZmlsZSBvZiBzb3VyY2VGaWxlUGF0aHMpIHtcbiAgICBtZXNzYWdlcy5wdXNoKC4uLmV4dHJhY3Rvci5leHRyYWN0TWVzc2FnZXMoZmlsZSkpO1xuICB9XG5cbiAgY29uc3Qgb3V0cHV0UGF0aCA9IGZzLnJlc29sdmUocm9vdFBhdGgsIG91dHB1dCk7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBnZXRTZXJpYWxpemVyKGZvcm1hdCwgc291cmNlTG9jYWxlLCBmcy5kaXJuYW1lKG91dHB1dFBhdGgpLCB1c2VMZWdhY3lJZHMpO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShtZXNzYWdlcyk7XG4gIGZzLmVuc3VyZURpcihmcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0aW9uRmlsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXJpYWxpemVyKFxuICAgIGZvcm1hdDogc3RyaW5nLCBzb3VyY2VMb2NhbGU6IHN0cmluZywgcm9vdFBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgIHVzZUxlZ2FjeUlkczogYm9vbGVhbik6IFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgY2FzZSAneGxmJzpcbiAgICBjYXNlICd4bGlmJzpcbiAgICBjYXNlICd4bGlmZic6XG4gICAgICByZXR1cm4gbmV3IFhsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcihzb3VyY2VMb2NhbGUsIHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMpO1xuICAgIGNhc2UgJ3hsZjInOlxuICAgIGNhc2UgJ3hsaWYyJzpcbiAgICBjYXNlICd4bGlmZjInOlxuICAgICAgcmV0dXJuIG5ldyBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXIoc291cmNlTG9jYWxlLCByb290UGF0aCwgdXNlTGVnYWN5SWRzKTtcbiAgICBjYXNlICd4bWInOlxuICAgICAgcmV0dXJuIG5ldyBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXIocm9vdFBhdGgsIHVzZUxlZ2FjeUlkcyk7XG4gICAgY2FzZSAnanNvbic6XG4gICAgICByZXR1cm4gbmV3IFNpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXIoc291cmNlTG9jYWxlKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgY2FuIGhhbmRsZSB0aGUgcHJvdmlkZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcbn0iXX0=