#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/main", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/logging", "glob", "yargs", "@angular/localize/src/tools/src/extract/duplicates", "@angular/localize/src/tools/src/extract/extraction", "@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/format_options"], factory);
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
        var fs = new file_system_1.NodeJSFileSystem();
        file_system_1.setFileSystem(fs);
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
        });
    }
    function extractTranslations(_a) {
        var e_1, _b;
        var rootPath = _a.rootPath, sourceFilePaths = _a.sourceFilePaths, sourceLocale = _a.sourceLocale, format = _a.format, output = _a.outputPath, logger = _a.logger, useSourceMaps = _a.useSourceMaps, useLegacyIds = _a.useLegacyIds, duplicateMessageHandling = _a.duplicateMessageHandling, _c = _a.formatOptions, formatOptions = _c === void 0 ? {} : _c;
        var fs = file_system_1.getFileSystem();
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
        var serializer = getSerializer(format, sourceLocale, fs.dirname(outputPath), useLegacyIds, formatOptions);
        var translationFile = serializer.serialize(messages);
        fs.ensureDir(fs.dirname(outputPath));
        fs.writeFile(outputPath, translationFile);
        if (diagnostics.messages.length) {
            logger.warn(diagnostics.formatDiagnostics('Messages extracted with warnings'));
        }
    }
    exports.extractTranslations = extractTranslations;
    function getSerializer(format, sourceLocale, rootPath, useLegacyIds, formatOptions) {
        if (formatOptions === void 0) { formatOptions = {}; }
        switch (format) {
            case 'xlf':
            case 'xlif':
            case 'xliff':
                return new xliff1_translation_serializer_1.Xliff1TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions);
            case 'xlf2':
            case 'xlif2':
            case 'xliff2':
                return new xliff2_translation_serializer_1.Xliff2TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions);
            case 'xmb':
                return new xmb_translation_serializer_1.XmbTranslationSerializer(rootPath, useLegacyIds);
            case 'json':
                return new json_translation_serializer_1.SimpleJsonTranslationSerializer(sourceLocale);
        }
        throw new Error("No translation serializer can handle the provided format: " + format);
    }
    exports.getSerializer = getSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQTJIO0lBQzNILG1FQUF3RjtJQUV4RiwyQkFBNkI7SUFDN0IsNkJBQStCO0lBSS9CLGlGQUFvRDtJQUNwRCxpRkFBOEM7SUFFOUMscUlBQWdHO0lBQ2hHLHlJQUE4RjtJQUM5Rix5SUFBOEY7SUFDOUYsbUlBQXdGO0lBQ3hGLDJHQUFxRjtJQUVyRixJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzNCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUNULEtBQUs7YUFDQSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsMENBQTBDO1lBQ3BELE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFLEdBQUc7WUFDWixRQUFRLEVBQUUsNERBQTREO2dCQUNsRSw4RUFBOEU7WUFDbEYsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osMkZBQTJGO2dCQUMzRiwyQ0FBMkM7WUFDL0MsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxF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ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0NvbnNvbGVMb2dnZXIsIExvZ2dlciwgTG9nTGV2ZWx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgRGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtjaGVja0R1cGxpY2F0ZU1lc3NhZ2VzfSBmcm9tICcuL2R1cGxpY2F0ZXMnO1xuaW1wb3J0IHtNZXNzYWdlRXh0cmFjdG9yfSBmcm9tICcuL2V4dHJhY3Rpb24nO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvanNvbl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMV90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1iVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3htYl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7Rm9ybWF0T3B0aW9ucywgcGFyc2VGb3JtYXRPcHRpb25zfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL2Zvcm1hdF9vcHRpb25zJztcblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdsb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdlbicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgZGVmYXVsdDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgcm9vdCBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byBzZWFyY2ggZm9yIHRyYW5zbGF0aW9ucywgZS5nLiBgLi9kaXN0LyoqLyouanNgLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcm9vdCBwYXRoLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ2YnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2Zvcm1hdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNob2ljZXM6IFsneG1iJywgJ3hsZicsICd4bGlmJywgJ3hsaWZmJywgJ3hsZjInLCAneGxpZjInLCAneGxpZmYyJywgJ2pzb24nXSxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGZvcm1hdCBvZiB0aGUgdHJhbnNsYXRpb24gZmlsZS4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdmb3JtYXRPcHRpb25zJywge1xuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0FkZGl0aW9uYWwgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHNlcmlhbGl6ZXIsIGluIHRoZSBmb3JtIG9mIEpTT04gZm9ybWF0dGVkIGtleS12YWx1ZSBzdHJpbmcgcGFpcnM6XFxuJyArXG4gICAgICAgICAgICAgICAgJ0ZvciBleGFtcGxlOiBgLS1mb3JtYXRPcHRpb25zIHtcInhtbDpzcGFjZVwiOlwicHJlc2VydmVcIn0uXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoZSBtZWFuaW5nIG9mIHRoZSBvcHRpb25zIGlzIHNwZWNpZmljIHRvIHRoZSBmb3JtYXQgYmVpbmcgc2VyaWFsaXplZC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ28nLCB7XG4gICAgICAgICAgICBhbGlhczogJ291dHB1dFBhdGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdsb2dsZXZlbCcsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGxvd2VzdCBzZXZlcml0eSBsb2dnaW5nIG1lc3NhZ2UgdGhhdCBzaG91bGQgYmUgb3V0cHV0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCd1c2VTb3VyY2VNYXBzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIGdlbmVyYXRlIHNvdXJjZSBpbmZvcm1hdGlvbiBpbiB0aGUgb3V0cHV0IGZpbGVzIGJ5IGZvbGxvd2luZyBzb3VyY2UtbWFwIG1hcHBpbmdzIGZvdW5kIGluIHRoZSBzb3VyY2UgZmlsZXMnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlTGVnYWN5SWRzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIHVzZSB0aGUgbGVnYWN5IGlkIGZvcm1hdCBmb3IgbWVzc2FnZXMgdGhhdCB3ZXJlIGV4dHJhY3RlZCBmcm9tIEFuZ3VsYXIgdGVtcGxhdGVzLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdkJywge1xuICAgICAgICAgICAgYWxpYXM6ICdkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1lc3NhZ2VzIHdpdGggdGhlIHNhbWUgaWQgYnV0IGRpZmZlcmVudCB0ZXh0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZnMgPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZzKTtcblxuICBjb25zdCByb290UGF0aCA9IG9wdGlvbnMucjtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID0gZ2xvYi5zeW5jKG9wdGlvbnMucywge2N3ZDogcm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IGxvZ0xldmVsID0gb3B0aW9ucy5sb2dsZXZlbCBhcyAoa2V5b2YgdHlwZW9mIExvZ0xldmVsKSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgbG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIobG9nTGV2ZWwgPyBMb2dMZXZlbFtsb2dMZXZlbF0gOiBMb2dMZXZlbC53YXJuKTtcbiAgY29uc3QgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nID0gb3B0aW9ucy5kIGFzIERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICBjb25zdCBmb3JtYXRPcHRpb25zID0gcGFyc2VGb3JtYXRPcHRpb25zKG9wdGlvbnMuZm9ybWF0T3B0aW9ucyk7XG5cblxuICBleHRyYWN0VHJhbnNsYXRpb25zKHtcbiAgICByb290UGF0aCxcbiAgICBzb3VyY2VGaWxlUGF0aHMsXG4gICAgc291cmNlTG9jYWxlOiBvcHRpb25zLmwsXG4gICAgZm9ybWF0OiBvcHRpb25zLmYsXG4gICAgb3V0cHV0UGF0aDogb3B0aW9ucy5vLFxuICAgIGxvZ2dlcixcbiAgICB1c2VTb3VyY2VNYXBzOiBvcHRpb25zLnVzZVNvdXJjZU1hcHMsXG4gICAgdXNlTGVnYWN5SWRzOiBvcHRpb25zLnVzZUxlZ2FjeUlkcyxcbiAgICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsXG4gICAgZm9ybWF0T3B0aW9ucyxcbiAgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXh0cmFjdFRyYW5zbGF0aW9uc09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxvY2FsZSBvZiB0aGUgc291cmNlIGJlaW5nIHByb2Nlc3NlZC5cbiAgICovXG4gIHNvdXJjZUxvY2FsZTogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGJhc2UgcGF0aCBmb3Igb3RoZXIgcGF0aHMgcHJvdmlkZWQgaW4gdGhlc2Ugb3B0aW9ucy5cbiAgICogVGhpcyBzaG91bGQgZWl0aGVyIGJlIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKi9cbiAgcm9vdFBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHBhdGhzIHRvIGZpbGVzIHRvIHNlYXJjaCBmb3IgdHJhbnNsYXRpb25zLiBUaGVzZSBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlXG4gICAqIHJvb3RQYXRoLlxuICAgKi9cbiAgc291cmNlRmlsZVBhdGhzOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIFRoZSBmb3JtYXQgb2YgdGhlIHRyYW5zbGF0aW9uIGZpbGUuXG4gICAqL1xuICBmb3JtYXQ6IHN0cmluZztcbiAgLyoqXG4gICAqIEEgcGF0aCB0byB3aGVyZSB0aGUgdHJhbnNsYXRpb24gZmlsZSB3aWxsIGJlIHdyaXR0ZW4uIFRoaXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByb290UGF0aC5cbiAgICovXG4gIG91dHB1dFBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBsb2dnZXIgdG8gdXNlIGZvciBkaWFnbm9zdGljIG1lc3NhZ2VzLlxuICAgKi9cbiAgbG9nZ2VyOiBMb2dnZXI7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGdlbmVyYXRlIHNvdXJjZSBpbmZvcm1hdGlvbiBpbiB0aGUgb3V0cHV0IGZpbGVzIGJ5IGZvbGxvd2luZyBzb3VyY2UtbWFwIG1hcHBpbmdzXG4gICAqIGZvdW5kIGluIHRoZSBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHVzZVNvdXJjZU1hcHM6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSB0aGUgbGVnYWN5IGlkIGZvcm1hdCBmb3IgbWVzc2FnZXMgdGhhdCB3ZXJlIGV4dHJhY3RlZCBmcm9tIEFuZ3VsYXIgdGVtcGxhdGVzXG4gICAqL1xuICB1c2VMZWdhY3lJZHM6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBIb3cgdG8gaGFuZGxlIG1lc3NhZ2VzIHdpdGggdGhlIHNhbWUgaWQgYnV0IG5vdCB0aGUgc2FtZSB0ZXh0LlxuICAgKi9cbiAgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgLyoqXG4gICAqIEEgY29sbGVjdGlvbiBvZiBmb3JtYXR0aW5nIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZSBzZXJpYWxpemVyLlxuICAgKi9cbiAgZm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VHJhbnNsYXRpb25zKHtcbiAgcm9vdFBhdGgsXG4gIHNvdXJjZUZpbGVQYXRocyxcbiAgc291cmNlTG9jYWxlLFxuICBmb3JtYXQsXG4gIG91dHB1dFBhdGg6IG91dHB1dCxcbiAgbG9nZ2VyLFxuICB1c2VTb3VyY2VNYXBzLFxuICB1c2VMZWdhY3lJZHMsXG4gIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZyxcbiAgZm9ybWF0T3B0aW9ucyA9IHt9LFxufTogRXh0cmFjdFRyYW5zbGF0aW9uc09wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSBnZXRGaWxlU3lzdGVtKCk7XG4gIGNvbnN0IGJhc2VQYXRoID0gZnMucmVzb2x2ZShyb290UGF0aCk7XG4gIGNvbnN0IGV4dHJhY3RvciA9IG5ldyBNZXNzYWdlRXh0cmFjdG9yKGZzLCBsb2dnZXIsIHtiYXNlUGF0aCwgdXNlU291cmNlTWFwc30pO1xuXG4gIGNvbnN0IG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGZpbGUgb2Ygc291cmNlRmlsZVBhdGhzKSB7XG4gICAgbWVzc2FnZXMucHVzaCguLi5leHRyYWN0b3IuZXh0cmFjdE1lc3NhZ2VzKGZpbGUpKTtcbiAgfVxuXG4gIGNvbnN0IGRpYWdub3N0aWNzID0gY2hlY2tEdXBsaWNhdGVNZXNzYWdlcyhmcywgbWVzc2FnZXMsIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZywgYmFzZVBhdGgpO1xuICBpZiAoZGlhZ25vc3RpY3MuaGFzRXJyb3JzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKCdGYWlsZWQgdG8gZXh0cmFjdCBtZXNzYWdlcycpKTtcbiAgfVxuXG4gIGNvbnN0IG91dHB1dFBhdGggPSBmcy5yZXNvbHZlKHJvb3RQYXRoLCBvdXRwdXQpO1xuICBjb25zdCBzZXJpYWxpemVyID1cbiAgICAgIGdldFNlcmlhbGl6ZXIoZm9ybWF0LCBzb3VyY2VMb2NhbGUsIGZzLmRpcm5hbWUob3V0cHV0UGF0aCksIHVzZUxlZ2FjeUlkcywgZm9ybWF0T3B0aW9ucyk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZSA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplKG1lc3NhZ2VzKTtcbiAgZnMuZW5zdXJlRGlyKGZzLmRpcm5hbWUob3V0cHV0UGF0aCkpO1xuICBmcy53cml0ZUZpbGUob3V0cHV0UGF0aCwgdHJhbnNsYXRpb25GaWxlKTtcblxuICBpZiAoZGlhZ25vc3RpY3MubWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgbG9nZ2VyLndhcm4oZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoJ01lc3NhZ2VzIGV4dHJhY3RlZCB3aXRoIHdhcm5pbmdzJykpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXJpYWxpemVyKFxuICAgIGZvcm1hdDogc3RyaW5nLCBzb3VyY2VMb2NhbGU6IHN0cmluZywgcm9vdFBhdGg6IEFic29sdXRlRnNQYXRoLCB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgZm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9ucyA9IHt9KTogVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlICd4bGYnOlxuICAgIGNhc2UgJ3hsaWYnOlxuICAgIGNhc2UgJ3hsaWZmJzpcbiAgICAgIHJldHVybiBuZXcgWGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSwgcm9vdFBhdGgsIHVzZUxlZ2FjeUlkcywgZm9ybWF0T3B0aW9ucyk7XG4gICAgY2FzZSAneGxmMic6XG4gICAgY2FzZSAneGxpZjInOlxuICAgIGNhc2UgJ3hsaWZmMic6XG4gICAgICByZXR1cm4gbmV3IFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplcihzb3VyY2VMb2NhbGUsIHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMsIGZvcm1hdE9wdGlvbnMpO1xuICAgIGNhc2UgJ3htYic6XG4gICAgICByZXR1cm4gbmV3IFhtYlRyYW5zbGF0aW9uU2VyaWFsaXplcihyb290UGF0aCwgdXNlTGVnYWN5SWRzKTtcbiAgICBjYXNlICdqc29uJzpcbiAgICAgIHJldHVybiBuZXcgU2ltcGxlSnNvblRyYW5zbGF0aW9uU2VyaWFsaXplcihzb3VyY2VMb2NhbGUpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihgTm8gdHJhbnNsYXRpb24gc2VyaWFsaXplciBjYW4gaGFuZGxlIHRoZSBwcm92aWRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xufVxuIl19