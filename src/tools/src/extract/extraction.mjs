import { SourceFileLoader } from '@angular/compiler-cli/src/ngtsc/sourcemaps';
import { transformSync } from '@babel/core';
import { makeEs2015ExtractPlugin } from './source_files/es2015_extract_plugin';
import { makeEs5ExtractPlugin } from './source_files/es5_extract_plugin';
/**
 * Extracts parsed messages from file contents, by parsing the contents as JavaScript
 * and looking for occurrences of `$localize` in the source code.
 *
 * @publicApi used by CLI
 */
export class MessageExtractor {
    constructor(fs, logger, { basePath, useSourceMaps = true, localizeName = '$localize' }) {
        this.fs = fs;
        this.logger = logger;
        this.basePath = basePath;
        this.useSourceMaps = useSourceMaps;
        this.localizeName = localizeName;
        this.loader = new SourceFileLoader(this.fs, this.logger, { webpack: basePath });
    }
    extractMessages(filename) {
        const messages = [];
        const sourceCode = this.fs.readFile(this.fs.resolve(this.basePath, filename));
        if (sourceCode.includes(this.localizeName)) {
            // Only bother to parse the file if it contains a reference to `$localize`.
            transformSync(sourceCode, {
                sourceRoot: this.basePath,
                filename,
                plugins: [
                    makeEs2015ExtractPlugin(this.fs, messages, this.localizeName),
                    makeEs5ExtractPlugin(this.fs, messages, this.localizeName),
                ],
                code: false,
                ast: false
            });
            if (this.useSourceMaps && messages.length > 0) {
                this.updateSourceLocations(filename, sourceCode, messages);
            }
        }
        return messages;
    }
    /**
     * Update the location of each message to point to the source-mapped original source location, if
     * available.
     */
    updateSourceLocations(filename, contents, messages) {
        const sourceFile = this.loader.loadSourceFile(this.fs.resolve(this.basePath, filename), contents);
        if (sourceFile === null) {
            return;
        }
        for (const message of messages) {
            if (message.location !== undefined) {
                message.location = this.getOriginalLocation(sourceFile, message.location);
                if (message.messagePartLocations) {
                    message.messagePartLocations = message.messagePartLocations.map(location => location && this.getOriginalLocation(sourceFile, location));
                }
                if (message.substitutionLocations) {
                    const placeholderNames = Object.keys(message.substitutionLocations);
                    for (const placeholderName of placeholderNames) {
                        const location = message.substitutionLocations[placeholderName];
                        message.substitutionLocations[placeholderName] =
                            location && this.getOriginalLocation(sourceFile, location);
                    }
                }
            }
        }
    }
    /**
     * Find the original location using source-maps if available.
     *
     * @param sourceFile The generated `sourceFile` that contains the `location`.
     * @param location The location within the generated `sourceFile` that needs mapping.
     *
     * @returns A new location that refers to the original source location mapped from the given
     *     `location` in the generated `sourceFile`.
     */
    getOriginalLocation(sourceFile, location) {
        const originalStart = sourceFile.getOriginalLocation(location.start.line, location.start.column);
        if (originalStart === null) {
            return location;
        }
        const originalEnd = sourceFile.getOriginalLocation(location.end.line, location.end.column);
        const start = { line: originalStart.line, column: originalStart.column };
        // We check whether the files are the same, since the returned location can only have a single
        // `file` and it would not make sense to store the end position from a different source file.
        const end = (originalEnd !== null && originalEnd.file === originalStart.file) ?
            { line: originalEnd.line, column: originalEnd.column } :
            start;
        const originalSourceFile = sourceFile.sources.find(sf => (sf === null || sf === void 0 ? void 0 : sf.sourcePath) === originalStart.file);
        const startPos = originalSourceFile.startOfLinePositions[start.line] + start.column;
        const endPos = originalSourceFile.startOfLinePositions[end.line] + end.column;
        const text = originalSourceFile.contents.substring(startPos, endPos).trim();
        return { file: originalStart.file, start, end, text };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9leHRyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBYSxnQkFBZ0IsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBRXhGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFMUMsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFRdkU7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sZ0JBQWdCO0lBTTNCLFlBQ1ksRUFBc0IsRUFBVSxNQUFjLEVBQ3RELEVBQUMsUUFBUSxFQUFFLGFBQWEsR0FBRyxJQUFJLEVBQUUsWUFBWSxHQUFHLFdBQVcsRUFBb0I7UUFEdkUsT0FBRSxHQUFGLEVBQUUsQ0FBb0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRXhELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsZUFBZSxDQUNYLFFBQWdCO1FBRWxCLE1BQU0sUUFBUSxHQUFxQixFQUFFLENBQUM7UUFDdEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxD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QzNGLE1BQU0sS0FBSyxHQUFHLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUN2RSw4RkFBOEY7UUFDOUYsNkZBQTZGO1FBQzdGLE1BQU0sR0FBRyxHQUFHLENBQUMsV0FBVyxLQUFLLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNFLEVBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQ3RELEtBQUssQ0FBQztRQUNWLE1BQU0sa0JBQWtCLEdBQ3BCLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQSxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsVUFBVSxNQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUMxRSxNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNwRixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1RSxPQUFPLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFJlYWRvbmx5RmlsZVN5c3RlbX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9sb2dnaW5nJztcbmltcG9ydCB7U291cmNlRmlsZSwgU291cmNlRmlsZUxvYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9zb3VyY2VtYXBzJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge3RyYW5zZm9ybVN5bmN9IGZyb20gJ0BiYWJlbC9jb3JlJztcblxuaW1wb3J0IHttYWtlRXMyMDE1RXh0cmFjdFBsdWdpbn0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvZXMyMDE1X2V4dHJhY3RfcGx1Z2luJztcbmltcG9ydCB7bWFrZUVzNUV4dHJhY3RQbHVnaW59IGZyb20gJy4vc291cmNlX2ZpbGVzL2VzNV9leHRyYWN0X3BsdWdpbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXh0cmFjdGlvbk9wdGlvbnMge1xuICBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIHVzZVNvdXJjZU1hcHM/OiBib29sZWFuO1xuICBsb2NhbGl6ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRXh0cmFjdHMgcGFyc2VkIG1lc3NhZ2VzIGZyb20gZmlsZSBjb250ZW50cywgYnkgcGFyc2luZyB0aGUgY29udGVudHMgYXMgSmF2YVNjcmlwdFxuICogYW5kIGxvb2tpbmcgZm9yIG9jY3VycmVuY2VzIG9mIGAkbG9jYWxpemVgIGluIHRoZSBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlRXh0cmFjdG9yIHtcbiAgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIHByaXZhdGUgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsb2NhbGl6ZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBsb2FkZXI6IFNvdXJjZUZpbGVMb2FkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGZzOiBSZWFkb25seUZpbGVTeXN0ZW0sIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsXG4gICAgICB7YmFzZVBhdGgsIHVzZVNvdXJjZU1hcHMgPSB0cnVlLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IEV4dHJhY3Rpb25PcHRpb25zKSB7XG4gICAgdGhpcy5iYXNlUGF0aCA9IGJhc2VQYXRoO1xuICAgIHRoaXMudXNlU291cmNlTWFwcyA9IHVzZVNvdXJjZU1hcHM7XG4gICAgdGhpcy5sb2NhbGl6ZU5hbWUgPSBsb2NhbGl6ZU5hbWU7XG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgU291cmNlRmlsZUxvYWRlcih0aGlzLmZzLCB0aGlzLmxvZ2dlciwge3dlYnBhY2s6IGJhc2VQYXRofSk7XG4gIH1cblxuICBleHRyYWN0TWVzc2FnZXMoXG4gICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgKTogybVQYXJzZWRNZXNzYWdlW10ge1xuICAgIGNvbnN0IG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSA9IFtdO1xuICAgIGNvbnN0IHNvdXJjZUNvZGUgPSB0aGlzLmZzLnJlYWRGaWxlKHRoaXMuZnMucmVzb2x2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlbmFtZSkpO1xuICAgIGlmIChzb3VyY2VDb2RlLmluY2x1ZGVzKHRoaXMubG9jYWxpemVOYW1lKSkge1xuICAgICAgLy8gT25seSBib3RoZXIgdG8gcGFyc2UgdGhlIGZpbGUgaWYgaXQgY29udGFpbnMgYSByZWZlcmVuY2UgdG8gYCRsb2NhbGl6ZWAuXG4gICAgICB0cmFuc2Zvcm1TeW5jKHNvdXJjZUNvZGUsIHtcbiAgICAgICAgc291cmNlUm9vdDogdGhpcy5iYXNlUGF0aCxcbiAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBtYWtlRXMyMDE1RXh0cmFjdFBsdWdpbih0aGlzLmZzLCBtZXNzYWdlcywgdGhpcy5sb2NhbGl6ZU5hbWUpLFxuICAgICAgICAgIG1ha2VFczVFeHRyYWN0UGx1Z2luKHRoaXMuZnMsIG1lc3NhZ2VzLCB0aGlzLmxvY2FsaXplTmFtZSksXG4gICAgICAgIF0sXG4gICAgICAgIGNvZGU6IGZhbHNlLFxuICAgICAgICBhc3Q6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLnVzZVNvdXJjZU1hcHMgJiYgbWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNvdXJjZUxvY2F0aW9ucyhmaWxlbmFtZSwgc291cmNlQ29kZSwgbWVzc2FnZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBsb2NhdGlvbiBvZiBlYWNoIG1lc3NhZ2UgdG8gcG9pbnQgdG8gdGhlIHNvdXJjZS1tYXBwZWQgb3JpZ2luYWwgc291cmNlIGxvY2F0aW9uLCBpZlxuICAgKiBhdmFpbGFibGUuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZVNvdXJjZUxvY2F0aW9ucyhmaWxlbmFtZTogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOlxuICAgICAgdm9pZCB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9XG4gICAgICAgIHRoaXMubG9hZGVyLmxvYWRTb3VyY2VGaWxlKHRoaXMuZnMucmVzb2x2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlbmFtZSksIGNvbnRlbnRzKTtcbiAgICBpZiAoc291cmNlRmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtZXNzYWdlLmxvY2F0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWVzc2FnZS5sb2NhdGlvbiA9IHRoaXMuZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlLCBtZXNzYWdlLmxvY2F0aW9uKTtcblxuICAgICAgICBpZiAobWVzc2FnZS5tZXNzYWdlUGFydExvY2F0aW9ucykge1xuICAgICAgICAgIG1lc3NhZ2UubWVzc2FnZVBhcnRMb2NhdGlvbnMgPSBtZXNzYWdlLm1lc3NhZ2VQYXJ0TG9jYXRpb25zLm1hcChcbiAgICAgICAgICAgICAgbG9jYXRpb24gPT4gbG9jYXRpb24gJiYgdGhpcy5nZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGUsIGxvY2F0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnMpIHtcbiAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlck5hbWVzID0gT2JqZWN0LmtleXMobWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnMpO1xuICAgICAgICAgIGZvciAoY29uc3QgcGxhY2Vob2xkZXJOYW1lIG9mIHBsYWNlaG9sZGVyTmFtZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnNbcGxhY2Vob2xkZXJOYW1lXTtcbiAgICAgICAgICAgIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uTG9jYXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPVxuICAgICAgICAgICAgICAgIGxvY2F0aW9uICYmIHRoaXMuZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlLCBsb2NhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG9yaWdpbmFsIGxvY2F0aW9uIHVzaW5nIHNvdXJjZS1tYXBzIGlmIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgVGhlIGdlbmVyYXRlZCBgc291cmNlRmlsZWAgdGhhdCBjb250YWlucyB0aGUgYGxvY2F0aW9uYC5cbiAgICogQHBhcmFtIGxvY2F0aW9uIFRoZSBsb2NhdGlvbiB3aXRoaW4gdGhlIGdlbmVyYXRlZCBgc291cmNlRmlsZWAgdGhhdCBuZWVkcyBtYXBwaW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG5ldyBsb2NhdGlvbiB0aGF0IHJlZmVycyB0byB0aGUgb3JpZ2luYWwgc291cmNlIGxvY2F0aW9uIG1hcHBlZCBmcm9tIHRoZSBnaXZlblxuICAgKiAgICAgYGxvY2F0aW9uYCBpbiB0aGUgZ2VuZXJhdGVkIGBzb3VyY2VGaWxlYC5cbiAgICovXG4gIHByaXZhdGUgZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlOiBTb3VyY2VGaWxlLCBsb2NhdGlvbjogybVTb3VyY2VMb2NhdGlvbik6IMm1U291cmNlTG9jYXRpb24ge1xuICAgIGNvbnN0IG9yaWdpbmFsU3RhcnQgPVxuICAgICAgICBzb3VyY2VGaWxlLmdldE9yaWdpbmFsTG9jYXRpb24obG9jYXRpb24uc3RhcnQubGluZSwgbG9jYXRpb24uc3RhcnQuY29sdW1uKTtcbiAgICBpZiAob3JpZ2luYWxTdGFydCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2F0aW9uO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbEVuZCA9IHNvdXJjZUZpbGUuZ2V0T3JpZ2luYWxMb2NhdGlvbihsb2NhdGlvbi5lbmQubGluZSwgbG9jYXRpb24uZW5kLmNvbHVtbik7XG4gICAgY29uc3Qgc3RhcnQgPSB7bGluZTogb3JpZ2luYWxTdGFydC5saW5lLCBjb2x1bW46IG9yaWdpbmFsU3RhcnQuY29sdW1ufTtcbiAgICAvLyBXZSBjaGVjayB3aGV0aGVyIHRoZSBmaWxlcyBhcmUgdGhlIHNhbWUsIHNpbmNlIHRoZSByZXR1cm5lZCBsb2NhdGlvbiBjYW4gb25seSBoYXZlIGEgc2luZ2xlXG4gICAgLy8gYGZpbGVgIGFuZCBpdCB3b3VsZCBub3QgbWFrZSBzZW5zZSB0byBzdG9yZSB0aGUgZW5kIHBvc2l0aW9uIGZyb20gYSBkaWZmZXJlbnQgc291cmNlIGZpbGUuXG4gICAgY29uc3QgZW5kID0gKG9yaWdpbmFsRW5kICE9PSBudWxsICYmIG9yaWdpbmFsRW5kLmZpbGUgPT09IG9yaWdpbmFsU3RhcnQuZmlsZSkgP1xuICAgICAgICB7bGluZTogb3JpZ2luYWxFbmQubGluZSwgY29sdW1uOiBvcmlnaW5hbEVuZC5jb2x1bW59IDpcbiAgICAgICAgc3RhcnQ7XG4gICAgY29uc3Qgb3JpZ2luYWxTb3VyY2VGaWxlID1cbiAgICAgICAgc291cmNlRmlsZS5zb3VyY2VzLmZpbmQoc2YgPT4gc2Y/LnNvdXJjZVBhdGggPT09IG9yaWdpbmFsU3RhcnQuZmlsZSkhO1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gb3JpZ2luYWxTb3VyY2VGaWxlLnN0YXJ0T2ZMaW5lUG9zaXRpb25zW3N0YXJ0LmxpbmVdICsgc3RhcnQuY29sdW1uO1xuICAgIGNvbnN0IGVuZFBvcyA9IG9yaWdpbmFsU291cmNlRmlsZS5zdGFydE9mTGluZVBvc2l0aW9uc1tlbmQubGluZV0gKyBlbmQuY29sdW1uO1xuICAgIGNvbnN0IHRleHQgPSBvcmlnaW5hbFNvdXJjZUZpbGUuY29udGVudHMuc3Vic3RyaW5nKHN0YXJ0UG9zLCBlbmRQb3MpLnRyaW0oKTtcbiAgICByZXR1cm4ge2ZpbGU6IG9yaWdpbmFsU3RhcnQuZmlsZSwgc3RhcnQsIGVuZCwgdGV4dH07XG4gIH1cbn1cbiJdfQ==