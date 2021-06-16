#!/usr/bin/env node
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { setFileSystem, NodeJSFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { ConsoleLogger, LogLevel } from '@angular/compiler-cli/src/ngtsc/logging';
import * as glob from 'glob';
import * as yargs from 'yargs';
import { checkDuplicateMessages } from './duplicates';
import { MessageExtractor } from './extraction';
import { ArbTranslationSerializer } from './translation_files/arb_translation_serializer';
import { SimpleJsonTranslationSerializer } from './translation_files/json_translation_serializer';
import { Xliff1TranslationSerializer } from './translation_files/xliff1_translation_serializer';
import { Xliff2TranslationSerializer } from './translation_files/xliff2_translation_serializer';
import { XmbTranslationSerializer } from './translation_files/xmb_translation_serializer';
import { parseFormatOptions } from './translation_files/format_options';
import { LegacyMessageIdMigrationSerializer } from './translation_files/legacy_message_id_migration_serializer';
if (require.main === module) {
    process.title = 'Angular Localization Message Extractor (localize-extract)';
    const args = process.argv.slice(2);
    const options = yargs
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
        choices: [
            'xmb', 'xlf', 'xlif', 'xliff', 'xlf2', 'xlif2', 'xliff2', 'json', 'legacy-migrate'
        ],
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
    const fileSystem = new NodeJSFileSystem();
    setFileSystem(fileSystem);
    const rootPath = options.r;
    const sourceFilePaths = glob.sync(options.s, { cwd: rootPath, nodir: true });
    const logLevel = options.loglevel;
    const logger = new ConsoleLogger(logLevel ? LogLevel[logLevel] : LogLevel.warn);
    const duplicateMessageHandling = options.d;
    const formatOptions = parseFormatOptions(options.formatOptions);
    const format = options.f;
    extractTranslations({
        rootPath,
        sourceFilePaths,
        sourceLocale: options.l,
        format,
        outputPath: options.o,
        logger,
        useSourceMaps: options.useSourceMaps,
        useLegacyIds: format === 'legacy-migrate' || options.useLegacyIds,
        duplicateMessageHandling,
        formatOptions,
        fileSystem,
    });
}
export function extractTranslations({ rootPath, sourceFilePaths, sourceLocale, format, outputPath: output, logger, useSourceMaps, useLegacyIds, duplicateMessageHandling, formatOptions = {}, fileSystem: fs, }) {
    const basePath = fs.resolve(rootPath);
    const extractor = new MessageExtractor(fs, logger, { basePath, useSourceMaps });
    const messages = [];
    for (const file of sourceFilePaths) {
        messages.push(...extractor.extractMessages(file));
    }
    const diagnostics = checkDuplicateMessages(fs, messages, duplicateMessageHandling, basePath);
    if (diagnostics.hasErrors) {
        throw new Error(diagnostics.formatDiagnostics('Failed to extract messages'));
    }
    const outputPath = fs.resolve(rootPath, output);
    const serializer = getSerializer(format, sourceLocale, fs.dirname(outputPath), useLegacyIds, formatOptions, fs, diagnostics);
    const translationFile = serializer.serialize(messages);
    fs.ensureDir(fs.dirname(outputPath));
    fs.writeFile(outputPath, translationFile);
    if (diagnostics.messages.length) {
        logger.warn(diagnostics.formatDiagnostics('Messages extracted with warnings'));
    }
}
function getSerializer(format, sourceLocale, rootPath, useLegacyIds, formatOptions = {}, fs, diagnostics) {
    switch (format) {
        case 'xlf':
        case 'xlif':
        case 'xliff':
            return new Xliff1TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
        case 'xlf2':
        case 'xlif2':
        case 'xliff2':
            return new Xliff2TranslationSerializer(sourceLocale, rootPath, useLegacyIds, formatOptions, fs);
        case 'xmb':
            return new XmbTranslationSerializer(rootPath, useLegacyIds, fs);
        case 'json':
            return new SimpleJsonTranslationSerializer(sourceLocale);
        case 'arb':
            return new ArbTranslationSerializer(sourceLocale, rootPath, fs);
        case 'legacy-migrate':
            return new LegacyMessageIdMigrationSerializer(diagnostics);
    }
    throw new Error(`No translation serializer can handle the provided format: ${format}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUErQyxNQUFNLDZDQUE2QyxDQUFDO0FBQzFJLE9BQU8sRUFBQyxhQUFhLEVBQVUsUUFBUSxFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFFeEYsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFJL0IsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU5QyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUN4RixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxpREFBaUQsQ0FBQztBQUNoRyxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUM5RixPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUM5RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUN4RixPQUFPLEVBQWdCLGtCQUFrQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDckYsT0FBTyxFQUFDLGtDQUFrQyxFQUFDLE1BQU0sNERBQTRELENBQUM7QUFFOUcsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUMzQixPQUFPLENBQUMsS0FBSyxHQUFHLDJEQUEyRCxDQUFDO0lBQzVFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvRCxLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxRQUFRO1lBQ1gsT0FBTyxJQUFJLDJCQUEyQixDQUNsQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0QsS0FBSyxLQUFLO1lBQ1IsT0FBTyxJQUFJLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsS0FBSyxNQUFNO1lBQ1QsT0FBTyxJQUFJLCtCQUErQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNELEtBQUssS0FBSztZQUNSLE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLEtBQUssZ0JBQWdCO1lBQ25CLE9BQU8sSUFBSSxrQ0FBa0MsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM5RDtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtzZXRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgUGF0aE1hbmlwdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0NvbnNvbGVMb2dnZXIsIExvZ2dlciwgTG9nTGV2ZWx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZX0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHtEaWFnbm9zdGljcywgRGlhZ25vc3RpY0hhbmRsaW5nU3RyYXRlZ3l9IGZyb20gJy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtjaGVja0R1cGxpY2F0ZU1lc3NhZ2VzfSBmcm9tICcuL2R1cGxpY2F0ZXMnO1xuaW1wb3J0IHtNZXNzYWdlRXh0cmFjdG9yfSBmcm9tICcuL2V4dHJhY3Rpb24nO1xuaW1wb3J0IHtUcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge0FyYlRyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy9hcmJfdHJhbnNsYXRpb25fc2VyaWFsaXplcic7XG5pbXBvcnQge1NpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvanNvbl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYxVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMV90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WGxpZmYyVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3hsaWZmMl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7WG1iVHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL3htYl90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7Rm9ybWF0T3B0aW9ucywgcGFyc2VGb3JtYXRPcHRpb25zfSBmcm9tICcuL3RyYW5zbGF0aW9uX2ZpbGVzL2Zvcm1hdF9vcHRpb25zJztcbmltcG9ydCB7TGVnYWN5TWVzc2FnZUlkTWlncmF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy9sZWdhY3lfbWVzc2FnZV9pZF9taWdyYXRpb25fc2VyaWFsaXplcic7XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBwcm9jZXNzLnRpdGxlID0gJ0FuZ3VsYXIgTG9jYWxpemF0aW9uIE1lc3NhZ2UgRXh0cmFjdG9yIChsb2NhbGl6ZS1leHRyYWN0KSc7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdsJywge1xuICAgICAgICAgICAgYWxpYXM6ICdsb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdlbicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgZGVmYXVsdDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdUaGUgcm9vdCBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigncycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnc291cmNlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0EgZ2xvYiBwYXR0ZXJuIGluZGljYXRpbmcgd2hhdCBmaWxlcyB0byBzZWFyY2ggZm9yIHRyYW5zbGF0aW9ucywgZS5nLiBgLi9kaXN0LyoqLyouanNgLlxcbicgK1xuICAgICAgICAgICAgICAgICdUaGlzIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgcm9vdCBwYXRoLicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ2YnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2Zvcm1hdCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNob2ljZXM6IFtcbiAgICAgICAgICAgICAgJ3htYicsICd4bGYnLCAneGxpZicsICd4bGlmZicsICd4bGYyJywgJ3hsaWYyJywgJ3hsaWZmMicsICdqc29uJywgJ2xlZ2FjeS1taWdyYXRlJ1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGZvcm1hdCBvZiB0aGUgdHJhbnNsYXRpb24gZmlsZS4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdmb3JtYXRPcHRpb25zJywge1xuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ0FkZGl0aW9uYWwgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHNlcmlhbGl6ZXIsIGluIHRoZSBmb3JtIG9mIEpTT04gZm9ybWF0dGVkIGtleS12YWx1ZSBzdHJpbmcgcGFpcnM6XFxuJyArXG4gICAgICAgICAgICAgICAgJ0ZvciBleGFtcGxlOiBgLS1mb3JtYXRPcHRpb25zIHtcInhtbDpzcGFjZVwiOlwicHJlc2VydmVcIn0uXFxuJyArXG4gICAgICAgICAgICAgICAgJ1RoZSBtZWFuaW5nIG9mIHRoZSBvcHRpb25zIGlzIHNwZWNpZmljIHRvIHRoZSBmb3JtYXQgYmVpbmcgc2VyaWFsaXplZC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ28nLCB7XG4gICAgICAgICAgICBhbGlhczogJ291dHB1dFBhdGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3QgcGF0aC4nLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdsb2dsZXZlbCcsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnVGhlIGxvd2VzdCBzZXZlcml0eSBsb2dnaW5nIG1lc3NhZ2UgdGhhdCBzaG91bGQgYmUgb3V0cHV0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2RlYnVnJywgJ2luZm8nLCAnd2FybicsICdlcnJvciddLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCd1c2VTb3VyY2VNYXBzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIGdlbmVyYXRlIHNvdXJjZSBpbmZvcm1hdGlvbiBpbiB0aGUgb3V0cHV0IGZpbGVzIGJ5IGZvbGxvd2luZyBzb3VyY2UtbWFwIG1hcHBpbmdzIGZvdW5kIGluIHRoZSBzb3VyY2UgZmlsZXMnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndXNlTGVnYWN5SWRzJywge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdXaGV0aGVyIHRvIHVzZSB0aGUgbGVnYWN5IGlkIGZvcm1hdCBmb3IgbWVzc2FnZXMgdGhhdCB3ZXJlIGV4dHJhY3RlZCBmcm9tIEFuZ3VsYXIgdGVtcGxhdGVzLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdkJywge1xuICAgICAgICAgICAgYWxpYXM6ICdkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1lc3NhZ2VzIHdpdGggdGhlIHNhbWUgaWQgYnV0IGRpZmZlcmVudCB0ZXh0LicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHJpY3QoKVxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3QgZmlsZVN5c3RlbSA9IG5ldyBOb2RlSlNGaWxlU3lzdGVtKCk7XG4gIHNldEZpbGVTeXN0ZW0oZmlsZVN5c3RlbSk7XG5cbiAgY29uc3Qgcm9vdFBhdGggPSBvcHRpb25zLnI7XG4gIGNvbnN0IHNvdXJjZUZpbGVQYXRocyA9IGdsb2Iuc3luYyhvcHRpb25zLnMsIHtjd2Q6IHJvb3RQYXRoLCBub2RpcjogdHJ1ZX0pO1xuICBjb25zdCBsb2dMZXZlbCA9IG9wdGlvbnMubG9nbGV2ZWwgYXMgKGtleW9mIHR5cGVvZiBMb2dMZXZlbCkgfCB1bmRlZmluZWQ7XG4gIGNvbnN0IGxvZ2dlciA9IG5ldyBDb25zb2xlTG9nZ2VyKGxvZ0xldmVsID8gTG9nTGV2ZWxbbG9nTGV2ZWxdIDogTG9nTGV2ZWwud2Fybik7XG4gIGNvbnN0IGR1cGxpY2F0ZU1lc3NhZ2VIYW5kbGluZyA9IG9wdGlvbnMuZCBhcyBEaWFnbm9zdGljSGFuZGxpbmdTdHJhdGVneTtcbiAgY29uc3QgZm9ybWF0T3B0aW9ucyA9IHBhcnNlRm9ybWF0T3B0aW9ucyhvcHRpb25zLmZvcm1hdE9wdGlvbnMpO1xuICBjb25zdCBmb3JtYXQgPSBvcHRpb25zLmY7XG5cbiAgZXh0cmFjdFRyYW5zbGF0aW9ucyh7XG4gICAgcm9vdFBhdGgsXG4gICAgc291cmNlRmlsZVBhdGhzLFxuICAgIHNvdXJjZUxvY2FsZTogb3B0aW9ucy5sLFxuICAgIGZvcm1hdCxcbiAgICBvdXRwdXRQYXRoOiBvcHRpb25zLm8sXG4gICAgbG9nZ2VyLFxuICAgIHVzZVNvdXJjZU1hcHM6IG9wdGlvbnMudXNlU291cmNlTWFwcyxcbiAgICB1c2VMZWdhY3lJZHM6IGZvcm1hdCA9PT0gJ2xlZ2FjeS1taWdyYXRlJyB8fCBvcHRpb25zLnVzZUxlZ2FjeUlkcyxcbiAgICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsXG4gICAgZm9ybWF0T3B0aW9ucyxcbiAgICBmaWxlU3lzdGVtLFxuICB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHRyYWN0VHJhbnNsYXRpb25zT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIG9mIHRoZSBzb3VyY2UgYmVpbmcgcHJvY2Vzc2VkLlxuICAgKi9cbiAgc291cmNlTG9jYWxlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgYmFzZSBwYXRoIGZvciBvdGhlciBwYXRocyBwcm92aWRlZCBpbiB0aGVzZSBvcHRpb25zLlxuICAgKiBUaGlzIHNob3VsZCBlaXRoZXIgYmUgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gICAqL1xuICByb290UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcGF0aHMgdG8gZmlsZXMgdG8gc2VhcmNoIGZvciB0cmFuc2xhdGlvbnMuIFRoZXNlIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGVcbiAgICogcm9vdFBhdGguXG4gICAqL1xuICBzb3VyY2VGaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIGZvcm1hdCBvZiB0aGUgdHJhbnNsYXRpb24gZmlsZS5cbiAgICovXG4gIGZvcm1hdDogc3RyaW5nO1xuICAvKipcbiAgICogQSBwYXRoIHRvIHdoZXJlIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHdpbGwgYmUgd3JpdHRlbi4gVGhpcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIHJvb3RQYXRoLlxuICAgKi9cbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGxvZ2dlciB0byB1c2UgZm9yIGRpYWdub3N0aWMgbWVzc2FnZXMuXG4gICAqL1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgc291cmNlIGluZm9ybWF0aW9uIGluIHRoZSBvdXRwdXQgZmlsZXMgYnkgZm9sbG93aW5nIHNvdXJjZS1tYXAgbWFwcGluZ3NcbiAgICogZm91bmQgaW4gdGhlIHNvdXJjZSBmaWxlLlxuICAgKi9cbiAgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIHRoZSBsZWdhY3kgaWQgZm9ybWF0IGZvciBtZXNzYWdlcyB0aGF0IHdlcmUgZXh0cmFjdGVkIGZyb20gQW5ndWxhciB0ZW1wbGF0ZXNcbiAgICovXG4gIHVzZUxlZ2FjeUlkczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgbWVzc2FnZXMgd2l0aCB0aGUgc2FtZSBpZCBidXQgbm90IHRoZSBzYW1lIHRleHQuXG4gICAqL1xuICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmc6IERpYWdub3N0aWNIYW5kbGluZ1N0cmF0ZWd5O1xuICAvKipcbiAgICogQSBjb2xsZWN0aW9uIG9mIGZvcm1hdHRpbmcgb3B0aW9ucyB0byBwYXNzIHRvIHRoZSB0cmFuc2xhdGlvbiBmaWxlIHNlcmlhbGl6ZXIuXG4gICAqL1xuICBmb3JtYXRPcHRpb25zPzogRm9ybWF0T3B0aW9ucztcbiAgLyoqXG4gICAqIFRoZSBmaWxlLXN5c3RlbSBhYnN0cmFjdGlvbiB0byB1c2UuXG4gICAqL1xuICBmaWxlU3lzdGVtOiBGaWxlU3lzdGVtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFRyYW5zbGF0aW9ucyh7XG4gIHJvb3RQYXRoLFxuICBzb3VyY2VGaWxlUGF0aHMsXG4gIHNvdXJjZUxvY2FsZSxcbiAgZm9ybWF0LFxuICBvdXRwdXRQYXRoOiBvdXRwdXQsXG4gIGxvZ2dlcixcbiAgdXNlU291cmNlTWFwcyxcbiAgdXNlTGVnYWN5SWRzLFxuICBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsXG4gIGZvcm1hdE9wdGlvbnMgPSB7fSxcbiAgZmlsZVN5c3RlbTogZnMsXG59OiBFeHRyYWN0VHJhbnNsYXRpb25zT3B0aW9ucykge1xuICBjb25zdCBiYXNlUGF0aCA9IGZzLnJlc29sdmUocm9vdFBhdGgpO1xuICBjb25zdCBleHRyYWN0b3IgPSBuZXcgTWVzc2FnZUV4dHJhY3RvcihmcywgbG9nZ2VyLCB7YmFzZVBhdGgsIHVzZVNvdXJjZU1hcHN9KTtcblxuICBjb25zdCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10gPSBbXTtcbiAgZm9yIChjb25zdCBmaWxlIG9mIHNvdXJjZUZpbGVQYXRocykge1xuICAgIG1lc3NhZ2VzLnB1c2goLi4uZXh0cmFjdG9yLmV4dHJhY3RNZXNzYWdlcyhmaWxlKSk7XG4gIH1cblxuICBjb25zdCBkaWFnbm9zdGljcyA9IGNoZWNrRHVwbGljYXRlTWVzc2FnZXMoZnMsIG1lc3NhZ2VzLCBkdXBsaWNhdGVNZXNzYWdlSGFuZGxpbmcsIGJhc2VQYXRoKTtcbiAgaWYgKGRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgIHRocm93IG5ldyBFcnJvcihkaWFnbm9zdGljcy5mb3JtYXREaWFnbm9zdGljcygnRmFpbGVkIHRvIGV4dHJhY3QgbWVzc2FnZXMnKSk7XG4gIH1cblxuICBjb25zdCBvdXRwdXRQYXRoID0gZnMucmVzb2x2ZShyb290UGF0aCwgb3V0cHV0KTtcbiAgY29uc3Qgc2VyaWFsaXplciA9IGdldFNlcmlhbGl6ZXIoXG4gICAgICBmb3JtYXQsIHNvdXJjZUxvY2FsZSwgZnMuZGlybmFtZShvdXRwdXRQYXRoKSwgdXNlTGVnYWN5SWRzLCBmb3JtYXRPcHRpb25zLCBmcywgZGlhZ25vc3RpY3MpO1xuICBjb25zdCB0cmFuc2xhdGlvbkZpbGUgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShtZXNzYWdlcyk7XG4gIGZzLmVuc3VyZURpcihmcy5kaXJuYW1lKG91dHB1dFBhdGgpKTtcbiAgZnMud3JpdGVGaWxlKG91dHB1dFBhdGgsIHRyYW5zbGF0aW9uRmlsZSk7XG5cbiAgaWYgKGRpYWdub3N0aWNzLm1lc3NhZ2VzLmxlbmd0aCkge1xuICAgIGxvZ2dlci53YXJuKGRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKCdNZXNzYWdlcyBleHRyYWN0ZWQgd2l0aCB3YXJuaW5ncycpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZXJpYWxpemVyKFxuICAgIGZvcm1hdDogc3RyaW5nLCBzb3VyY2VMb2NhbGU6IHN0cmluZywgcm9vdFBhdGg6IEFic29sdXRlRnNQYXRoLCB1c2VMZWdhY3lJZHM6IGJvb2xlYW4sXG4gICAgZm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9ucyA9IHt9LCBmczogUGF0aE1hbmlwdWxhdGlvbixcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MpOiBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgJ3hsZic6XG4gICAgY2FzZSAneGxpZic6XG4gICAgY2FzZSAneGxpZmYnOlxuICAgICAgcmV0dXJuIG5ldyBYbGlmZjFUcmFuc2xhdGlvblNlcmlhbGl6ZXIoXG4gICAgICAgICAgc291cmNlTG9jYWxlLCByb290UGF0aCwgdXNlTGVnYWN5SWRzLCBmb3JtYXRPcHRpb25zLCBmcyk7XG4gICAgY2FzZSAneGxmMic6XG4gICAgY2FzZSAneGxpZjInOlxuICAgIGNhc2UgJ3hsaWZmMic6XG4gICAgICByZXR1cm4gbmV3IFhsaWZmMlRyYW5zbGF0aW9uU2VyaWFsaXplcihcbiAgICAgICAgICBzb3VyY2VMb2NhbGUsIHJvb3RQYXRoLCB1c2VMZWdhY3lJZHMsIGZvcm1hdE9wdGlvbnMsIGZzKTtcbiAgICBjYXNlICd4bWInOlxuICAgICAgcmV0dXJuIG5ldyBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXIocm9vdFBhdGgsIHVzZUxlZ2FjeUlkcywgZnMpO1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgcmV0dXJuIG5ldyBTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSk7XG4gICAgY2FzZSAnYXJiJzpcbiAgICAgIHJldHVybiBuZXcgQXJiVHJhbnNsYXRpb25TZXJpYWxpemVyKHNvdXJjZUxvY2FsZSwgcm9vdFBhdGgsIGZzKTtcbiAgICBjYXNlICdsZWdhY3ktbWlncmF0ZSc6XG4gICAgICByZXR1cm4gbmV3IExlZ2FjeU1lc3NhZ2VJZE1pZ3JhdGlvblNlcmlhbGl6ZXIoZGlhZ25vc3RpY3MpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihgTm8gdHJhbnNsYXRpb24gc2VyaWFsaXplciBjYW4gaGFuZGxlIHRoZSBwcm92aWRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xufVxuIl19