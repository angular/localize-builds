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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkVBQTJIO0lBQzNILG1FQUF3RjtJQUV4RiwyQkFBNkI7SUFDN0IsNkJBQStCO0lBSS9CLGlGQUFvRDtJQUNwRCxpRkFBOEM7SUFFOUMscUlBQWdHO0lBQ2hHLHlJQUE4RjtJQUM5Rix5SUFBOEY7SUFDOUYsbUlBQXdGO0lBRXhGLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQ1QsS0FBSzthQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSwwQ0FBMEM7WUFDcEQsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLE1BQU07WUFDYixPQUFPLEVBQUUsR0FBRztZQUNaLFFBQVEsRUFBRSw0REFBNEQ7Z0JBQ2xFLDhFQUE4RTtZQUNsRixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFDSiwyRkFBMkY7Z0JBQzNGLDJDQUEyQztZQUMvQyxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7WUFDM0UsUUFBUSxFQUFFLHFDQUFxQztZQUMvQyxJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osaUdBQWlHO1lBQ3JHLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQzthQUNELE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDbEIsUUFBUSxFQUFFLDREQUE0RDtZQUN0RSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7WUFDM0MsSUFBSSxFQUFFLFFBQVE7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUN2QixJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUNKLHVIQUF1SDtTQUM1SCxDQUFDO2FBQ0QsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUN0QixJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUNKLDhGQUE4RjtTQUNuRyxDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSwwQkFBMEI7WUFDakMsUUFBUSxFQUFFLDZEQUE2RDtZQUN2RSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQztZQUN2QyxPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDRCxNQUFNLEVBQUU7YUFDUixJQUFJLEVBQUU7YUFDTixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBTSxFQUFFLEdBQUcsSUFBSSw4QkFBZ0IsRUFBRSxDQUFDO1FBQ2xDLDJCQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbEIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUErQyxDQUFDO1FBQ3pFLElBQU0sTUFBTSxHQUFHLElBQUksdUJBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEYsSUFBTSx3QkFBd0IsR0FBRyxPQUFPLENBQUMsQ0FBK0IsQ0FBQztRQUd6RSxtQkFBbUIsQ0FBQztZQUNsQixRQUFRLFVBQUE7WUFDUixlQUFlLGlCQUFBO1lBQ2YsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqQixVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckIsTUFBTSxRQUFBO1lBQ04sYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ3BDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtZQUNsQyx3QkFBd0IsMEJBQUE7U0FDekIsQ0FBQyxDQUFDO0tBQ0o7SUE0Q0QsU0FBZ0IsbUJBQW1CLENBQUMsRUFVUDs7WUFUM0IsUUFBUSxjQUFBLEVBQ1IsZUFBZSxxQkFBQSxFQUNmLFlBQVksa0JBQUEsRUFDWixNQUFNLFlBQUEsRUFDTSxNQUFNLGdCQUFBLEVBQ2xCLE1BQU0sWUFBQSxFQUNOLGFBQWEsbUJBQUEsRUFDYixZQUFZLGtCQUFBLEVBQ1osd0JBQXdCLDhCQUFBO1FBRXhCLElBQU0sRUFBRSxHQUFHLDJCQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLElBQU0sU0FBUyxHQUFHLElBQUksNkJBQWdCLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFFLGFBQWEsZUFBQSxFQUFDLENBQUMsQ0FBQztRQUU5RSxJQUFNLFFBQVEsR0FBcUIsRUFBRSxDQUFDOztZQUN0QyxLQUFtQixJQUFBLG9CQUFBLGlCQUFBLGVBQWUsQ0FBQSxnREFBQSw2RUFBRTtnQkFBL0IsSUFBTSxJQUFJLDRCQUFBO2dCQUNiLFFBQVEsQ0FBQyxJQUFJLE9BQWIsUUFBUSxtQkFBUyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFFO2FBQ25EOzs7Ozs7Ozs7UUFFRCxJQUFNLFdBQVcsR0FBRyxtQ0FBc0IsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdGLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7U0FDOUU7UUFFRCxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzdGLElBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFMUMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBbENELGtEQWtDQztJQUVELFNBQWdCLGFBQWEsQ0FDekIsTUFBYyxFQUFFLFlBQW9CLEVBQUUsUUFBd0IsRUFDOUQsWUFBcUI7UUFDdkIsUUFBUSxNQUFNLEVBQUU7WUFDZCxLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxPQUFPO2dCQUNWLE9BQU8sSUFBSSwyREFBMkIsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9FLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxJQUFJLDJEQUEyQixDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDL0UsS0FBSyxLQUFLO2dCQUNSLE9BQU8sSUFBSSxxREFBd0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDOUQsS0FBSyxNQUFNO2dCQUNULE9BQU8sSUFBSSw2REFBK0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQTZELE1BQVEsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFsQkQsc0NBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dldEZpbGVTeXN0ZW0sIHNldEZpbGVTeXN0ZW0sIE5vZGVKU0ZpbGVTeXN0ZW0sIEFic29sdXRlRnNQYXRofSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q29uc29sZUxvZ2dlciwgTG9nZ2VyLCBMb2dMZXZlbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5LCBEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge2NoZWNrRHVwbGljYXRlTWVzc2FnZXN9IGZyb20gJy4vZHVwbGljYXRlcyc7XG5pbXBvcnQge01lc3NhZ2VFeHRyYWN0b3J9IGZyb20gJy4vZXh0cmFjdGlvbic7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7U2ltcGxlSnNvblRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy9qc29uX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveGxpZmYxX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveGxpZmYyX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMveG1iX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgY29uc3Qgb3B0aW9ucyA9XG4gICAgICB5YXJnc1xuICAgICAgICAgIC5vcHRpb24oJ2wnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2xvY2FsZScsXG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSBsb2NhbGUgb2YgdGhlIHNvdXJjZSBiZWluZyBwcm9jZXNzZWQnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ2VuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAncm9vdCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnLicsXG4gICAgICAgICAgICBkZXNjcmliZTogJ1RoZSByb290IHBhdGggZm9yIG90aGVyIHBhdGhzIHByb3ZpZGVkIGluIHRoZXNlIG9wdGlvbnMuXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoaXMgc2hvdWxkIGVpdGhlciBiZSBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdzJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBnbG9iIHBhdHRlcm4gaW5kaWNhdGluZyB3aGF0IGZpbGVzIHRvIHNlYXJjaCBmb3IgdHJhbnNsYXRpb25zLCBlLmcuIGAuL2Rpc3QvKiovKi5qc2AuXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoaXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByb290IHBhdGguJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbignZicsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnZm9ybWF0JyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgY2hvaWNlczogWyd4bWInLCAneGxmJywgJ3hsaWYnLCAneGxpZmYnLCAneGxmMicsICd4bGlmMicsICd4bGlmZjInLCAnanNvbiddLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgZm9ybWF0IG9mIHRoZSB0cmFuc2xhdGlvbiBmaWxlLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ28nLCB7XG4gICAgICAgICAgICBhbGlhczogJ291dHB1dFBhdGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdsb2dsZXZlbCcsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGxvd2VzdCBzZXZlcml0eSBsb2dnaW5nIG1lc3NhZ2UgdGhhdCBzaG91bGQgYmUgb3V0cHV0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCd1c2VTb3VyY2VNYXBzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIGdlbmVyYXRlIHNvdXJjZSBpbmZvcm1hdGlvbiBpbiB0aGUgb3V0cHV0IGZpbGVzIGJ5IGZvbGxvd2luZyBzb3VyY2UtbWFwIG1hcHBpbmdzIGZvdW5kIGluIHRoZSBzb3VyY2UgZmlsZXMnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlTGVnYWN5SWRzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIHVzZSB0aGUgbGVnYWN5IGlkIGZvcm1hdCBmb3IgbWVzc2FnZXMgdGhhdCB3ZXJlIGV4dHJhY3RlZCBmcm9tIEFuZ3VsYXIgdGVtcGxhdGVzLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdkJywge1xuICAgICAgICAgICAgYWxpYXM6ICdkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1lc3NhZ2VzIHdpdGggdGhlIHNhbWUgaWQgYnV0IGRpZmZlcmVudCB0ZXh0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZnMgPSBuZXcgTm9kZUpTRmlsZVN5c3RlbSgpO1xuICBzZXRGaWxlU3lzdGVtKGZzKTtcblxuICBjb25zdCByb290UGF0aCA9IG9wdGlvbnMucjtcbiAgY29uc3Qgc291cmNlRmlsZVBhdGhzID0gZ2xvYi5zeW5jKG9wdGlvbnMucywge2N3ZDogcm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IGxvZ0xldmVsID0gb3B0aW9ucy5sb2dsZXZlbCBhcyAoa2V5b2YgdHlwZW9mIExvZ0xldmVsKSB8IHVuZGVmaW5lZDtcbiAgY29uc3QgbG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIobG9nTGV2ZWwgPyBMb2dMZXZlbFtsb2dMZXZlbF0gOiBMb2dMZXZlbC53YXJuKTtcbiAgY29uc3QgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nID0gb3B0aW9ucy5kIGFzIERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuXG5cbiAgZXh0cmFjdFRyYW5zbGF0aW9ucyh7XG4gICAgcm9vdFBhdGgsXG4gICAgc291cmNlRmlsZVBhdGhzLFxuICAgIHNvdXJjZUxvY2FsZTogb3B0aW9ucy5sLFxuICAgIGZvcm1hdDogb3B0aW9ucy5mLFxuICAgIG91dHB1dFBhdGg6IG9wdGlvbnMubyxcbiAgICBsb2dnZXIsXG4gICAgdXNlU291cmNlTWFwczogb3B0aW9ucy51c2VTb3VyY2VNYXBzLFxuICAgIHVzZUxlZ2FjeUlkczogb3B0aW9ucy51c2VMZWdhY3lJZHMsXG4gICAgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nLFxuICB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHRyYWN0VHJhbnNsYXRpb25zT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkLlxuICAgKi9cbiAgc291cmNlTG9jYWxlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgYmFzZSBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxuICAgKiBUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gICAqL1xuICByb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcGF0aHMgdG8gZmlsZXMgdG8gc2VhcmNoIGZvciB0cmFuc2xhdGlvbnMuIFRoZXNlIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGVcbiAgICogcm9vdFBhdGguXG4gICAqL1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIGZvcm1hdCBvZiB0aGUgdHJhbnNsYXRpb24gZmlsZS5cbiAgICovXG4gIGZvcm1hdDogc3RyaW5nO1xuICAvKipcbiAgICogQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3RQYXRoLlxuICAgKi9cbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGxvZ2dlciB0byB1c2UgZm9yIGRpYWdub3N0aWMgbWVzc2FnZXMuXG4gICAqL1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgc291cmNlIGluZm9ybWF0aW9uIGluIHRoZSBvdXRwdXQgZmlsZXMgYnkgZm9sbG93aW5nIHNvdXJjZS1tYXAgbWFwcGluZ3NcbiAgICogZm91bmQgaW4gdGhlIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIHRoZSBsZWdhY3kgaWQgZm9ybWF0IGZvciBtZXNzYWdlcyB0aGF0IHdlcmUgZXh0cmFjdGVkIGZyb20gQW5ndWxhciB0ZW1wbGF0ZXNcbiAgICovXG4gIHVzZUxlZ2FjeUlkczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgbWVzc2FnZXMgd2l0aCB0aGUgc2FtZSBpZCBidXQgbm90IHRoZSBzYW1lIHRleHQuXG4gICAqL1xuICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmc6IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFRyYW5zbGF0aW9ucyh7XG4gIHJvb3RQYXRoLFxuICBzb3VyY2VGaWxlUGF0aHMsXG4gIHNvdXJjZUxvY2FsZSxcbiAgZm9ybWF0LFxuICBvdXRwdXRQYXRoOiBvdXRwdXQsXG4gIGxvZ2dlcixcbiAgdXNlU291cmNlTWFwcyxcbiAgdXNlTGVnYWN5SWRzLFxuICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsXG59OiBFeHRyYWN0VHJhbnNsYXRpb25zT3B0aW9ucykge1xuICBjb25zdCBmcyA9IGdldEZpbGVTeXN0ZW0oKTtcbiAgY29uc3QgYmFzZVBhdGggPSBmcy5yZXNvbHZlKHJvb3RQYXRoKTtcbiAgY29uc3QgZXh0cmFjdG9yID0gbmV3IE1lc3NhZ2VFeHRyYWN0b3IoZnMsIGxvZ2dlciwge2Jhc2VQYXRoLCB1c2VTb3VyY2VNYXBzfSk7XG5cbiAgY29uc3QgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdID0gW107XG4gIGZvciAoY29uc3QgZmlsZSBvZiBzb3VyY2VGaWxlUGF0aHMpIHtcbiAgICBtZXNzYWdlcy5wdXNoKC4uLmV4dHJhY3Rvci5leHRyYWN0TWVzc2FnZXMoZmlsZSkpO1xuICB9XG5cbiAgY29uc3QgZGlhZ25vc3RpY3MgPSBjaGVja0R1cGxpY2F0ZU1lc3NhZ2VzKGZzLCBtZXNzYWdlcywgZHVwbGljYXRlTWVzc2FnZUhhbmRsaW5nLCBiYXNlUGF0aCk7XG4gIGlmIChkaWFnbm9zdGljcy5oYXNFcnJvcnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZGlhZ25vc3RpY3MuZm9ybWF0RGlhZ25vc3RpY3MoJ0ZhaWxlZCB0byBleHRyYWN0IG1lc3NhZ2VzJykpO1xuICB9XG5cbiAgY29uc3Qgb3V0cHV0UGF0aCA9IGZzLnJlc29sdmUocm9vdFBhdGgsIG91dHB1dCk7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBnZXRTZXJpYWxpemVyKGZvcm1hdCwgc291cmNlTG9jYWxlLCBmcy5kaXJuYW1lKG91dHB1dFBhdGgpLCB1c2VMZWdhY3lJZHMpO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShtZXNzYWdlcyk7XG4gIGZzLmVuc3VyZURpcihmcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0aW9uRmlsZSk7XG5cbiAgaWYgKGRpYWdub3N0aWNzLm1lc3NhZ2VzLmxlbmd0aCkge1xuICAgIGxvZ2dlci53YXJuKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKCdNZXNzYWdlcyBleHRyYWN0ZWQgd2l0aCB3YXJuaW5ncycpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VyaWFsaXplcihcbiAgICBmb3JtYXQ6IHN0cmluZywgc291cmNlTG9jYWxlOiBzdHJpbmcsIHJvb3RQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICB1c2VMZWdhY3lJZHM6IGJvb2xlYW4pOiBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgJ3hsZic6XG4gICAgY2FzZSAneGxpZic6XG4gICAgY2FzZSAneGxpZmYnOlxuICAgICAgcmV0dXJuIG5ldyBYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXIoc291cmNlTG9jYWxlLCByb290UGF0aCwgdXNlTGVnYWN5SWRzKTtcbiAgICBjYXNlICd4bGYyJzpcbiAgICBjYXNlICd4bGlmMic6XG4gICAgY2FzZSAneGxpZmYyJzpcbiAgICAgIHJldHVybiBuZXcgWGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSwgcm9vdFBhdGgsIHVzZUxlZ2FjeUlkcyk7XG4gICAgY2FzZSAneG1iJzpcbiAgICAgIHJldHVybiBuZXcgWG1iVHJhbnNsYXRpb25TZXJpYWxpemVyKHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMpO1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgcmV0dXJuIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBObyB0cmFuc2xhdGlvbiBzZXJpYWxpemVyIGNhbiBoYW5kbGUgdGhlIHByb3ZpZGVkIGZvcm1hdDogJHtmb3JtYXR9YCk7XG59XG4iXX0=