#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/main", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/logging", "glob", "yargs", "@angular/localize/src/tools/src/extract/duplicates", "@angular/localize/src/tools/src/extract/extraction", "@angular/localize/src/tools/src/extract/translation_files/arb_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/format_options"], factory);
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
    var duplicates_1 = require("@angular/localize/src/tools/src/extract/duplicates");
    var extraction_1 = require("@angular/localize/src/tools/src/extract/extraction");
    var arb_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/arb_translation_serializer");
    var json_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer");
    var xliff1_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer");
    var xliff2_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer");
    var xmb_translation_serializer_1 = require("@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer");
    var format_options_1 = require("@angular/localize/src/tools/src/extract/translation_files/format_options");
    if (require.main === module) {
        var args = process.argv.slice(2);
        var options = yargs
            .option('l', {
            alias: 'locale',
            describe: 'The locale of the source being processed',
            default: 'en',
            type: 'string',
        })
            .option('r', {
            alias: 'root',
            default: '.',
            describe: 'The root path for other paths provided in these options.\n' +
                'This should either be absolute or relative to the current working directory.',
            type: 'string',
        })
            .option('s', {
            alias: 'source',
            required: true,
            describe: 'A glob pattern indicating what files to search for translations, e.g. `./dist/**/*.js`.\n' +
                'This should be relative to the root path.',
            type: 'string',
        })
            .option('f', {
            alias: 'format',
            required: true,
            choices: ['xmb', 'xlf', 'xlif', 'xliff', 'xlf2', 'xlif2', 'xliff2', 'json'],
            describe: 'The format of the translation file.',
            type: 'string',
        })
            .option('formatOptions', {
            describe: 'Additional options to pass to the translation file serializer, in the form of JSON formatted key-value string pairs:\n' +
                'For example: `--formatOptions {"xml:space":"preserve"}.\n' +
                'The meaning of the options is specific to the format being serialized.',
            type: 'string'
        })
            .option('o', {
            alias: 'outputPath',
            required: true,
            describe: 'A path to where the translation file will be written. This should be relative to the root path.',
            type: 'string',
        })
            .option('loglevel', {
            describe: 'The lowest severity logging message that should be output.',
            choices: ['debug', 'info', 'warn', 'error'],
            type: 'string',
        })
            .option('useSourceMaps', {
            type: 'boolean',
            default: true,
            describe: 'Whether to generate source information in the output files by following source-map mappings found in the source files',
        })
            .option('useLegacyIds', {
            type: 'boolean',
            default: true,
            describe: 'Whether to use the legacy id format for messages that were extracted from Angular templates.',
        })
            .option('d', {
            alias: 'duplicateMessageHandling',
            describe: 'How to handle messages with the same id but different text.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
            type: 'string',
        })
            .strict()
            .help()
            .parse(args);
        var fileSystem = new file_system_1.NodeJSFileSystem();
        file_system_1.setFileSystem(fileSystem);
        var rootPath = options.r;
        var sourceFilePaths = glob.sync(options.s, { cwd: rootPath, nodir: true });
        var logLevel = options.loglevel;
        var logger = new logging_1.ConsoleLogger(logLevel ? logging_1.LogLevel[logLevel] : logging_1.LogLevel.warn);
        var duplicateMessageHandling = options.d;
        var formatOptions = format_options_1.parseFormatOptions(options.formatOptions);
        extractTranslations({
            rootPath: rootPath,
            sourceFilePaths: sourceFilePaths,
            sourceLocale: options.l,
            format: options.f,
            outputPath: options.o,
            logger: logger,
            useSourceMaps: options.useSourceMaps,
            useLegacyIds: options.useLegacyIds,
            duplicateMessageHandling: duplicateMessageHandling,
            formatOptions: formatOptions,
            fileSystem: fileSystem,
        });
    }
    function extractTranslations(_a) {
        var e_1, _b;
        var rootPath = _a.rootPath, sourceFilePaths = _a.sourceFilePaths, sourceLocale = _a.sourceLocale, format = _a.format, output = _a.outputPath, logger = _a.logger, useSourceMaps = _a.useSourceMaps, useLegacyIds = _a.useLegacyIds, duplicateMessageHandling = _a.duplicateMessageHandling, _c = _a.formatOptions, formatOptions = _c === void 0 ? {} : _c, fs = _a.fileSystem;
        var basePath = fs.resolve(rootPath);
        var extractor = new extraction_1.MessageExtractor(fs, logger, { basePath: basePath, useSourceMaps: useSourceMaps });
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
        var diagnostics = duplicates_1.checkDuplicateMessages(fs, messages, duplicateMessageHandling, basePath);
        if (diagnostics.hasErrors) {
            throw new Error(diagnostics.formatDiagnostics('Failed to extract messages'));
        }
        var outputPath = fs.resolve(rootPath, output);
        var serializer = getSerializer(format, sourceLocale, fs.dirname(outputPath), useLegacyIds, formatOptions, fs);
        var translationFile = serializer.serialize(messages);
        fs.ensureDir(fs.dirname(outputPath));
        fs.writeFile(outputPath, translationFile);
        if (diagnostics.messages.length) {
            logger.warn(diagnostics.formatDiagnostics('Messages extracted with warnings'));
        }
    }
    exports.extractTranslations = extractTranslations;
    function getSerializer(format, sourceLocale, rootPath, useLegacyIds, formatOptions, fs) {
        if (formatOptions === void 0) { formatOptions = {}; }
        switch (format) {
            case 'xlf':
            case 'xlif':
            case 'xliff':
                return new xliff1_translation_serializer_1.Xliff1TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
            case 'xlf2':
            case 'xlif2':
            case 'xliff2':
                return new xliff2_translation_serializer_1.Xliff2TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
            case 'xmb':
                return new xmb_translation_serializer_1.XmbTranslationSerializer(rootPath, useLegacyIds, fs);
            case 'json':
                return new json_translation_serializer_1.SimpleJsonTranslationSerializer(sourceLocale);
            case 'arb':
                return new arb_translation_serializer_1.ArbTranslationSerializer(sourceLocale, rootPath, fs);
        }
        throw new Error("No translation serializer can handle the provided format: " + format);
    }
    exports.getSerializer = getSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQXdIO0lBQ3hILG1FQUF3RjtJQUV4RiwyQkFBNkI7SUFDN0IsNkJBQStCO0lBSS9CLGlGQUFvRDtJQUNwRCxpRkFBOEM7SUFFOUMsbUlBQXdGO0lBQ3hGLHFJQUFnRztJQUNoRyx5SUFBOEY7SUFDOUYseUlBQThGO0lBQzlGLG1JQUF3RjtJQUN4RiwyR0FBcUY7SUFFckYsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFNLE9BQU8sR0FDVCxLQUFLO2FBQ0EsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLDBDQUEwQztZQUNwRCxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsTUFBTTtZQUNiLE9BQU8sRUFBRSxHQUFHO1lBQ1osUUFBUSxFQUFFLDREQUE0RDtnQkFDbEUsOEVBQThFO1lBQ2xGLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLDJGQUEyRjtnQkFDM0YsMkNBQTJDO1lBQy9DLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFB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cURBQXdCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNuRTtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQTZELE1BQVEsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUF0QkQsc0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge3NldEZpbGVTeXN0ZW0sIE5vZGVKU0ZpbGVTeXN0ZW0sIEFic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q29uc29sZUxvZ2dlciwgTG9nZ2VyLCBMb2dMZXZlbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5fSBmcm9tICcuLi9kaWFnbm9zdGljcyc7XG5cbmltcG9ydCB7Y2hlY2tEdXBsaWNhdGVNZXNzYWdlc30gZnJvbSAnLi9kdXBsaWNhdGVzJztcbmltcG9ydCB7TWVzc2FnZUV4dHJhY3Rvcn0gZnJvbSAnLi9leHRyYWN0aW9uJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtBcmJUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL2pzb25fdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1hsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy94bGlmZjFfdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1hsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy94bGlmZjJfdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1htYlRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy94bWJfdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge0Zvcm1hdE9wdGlvbnMsIHBhcnNlRm9ybWF0T3B0aW9uc30gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy9mb3JtYXRfb3B0aW9ucyc7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBjb25zdCBvcHRpb25zID1cbiAgICAgIHlhcmdzXG4gICAgICAgICAgLm9wdGlvbignbCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnbG9jYWxlJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGxvY2FsZSBvZiB0aGUgc291cmNlIGJlaW5nIHByb2Nlc3NlZCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnZW4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdyJywge1xuICAgICAgICAgICAgYWxpYXM6ICdyb290JyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIHJvb3QgcGF0aCBmb3Igb3RoZXIgcGF0aHMgcHJvdmlkZWQgaW4gdGhlc2Ugb3B0aW9ucy5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhpcyBzaG91bGQgZWl0aGVyIGJlIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gc2VhcmNoIGZvciB0cmFuc2xhdGlvbnMsIGUuZy4gYC4vZGlzdC8qKi8qLmpzYC5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdmJywge1xuICAgICAgICAgICAgYWxpYXM6ICdmb3JtYXQnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ3htYicsICd4bGYnLCAneGxpZicsICd4bGlmZicsICd4bGYyJywgJ3hsaWYyJywgJ3hsaWZmMicsICdqc29uJ10sXG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBmb3JtYXQgb2YgdGhlIHRyYW5zbGF0aW9uIGZpbGUuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignZm9ybWF0T3B0aW9ucycsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBZGRpdGlvbmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZSBzZXJpYWxpemVyLCBpbiB0aGUgZm9ybSBvZiBKU09OIGZvcm1hdHRlZCBrZXktdmFsdWUgc3RyaW5nIHBhaXJzOlxcbicgK1xuICAgICAgICAgICAgICAgICdGb3IgZXhhbXBsZTogYC0tZm9ybWF0T3B0aW9ucyB7XCJ4bWw6c3BhY2VcIjpcInByZXNlcnZlXCJ9LlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGUgbWVhbmluZyBvZiB0aGUgb3B0aW9ucyBpcyBzcGVjaWZpYyB0byB0aGUgZm9ybWF0IGJlaW5nIHNlcmlhbGl6ZWQuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdvJywge1xuICAgICAgICAgICAgYWxpYXM6ICdvdXRwdXRQYXRoJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgcGF0aCB0byB3aGVyZSB0aGUgdHJhbnNsYXRpb24gZmlsZSB3aWxsIGJlIHdyaXR0ZW4uIFRoaXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByb290IHBhdGguJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbG9nbGV2ZWwnLCB7XG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBsb3dlc3Qgc2V2ZXJpdHkgbG9nZ2luZyBtZXNzYWdlIHRoYXQgc2hvdWxkIGJlIG91dHB1dC4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlU291cmNlTWFwcycsIHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnV2hldGhlciB0byBnZW5lcmF0ZSBzb3VyY2UgaW5mb3JtYXRpb24gaW4gdGhlIG91dHB1dCBmaWxlcyBieSBmb2xsb3dpbmcgc291cmNlLW1hcCBtYXBwaW5ncyBmb3VuZCBpbiB0aGUgc291cmNlIGZpbGVzJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3VzZUxlZ2FjeUlkcycsIHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnV2hldGhlciB0byB1c2UgdGhlIGxlZ2FjeSBpZCBmb3JtYXQgZm9yIG1lc3NhZ2VzIHRoYXQgd2VyZSBleHRyYWN0ZWQgZnJvbSBBbmd1bGFyIHRlbXBsYXRlcy4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignZCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnSG93IHRvIGhhbmRsZSBtZXNzYWdlcyB3aXRoIHRoZSBzYW1lIGlkIGJ1dCBkaWZmZXJlbnQgdGV4dC4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydlcnJvcicsICd3YXJuaW5nJywgJ2lnbm9yZSddLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3RyaWN0KClcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLnBhcnNlKGFyZ3MpO1xuXG4gIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZpbGVTeXN0ZW0pO1xuXG4gIGNvbnN0IHJvb3RQYXRoID0gb3B0aW9ucy5yO1xuICBjb25zdCBzb3VyY2VGaWxlUGF0aHMgPSBnbG9iLnN5bmMob3B0aW9ucy5zLCB7Y3dkOiByb290UGF0aCwgbm9kaXI6IHRydWV9KTtcbiAgY29uc3QgbG9nTGV2ZWwgPSBvcHRpb25zLmxvZ2xldmVsIGFzIChrZXlvZiB0eXBlb2YgTG9nTGV2ZWwpIHwgdW5kZWZpbmVkO1xuICBjb25zdCBsb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcihsb2dMZXZlbCA/IExvZ0xldmVsW2xvZ0xldmVsXSA6IExvZ0xldmVsLndhcm4pO1xuICBjb25zdCBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcgPSBvcHRpb25zLmQgYXMgRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIGNvbnN0IGZvcm1hdE9wdGlvbnMgPSBwYXJzZUZvcm1hdE9wdGlvbnMob3B0aW9ucy5mb3JtYXRPcHRpb25zKTtcblxuXG4gIGV4dHJhY3RUcmFuc2xhdGlvbnMoe1xuICAgIHJvb3RQYXRoLFxuICAgIHNvdXJjZUZpbGVQYXRocyxcbiAgICBzb3VyY2VMb2NhbGU6IG9wdGlvbnMubCxcbiAgICBmb3JtYXQ6IG9wdGlvbnMuZixcbiAgICBvdXRwdXRQYXRoOiBvcHRpb25zLm8sXG4gICAgbG9nZ2VyLFxuICAgIHVzZVNvdXJjZU1hcHM6IG9wdGlvbnMudXNlU291cmNlTWFwcyxcbiAgICB1c2VMZWdhY3lJZHM6IG9wdGlvbnMudXNlTGVnYWN5SWRzLFxuICAgIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZyxcbiAgICBmb3JtYXRPcHRpb25zLFxuICAgIGZpbGVTeXN0ZW0sXG4gIH0pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3RUcmFuc2xhdGlvbnNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBiZWluZyBwcm9jZXNzZWQuXG4gICAqL1xuICBzb3VyY2VMb2NhbGU6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBiYXNlIHBhdGggZm9yIG90aGVyIHBhdGhzIHByb3ZpZGVkIGluIHRoZXNlIG9wdGlvbnMuXG4gICAqIFRoaXMgc2hvdWxkIGVpdGhlciBiZSBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICovXG4gIHJvb3RQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBwYXRocyB0byBmaWxlcyB0byBzZWFyY2ggZm9yIHRyYW5zbGF0aW9ucy4gVGhlc2Ugc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZVxuICAgKiByb290UGF0aC5cbiAgICovXG4gIHNvdXJjZUZpbGVQYXRoczogc3RyaW5nW107XG4gIC8qKlxuICAgKiBUaGUgZm9ybWF0IG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlLlxuICAgKi9cbiAgZm9ybWF0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIHBhdGggdG8gd2hlcmUgdGhlIHRyYW5zbGF0aW9uIGZpbGUgd2lsbCBiZSB3cml0dGVuLiBUaGlzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcm9vdFBhdGguXG4gICAqL1xuICBvdXRwdXRQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbG9nZ2VyIHRvIHVzZSBmb3IgZGlhZ25vc3RpYyBtZXNzYWdlcy5cbiAgICovXG4gIGxvZ2dlcjogTG9nZ2VyO1xuICAvKipcbiAgICogV2hldGhlciB0byBnZW5lcmF0ZSBzb3VyY2UgaW5mb3JtYXRpb24gaW4gdGhlIG91dHB1dCBmaWxlcyBieSBmb2xsb3dpbmcgc291cmNlLW1hcCBtYXBwaW5nc1xuICAgKiBmb3VuZCBpbiB0aGUgc291cmNlIGZpbGUuXG4gICAqL1xuICB1c2VTb3VyY2VNYXBzOiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byB1c2UgdGhlIGxlZ2FjeSBpZCBmb3JtYXQgZm9yIG1lc3NhZ2VzIHRoYXQgd2VyZSBleHRyYWN0ZWQgZnJvbSBBbmd1bGFyIHRlbXBsYXRlc1xuICAgKi9cbiAgdXNlTGVnYWN5SWRzOiBib29sZWFuO1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBtZXNzYWdlcyB3aXRoIHRoZSBzYW1lIGlkIGJ1dCBub3QgdGhlIHNhbWUgdGV4dC5cbiAgICovXG4gIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZzogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG4gIC8qKlxuICAgKiBBIGNvbGxlY3Rpb24gb2YgZm9ybWF0dGluZyBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGUgc2VyaWFsaXplci5cbiAgICovXG4gIGZvcm1hdE9wdGlvbnM/OiBGb3JtYXRPcHRpb25zO1xuICAvKipcbiAgICogVGhlIGZpbGUtc3lzdGVtIGFic3RyYWN0aW9uIHRvIHVzZS5cbiAgICovXG4gIGZpbGVTeXN0ZW06IEZpbGVTeXN0ZW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VHJhbnNsYXRpb25zKHtcbiAgcm9vdFBhdGgsXG4gIHNvdXJjZUZpbGVQYXRocyxcbiAgc291cmNlTG9jYWxlLFxuICBmb3JtYXQsXG4gIG91dHB1dFBhdGg6IG91dHB1dCxcbiAgbG9nZ2VyLFxuICB1c2VTb3VyY2VNYXBzLFxuICB1c2VMZWdhY3lJZHMsXG4gIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZyxcbiAgZm9ybWF0T3B0aW9ucyA9IHt9LFxuICBmaWxlU3lzdGVtOiBmcyxcbn06IEV4dHJhY3RUcmFuc2xhdGlvbnNPcHRpb25zKSB7XG4gIGNvbnN0IGJhc2VQYXRoID0gZnMucmVzb2x2ZShyb290UGF0aCk7XG4gIGNvbnN0IGV4dHJhY3RvciA9IG5ldyBNZXNzYWdlRXh0cmFjdG9yKGZzLCBsb2dnZXIsIHtiYXNlUGF0aCwgdXNlU291cmNlTWFwc30pO1xuXG4gIGNvbnN0IG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGZpbGUgb2Ygc291cmNlRmlsZVBhdGhzKSB7XG4gICAgbWVzc2FnZXMucHVzaCguLi5leHRyYWN0b3IuZXh0cmFjdE1lc3NhZ2VzKGZpbGUpKTtcbiAgfVxuXG4gIGNvbnN0IGRpYWdub3N0aWNzID0gY2hlY2tEdXBsaWNhdGVNZXNzYWdlcyhmcywgbWVzc2FnZXMsIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZywgYmFzZVBhdGgpO1xuICBpZiAoZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKCdGYWlsZWQgdG8gZXh0cmFjdCBtZXNzYWdlcycpKTtcbiAgfVxuXG4gIGNvbnN0IG91dHB1dFBhdGggPSBmcy5yZXNvbHZlKHJvb3RQYXRoLCBvdXRwdXQpO1xuICBjb25zdCBzZXJpYWxpemVyID1cbiAgICAgIGdldFNlcmlhbGl6ZXIoZm9ybWF0LCBzb3VyY2VMb2NhbGUsIGZzLmRpcm5hbWUob3V0cHV0UGF0aCksIHVzZUxlZ2FjeUlkcywgZm9ybWF0T3B0aW9ucywgZnMpO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShtZXNzYWdlcyk7XG4gIGZzLmVuc3VyZURpcihmcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0aW9uRmlsZSk7XG5cbiAgaWYgKGRpYWdub3N0aWNzLm1lc3NhZ2VzLmxlbmd0aCkge1xuICAgIGxvZ2dlci53YXJuKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKCdNZXNzYWdlcyBleHRyYWN0ZWQgd2l0aCB3YXJuaW5ncycpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VyaWFsaXplcihcbiAgICBmb3JtYXQ6IHN0cmluZywgc291cmNlTG9jYWxlOiBzdHJpbmcsIHJvb3RQYXRoOiBBYnNvbHV0ZUZzUGF0aCwgdXNlTGVnYWN5SWRzOiBib29sZWFuLFxuICAgIGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnMgPSB7fSwgZnM6IEZpbGVTeXN0ZW0pOiBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgJ3hsZic6XG4gICAgY2FzZSAneGxpZic6XG4gICAgY2FzZSAneGxpZmYnOlxuICAgICAgcmV0dXJuIG5ldyBYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXIoXG4gICAgICAgICAgc291cmNlTG9jYWxlLCByb290UGF0aCwgdXNlTGVnYWN5SWRzLCBmb3JtYXRPcHRpb25zLCBmcyk7XG4gICAgY2FzZSAneGxmMic6XG4gICAgY2FzZSAneGxpZjInOlxuICAgIGNhc2UgJ3hsaWZmMic6XG4gICAgICByZXR1cm4gbmV3IFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplcihcbiAgICAgICAgICBzb3VyY2VMb2NhbGUsIHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMsIGZvcm1hdE9wdGlvbnMsIGZzKTtcbiAgICBjYXNlICd4bWInOlxuICAgICAgcmV0dXJuIG5ldyBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXIocm9vdFBhdGgsIHVzZUxlZ2FjeUlkcywgZnMpO1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgcmV0dXJuIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSk7XG4gICAgY2FzZSAnYXJiJzpcbiAgICAgIHJldHVybiBuZXcgQXJiVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSwgcm9vdFBhdGgsIGZzKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgY2FuIGhhbmRsZSB0aGUgcHJvdmlkZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcbn1cbiJdfQ==