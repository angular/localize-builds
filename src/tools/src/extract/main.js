#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/main", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/logging", "glob", "yargs", "@angular/localize/src/tools/src/extract/duplicates", "@angular/localize/src/tools/src/extract/extraction", "@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff1_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xliff2_translation_serializer", "@angular/localize/src/tools/src/extract/translation_files/xmb_translation_serializer"], factory);
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
            .option('d', {
            alias: 'duplicateMessageHandling',
            describe: 'How to handle messages with the same id but different text.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
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
        var duplicateMessageHandling = options['d'];
        extractTranslations({
            rootPath: rootPath,
            sourceFilePaths: sourceFilePaths,
            sourceLocale: options['locale'],
            format: options['format'],
            outputPath: options['outputPath'],
            logger: logger,
            useSourceMaps: options['useSourceMaps'],
            useLegacyIds: options['useLegacyIds'],
            duplicateMessageHandling: duplicateMessageHandling,
        });
    }
    function extractTranslations(_a) {
        var e_1, _b;
        var rootPath = _a.rootPath, sourceFilePaths = _a.sourceFilePaths, sourceLocale = _a.sourceLocale, format = _a.format, output = _a.outputPath, logger = _a.logger, useSourceMaps = _a.useSourceMaps, useLegacyIds = _a.useLegacyIds, duplicateMessageHandling = _a.duplicateMessageHandling;
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
        var serializer = getSerializer(format, sourceLocale, fs.dirname(outputPath), useLegacyIds);
        var translationFile = serializer.serialize(messages);
        fs.ensureDir(fs.dirname(outputPath));
        fs.writeFile(outputPath, translationFile);
        if (diagnostics.messages.length) {
            logger.warn(diagnostics.formatDiagnostics('Messages extracted with warnings'));
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQTJIO0lBQzNILG1FQUF3RjtJQUV4RiwyQkFBNkI7SUFDN0IsNkJBQStCO0lBSS9CLGlGQUFvRDtJQUNwRCxpRkFBOEM7SUFFOUMscUlBQWdHO0lBQ2hHLHlJQUE4RjtJQUM5Rix5SUFBOEY7SUFDOUYsbUlBQXdGO0lBRXhGLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQ1QsS0FBSzthQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSwwQ0FBMEM7WUFDcEQsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFLEdBQUc7WUFDWixRQUFRLEVBQUUsNERBQTREO2dCQUNsRSw4RUFBOEU7U0FDbkYsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLDJGQUEyRjtnQkFDM0YsMkNBQTJDO1NBQ2hELENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFN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RSxZQUFvQixFQUFFLFFBQXdCLEVBQzlELFlBQXFCO1FBQ3ZCLFFBQVEsTUFBTSxFQUFFO1lBQ2QsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssT0FBTztnQkFDVixPQUFPLElBQUksMkRBQTJCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMvRSxLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxRQUFRO2dCQUNYLE9BQU8sSUFBSSwyREFBMkIsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9FLEtBQUssS0FBSztnQkFDUixPQUFPLElBQUkscURBQXdCLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzlELEtBQUssTUFBTTtnQkFDVCxPQUFPLElBQUksNkRBQStCLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDNUQ7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUE2RCxNQUFRLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBbEJELHNDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0NvbnNvbGVMb2dnZXIsIExvZ2dlciwgTG9nTGV2ZWx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSwgRGlhZ25vc3RpY3N9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtjaGVja0R1cGxpY2F0ZU1lc3NhZ2VzfSBmcm9tICcuL2R1cGxpY2F0ZXMnO1xuaW1wb3J0IHtNZXNzYWdlRXh0cmFjdG9yfSBmcm9tICcuL2V4dHJhY3Rpb24nO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvanNvbl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMV90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1iVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3htYl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdsb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdlbicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdyJywge1xuICAgICAgICAgICAgYWxpYXM6ICdyb290JyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIHJvb3QgcGF0aCBmb3Igb3RoZXIgcGF0aHMgcHJvdmlkZWQgaW4gdGhlc2Ugb3B0aW9ucy5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhpcyBzaG91bGQgZWl0aGVyIGJlIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3MnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZScsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGdsb2IgcGF0dGVybiBpbmRpY2F0aW5nIHdoYXQgZmlsZXMgdG8gc2VhcmNoIGZvciB0cmFuc2xhdGlvbnMsIGUuZy4gYC4vZGlzdC8qKi8qLmpzYC5cXG4nICtcbiAgICAgICAgICAgICAgICAnVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignZicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnZm9ybWF0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgY2hvaWNlczogWyd4bWInLCAneGxmJywgJ3hsaWYnLCAneGxpZmYnLCAneGxmMicsICd4bGlmMicsICd4bGlmZjInLCAnanNvbiddLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgZm9ybWF0IG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdvJywge1xuICAgICAgICAgICAgYWxpYXM6ICdvdXRwdXRQYXRoJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgcGF0aCB0byB3aGVyZSB0aGUgdHJhbnNsYXRpb24gZmlsZSB3aWxsIGJlIHdyaXR0ZW4uIFRoaXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByb290IHBhdGguJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignbG9nbGV2ZWwnLCB7XG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBsb3dlc3Qgc2V2ZXJpdHkgbG9nZ2luZyBtZXNzYWdlIHRoYXQgc2hvdWxkIGJlIG91dHB1dC4nLFxuICAgICAgICAgICAgY2hvaWNlczogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3VzZVNvdXJjZU1hcHMnLCB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1doZXRoZXIgdG8gZ2VuZXJhdGUgc291cmNlIGluZm9ybWF0aW9uIGluIHRoZSBvdXRwdXQgZmlsZXMgYnkgZm9sbG93aW5nIHNvdXJjZS1tYXAgbWFwcGluZ3MgZm91bmQgaW4gdGhlIHNvdXJjZSBmaWxlcydcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3VzZUxlZ2FjeUlkcycsIHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnV2hldGhlciB0byB1c2UgdGhlIGxlZ2FjeSBpZCBmb3JtYXQgZm9yIG1lc3NhZ2VzIHRoYXQgd2VyZSBleHRyYWN0ZWQgZnJvbSBBbmd1bGFyIHRlbXBsYXRlcy4nXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdkJywge1xuICAgICAgICAgICAgYWxpYXM6ICdkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1lc3NhZ2VzIHdpdGggdGhlIHNhbWUgaWQgYnV0IGRpZmZlcmVudCB0ZXh0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3RyaWN0KClcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLnBhcnNlKGFyZ3MpO1xuXG4gIGNvbnN0IGZzID0gbmV3IE5vZGVKU0ZpbGVTeXN0ZW0oKTtcbiAgc2V0RmlsZVN5c3RlbShmcyk7XG5cbiAgY29uc3Qgcm9vdFBhdGggPSBvcHRpb25zWydyb290J107XG4gIGNvbnN0IHNvdXJjZUZpbGVQYXRocyA9IGdsb2Iuc3luYyhvcHRpb25zWydzb3VyY2UnXSwge2N3ZDogcm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IGxvZ0xldmVsID0gb3B0aW9uc1snbG9nbGV2ZWwnXSBhcyAoa2V5b2YgdHlwZW9mIExvZ0xldmVsKSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgbG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIobG9nTGV2ZWwgPyBMb2dMZXZlbFtsb2dMZXZlbF0gOiBMb2dMZXZlbC53YXJuKTtcbiAgY29uc3QgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nOiBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneSA9IG9wdGlvbnNbJ2QnXTtcblxuXG4gIGV4dHJhY3RUcmFuc2xhdGlvbnMoe1xuICAgIHJvb3RQYXRoLFxuICAgIHNvdXJjZUZpbGVQYXRocyxcbiAgICBzb3VyY2VMb2NhbGU6IG9wdGlvbnNbJ2xvY2FsZSddLFxuICAgIGZvcm1hdDogb3B0aW9uc1snZm9ybWF0J10sXG4gICAgb3V0cHV0UGF0aDogb3B0aW9uc1snb3V0cHV0UGF0aCddLFxuICAgIGxvZ2dlcixcbiAgICB1c2VTb3VyY2VNYXBzOiBvcHRpb25zWyd1c2VTb3VyY2VNYXBzJ10sXG4gICAgdXNlTGVnYWN5SWRzOiBvcHRpb25zWyd1c2VMZWdhY3lJZHMnXSxcbiAgICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsXG4gIH0pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3RUcmFuc2xhdGlvbnNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBiZWluZyBwcm9jZXNzZWQuXG4gICAqL1xuICBzb3VyY2VMb2NhbGU6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBiYXNlIHBhdGggZm9yIG90aGVyIHBhdGhzIHByb3ZpZGVkIGluIHRoZXNlIG9wdGlvbnMuXG4gICAqIFRoaXMgc2hvdWxkIGVpdGhlciBiZSBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICovXG4gIHJvb3RQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBwYXRocyB0byBmaWxlcyB0byBzZWFyY2ggZm9yIHRyYW5zbGF0aW9ucy4gVGhlc2Ugc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZVxuICAgKiByb290UGF0aC5cbiAgICovXG4gIHNvdXJjZUZpbGVQYXRoczogc3RyaW5nW107XG4gIC8qKlxuICAgKiBUaGUgZm9ybWF0IG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlLlxuICAgKi9cbiAgZm9ybWF0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIHBhdGggdG8gd2hlcmUgdGhlIHRyYW5zbGF0aW9uIGZpbGUgd2lsbCBiZSB3cml0dGVuLiBUaGlzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcm9vdFBhdGguXG4gICAqL1xuICBvdXRwdXRQYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbG9nZ2VyIHRvIHVzZSBmb3IgZGlhZ25vc3RpYyBtZXNzYWdlcy5cbiAgICovXG4gIGxvZ2dlcjogTG9nZ2VyO1xuICAvKipcbiAgICogV2hldGhlciB0byBnZW5lcmF0ZSBzb3VyY2UgaW5mb3JtYXRpb24gaW4gdGhlIG91dHB1dCBmaWxlcyBieSBmb2xsb3dpbmcgc291cmNlLW1hcCBtYXBwaW5nc1xuICAgKiBmb3VuZCBpbiB0aGUgc291cmNlIGZpbGUuXG4gICAqL1xuICB1c2VTb3VyY2VNYXBzOiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byB1c2UgdGhlIGxlZ2FjeSBpZCBmb3JtYXQgZm9yIG1lc3NhZ2VzIHRoYXQgd2VyZSBleHRyYWN0ZWQgZnJvbSBBbmd1bGFyIHRlbXBsYXRlc1xuICAgKi9cbiAgdXNlTGVnYWN5SWRzOiBib29sZWFuO1xuICAvKipcbiAgICogSG93IHRvIGhhbmRsZSBtZXNzYWdlcyB3aXRoIHRoZSBzYW1lIGlkIGJ1dCBub3QgdGhlIHNhbWUgdGV4dC5cbiAgICovXG4gIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZzogRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3k7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VHJhbnNsYXRpb25zKHtcbiAgcm9vdFBhdGgsXG4gIHNvdXJjZUZpbGVQYXRocyxcbiAgc291cmNlTG9jYWxlLFxuICBmb3JtYXQsXG4gIG91dHB1dFBhdGg6IG91dHB1dCxcbiAgbG9nZ2VyLFxuICB1c2VTb3VyY2VNYXBzLFxuICB1c2VMZWdhY3lJZHMsXG4gIGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZyxcbn06IEV4dHJhY3RUcmFuc2xhdGlvbnNPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCBiYXNlUGF0aCA9IGZzLnJlc29sdmUocm9vdFBhdGgpO1xuICBjb25zdCBleHRyYWN0b3IgPSBuZXcgTWVzc2FnZUV4dHJhY3RvcihmcywgbG9nZ2VyLCB7YmFzZVBhdGgsIHVzZVNvdXJjZU1hcHN9KTtcblxuICBjb25zdCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10gPSBbXTtcbiAgZm9yIChjb25zdCBmaWxlIG9mIHNvdXJjZUZpbGVQYXRocykge1xuICAgIG1lc3NhZ2VzLnB1c2goLi4uZXh0cmFjdG9yLmV4dHJhY3RNZXNzYWdlcyhmaWxlKSk7XG4gIH1cblxuICBjb25zdCBkaWFnbm9zdGljcyA9IGNoZWNrRHVwbGljYXRlTWVzc2FnZXMoZnMsIG1lc3NhZ2VzLCBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsIGJhc2VQYXRoKTtcbiAgaWYgKGRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgIHRocm93IG5ldyBFcnJvcihkaWFnbm9zdGljcy5mb3JtYXREaWFnbm9zdGljcygnRmFpbGVkIHRvIGV4dHJhY3QgbWVzc2FnZXMnKSk7XG4gIH1cblxuICBjb25zdCBvdXRwdXRQYXRoID0gZnMucmVzb2x2ZShyb290UGF0aCwgb3V0cHV0KTtcbiAgY29uc3Qgc2VyaWFsaXplciA9IGdldFNlcmlhbGl6ZXIoZm9ybWF0LCBzb3VyY2VMb2NhbGUsIGZzLmRpcm5hbWUob3V0cHV0UGF0aCksIHVzZUxlZ2FjeUlkcyk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZSA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplKG1lc3NhZ2VzKTtcbiAgZnMuZW5zdXJlRGlyKGZzLmRpcm5hbWUob3V0cHV0UGF0aCkpO1xuICBmcy53cml0ZUZpbGUob3V0cHV0UGF0aCwgdHJhbnNsYXRpb25GaWxlKTtcblxuICBpZiAoZGlhZ25vc3RpY3MubWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgbG9nZ2VyLndhcm4oZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoJ01lc3NhZ2VzIGV4dHJhY3RlZCB3aXRoIHdhcm5pbmdzJykpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXJpYWxpemVyKFxuICAgIGZvcm1hdDogc3RyaW5nLCBzb3VyY2VMb2NhbGU6IHN0cmluZywgcm9vdFBhdGg6IEFic29sdXRlRnNQYXRoLFxuICAgIHVzZUxlZ2FjeUlkczogYm9vbGVhbik6IFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgY2FzZSAneGxmJzpcbiAgICBjYXNlICd4bGlmJzpcbiAgICBjYXNlICd4bGlmZic6XG4gICAgICByZXR1cm4gbmV3IFhsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplcihzb3VyY2VMb2NhbGUsIHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMpO1xuICAgIGNhc2UgJ3hsZjInOlxuICAgIGNhc2UgJ3hsaWYyJzpcbiAgICBjYXNlICd4bGlmZjInOlxuICAgICAgcmV0dXJuIG5ldyBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXIoc291cmNlTG9jYWxlLCByb290UGF0aCwgdXNlTGVnYWN5SWRzKTtcbiAgICBjYXNlICd4bWInOlxuICAgICAgcmV0dXJuIG5ldyBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXIocm9vdFBhdGgsIHVzZUxlZ2FjeUlkcyk7XG4gICAgY2FzZSAnanNvbic6XG4gICAgICByZXR1cm4gbmV3IFNpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXIoc291cmNlTG9jYWxlKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYE5vIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXIgY2FuIGhhbmRsZSB0aGUgcHJvdmlkZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcbn1cbiJdfQ==