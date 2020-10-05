(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/extraction", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/sourcemaps", "@babel/core", "@angular/localize/src/tools/src/extract/source_files/es2015_extract_plugin", "@angular/localize/src/tools/src/extract/source_files/es5_extract_plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageExtractor = void 0;
    var tslib_1 = require("tslib");
    var sourcemaps_1 = require("@angular/compiler-cli/src/ngtsc/sourcemaps");
    var core_1 = require("@babel/core");
    var es2015_extract_plugin_1 = require("@angular/localize/src/tools/src/extract/source_files/es2015_extract_plugin");
    var es5_extract_plugin_1 = require("@angular/localize/src/tools/src/extract/source_files/es5_extract_plugin");
    /**
     * Extracts parsed messages from file contents, by parsing the contents as JavaScript
     * and looking for occurrences of `$localize` in the source code.
     */
    var MessageExtractor = /** @class */ (function () {
        function MessageExtractor(fs, logger, _a) {
            var basePath = _a.basePath, _b = _a.useSourceMaps, useSourceMaps = _b === void 0 ? true : _b, _c = _a.localizeName, localizeName = _c === void 0 ? '$localize' : _c;
            this.fs = fs;
            this.logger = logger;
            this.basePath = basePath;
            this.useSourceMaps = useSourceMaps;
            this.localizeName = localizeName;
            this.loader = new sourcemaps_1.SourceFileLoader(this.fs, this.logger, { webpack: basePath });
        }
        MessageExtractor.prototype.extractMessages = function (filename) {
            var messages = [];
            var sourceCode = this.fs.readFile(this.fs.resolve(this.basePath, filename));
            if (sourceCode.includes(this.localizeName)) {
                // Only bother to parse the file if it contains a reference to `$localize`.
                core_1.transformSync(sourceCode, {
                    sourceRoot: this.basePath,
                    filename: filename,
                    plugins: [
                        es2015_extract_plugin_1.makeEs2015ExtractPlugin(messages, this.localizeName),
                        es5_extract_plugin_1.makeEs5ExtractPlugin(messages, this.localizeName),
                    ],
                    code: false,
                    ast: false
                });
            }
            if (this.useSourceMaps) {
                this.updateSourceLocations(filename, sourceCode, messages);
            }
            return messages;
        };
        /**
         * Update the location of each message to point to the source-mapped original source location, if
         * available.
         */
        MessageExtractor.prototype.updateSourceLocations = function (filename, contents, messages) {
            var e_1, _a, e_2, _b;
            var _this = this;
            var sourceFile = this.loader.loadSourceFile(this.fs.resolve(this.basePath, filename), contents);
            if (sourceFile === null) {
                return;
            }
            try {
                for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                    var message = messages_1_1.value;
                    if (message.location !== undefined) {
                        message.location = this.getOriginalLocation(sourceFile, message.location);
                        if (message.messagePartLocations) {
                            message.messagePartLocations = message.messagePartLocations.map(function (location) { return location && _this.getOriginalLocation(sourceFile, location); });
                        }
                        if (message.substitutionLocations) {
                            var placeholderNames = Object.keys(message.substitutionLocations);
                            try {
                                for (var placeholderNames_1 = (e_2 = void 0, tslib_1.__values(placeholderNames)), placeholderNames_1_1 = placeholderNames_1.next(); !placeholderNames_1_1.done; placeholderNames_1_1 = placeholderNames_1.next()) {
                                    var placeholderName = placeholderNames_1_1.value;
                                    var location = message.substitutionLocations[placeholderName];
                                    message.substitutionLocations[placeholderName] =
                                        location && this.getOriginalLocation(sourceFile, location);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (placeholderNames_1_1 && !placeholderNames_1_1.done && (_b = placeholderNames_1.return)) _b.call(placeholderNames_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * Find the original location using source-maps if available.
         *
         * @param sourceFile The generated `sourceFile` that contains the `location`.
         * @param location The location within the generated `sourceFile` that needs mapping.
         *
         * @returns A new location that refers to the original source location mapped from the given
         *     `location` in the generated `sourceFile`.
         */
        MessageExtractor.prototype.getOriginalLocation = function (sourceFile, location) {
            var originalStart = sourceFile.getOriginalLocation(location.start.line, location.start.column);
            if (originalStart === null) {
                return location;
            }
            var originalEnd = sourceFile.getOriginalLocation(location.end.line, location.end.column);
            var start = { line: originalStart.line, column: originalStart.column };
            // We check whether the files are the same, since the returned location can only have a single
            // `file` and it would not make sense to store the end position from a different source file.
            var end = (originalEnd !== null && originalEnd.file === originalStart.file) ?
                { line: originalEnd.line, column: originalEnd.column } :
                start;
            var originalSourceFile = sourceFile.sources.find(function (sf) { return (sf === null || sf === void 0 ? void 0 : sf.sourcePath) === originalStart.file; });
            var startPos = originalSourceFile.startOfLinePositions[start.line] + start.column;
            var endPos = originalSourceFile.startOfLinePositions[end.line] + end.column;
            var text = originalSourceFile.contents.substring(startPos, endPos);
            return { file: originalStart.file, start: start, end: end, text: text };
        };
        return MessageExtractor;
    }());
    exports.MessageExtractor = MessageExtractor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9leHRyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFTQSx5RUFBd0Y7SUFFeEYsb0NBQTBDO0lBRTFDLG9IQUE2RTtJQUM3RSw4R0FBdUU7SUFRdkU7OztPQUdHO0lBQ0g7UUFNRSwwQkFDWSxFQUFjLEVBQVUsTUFBYyxFQUM5QyxFQUErRTtnQkFBOUUsUUFBUSxjQUFBLEVBQUUscUJBQW9CLEVBQXBCLGFBQWEsbUJBQUcsSUFBSSxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1lBRG5ELE9BQUUsR0FBRixFQUFFLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBRWhELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1lBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBRUQsMENBQWUsR0FBZixVQUNJLFFBQWdCO1lBRWxCLElBQU0sUUFBUSxHQUFxQixFQUFFLENBQUM7WUFDdEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlFLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxD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KipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIEZpbGVTeXN0ZW19IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge1NvdXJjZUZpbGUsIFNvdXJjZUZpbGVMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc291cmNlbWFwcyc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHt0cmFuc2Zvcm1TeW5jfSBmcm9tICdAYmFiZWwvY29yZSc7XG5cbmltcG9ydCB7bWFrZUVzMjAxNUV4dHJhY3RQbHVnaW59IGZyb20gJy4vc291cmNlX2ZpbGVzL2VzMjAxNV9leHRyYWN0X3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVFeHRyYWN0UGx1Z2lufSBmcm9tICcuL3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3Rpb25PcHRpb25zIHtcbiAgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoO1xuICB1c2VTb3VyY2VNYXBzPzogYm9vbGVhbjtcbiAgbG9jYWxpemVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHBhcnNlZCBtZXNzYWdlcyBmcm9tIGZpbGUgY29udGVudHMsIGJ5IHBhcnNpbmcgdGhlIGNvbnRlbnRzIGFzIEphdmFTY3JpcHRcbiAqIGFuZCBsb29raW5nIGZvciBvY2N1cnJlbmNlcyBvZiBgJGxvY2FsaXplYCBpbiB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlRXh0cmFjdG9yIHtcbiAgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIHByaXZhdGUgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsb2NhbGl6ZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBsb2FkZXI6IFNvdXJjZUZpbGVMb2FkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGZzOiBGaWxlU3lzdGVtLCBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgICAge2Jhc2VQYXRoLCB1c2VTb3VyY2VNYXBzID0gdHJ1ZSwgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBFeHRyYWN0aW9uT3B0aW9ucykge1xuICAgIHRoaXMuYmFzZVBhdGggPSBiYXNlUGF0aDtcbiAgICB0aGlzLnVzZVNvdXJjZU1hcHMgPSB1c2VTb3VyY2VNYXBzO1xuICAgIHRoaXMubG9jYWxpemVOYW1lID0gbG9jYWxpemVOYW1lO1xuICAgIHRoaXMubG9hZGVyID0gbmV3IFNvdXJjZUZpbGVMb2FkZXIodGhpcy5mcywgdGhpcy5sb2dnZXIsIHt3ZWJwYWNrOiBiYXNlUGF0aH0pO1xuICB9XG5cbiAgZXh0cmFjdE1lc3NhZ2VzKFxuICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICk6IMm1UGFyc2VkTWVzc2FnZVtdIHtcbiAgICBjb25zdCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10gPSBbXTtcbiAgICBjb25zdCBzb3VyY2VDb2RlID0gdGhpcy5mcy5yZWFkRmlsZSh0aGlzLmZzLnJlc29sdmUodGhpcy5iYXNlUGF0aCwgZmlsZW5hbWUpKTtcbiAgICBpZiAoc291cmNlQ29kZS5pbmNsdWRlcyh0aGlzLmxvY2FsaXplTmFtZSkpIHtcbiAgICAgIC8vIE9ubHkgYm90aGVyIHRvIHBhcnNlIHRoZSBmaWxlIGlmIGl0IGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGAkbG9jYWxpemVgLlxuICAgICAgdHJhbnNmb3JtU3luYyhzb3VyY2VDb2RlLCB7XG4gICAgICAgIHNvdXJjZVJvb3Q6IHRoaXMuYmFzZVBhdGgsXG4gICAgICAgIGZpbGVuYW1lLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgbWFrZUVzMjAxNUV4dHJhY3RQbHVnaW4obWVzc2FnZXMsIHRoaXMubG9jYWxpemVOYW1lKSxcbiAgICAgICAgICBtYWtlRXM1RXh0cmFjdFBsdWdpbihtZXNzYWdlcywgdGhpcy5sb2NhbGl6ZU5hbWUpLFxuICAgICAgICBdLFxuICAgICAgICBjb2RlOiBmYWxzZSxcbiAgICAgICAgYXN0OiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZVNvdXJjZU1hcHMpIHtcbiAgICAgIHRoaXMudXBkYXRlU291cmNlTG9jYXRpb25zKGZpbGVuYW1lLCBzb3VyY2VDb2RlLCBtZXNzYWdlcyk7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxvY2F0aW9uIG9mIGVhY2ggbWVzc2FnZSB0byBwb2ludCB0byB0aGUgc291cmNlLW1hcHBlZCBvcmlnaW5hbCBzb3VyY2UgbG9jYXRpb24sIGlmXG4gICAqIGF2YWlsYWJsZS5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlU291cmNlTG9jYXRpb25zKGZpbGVuYW1lOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6XG4gICAgICB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID1cbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZFNvdXJjZUZpbGUodGhpcy5mcy5yZXNvbHZlKHRoaXMuYmFzZVBhdGgsIGZpbGVuYW1lKSwgY29udGVudHMpO1xuICAgIGlmIChzb3VyY2VGaWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtZXNzYWdlLmxvY2F0aW9uID0gdGhpcy5nZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGUsIG1lc3NhZ2UubG9jYXRpb24pO1xuXG4gICAgICAgIGlmIChtZXNzYWdlLm1lc3NhZ2VQYXJ0TG9jYXRpb25zKSB7XG4gICAgICAgICAgbWVzc2FnZS5tZXNzYWdlUGFydExvY2F0aW9ucyA9IG1lc3NhZ2UubWVzc2FnZVBhcnRMb2NhdGlvbnMubWFwKFxuICAgICAgICAgICAgICBsb2NhdGlvbiA9PiBsb2NhdGlvbiAmJiB0aGlzLmdldE9yaWdpbmFsTG9jYXRpb24oc291cmNlRmlsZSwgbG9jYXRpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucykge1xuICAgICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyTmFtZXMgPSBPYmplY3Qua2V5cyhtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9ucyk7XG4gICAgICAgICAgZm9yIChjb25zdCBwbGFjZWhvbGRlck5hbWUgb2YgcGxhY2Vob2xkZXJOYW1lcykge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBtZXNzYWdlLnN1YnN0aXR1dGlvbkxvY2F0aW9uc1twbGFjZWhvbGRlck5hbWVdO1xuICAgICAgICAgICAgbWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnNbcGxhY2Vob2xkZXJOYW1lXSA9XG4gICAgICAgICAgICAgICAgbG9jYXRpb24gJiYgdGhpcy5nZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGUsIGxvY2F0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgb3JpZ2luYWwgbG9jYXRpb24gdXNpbmcgc291cmNlLW1hcHMgaWYgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gc291cmNlRmlsZSBUaGUgZ2VuZXJhdGVkIGBzb3VyY2VGaWxlYCB0aGF0IGNvbnRhaW5zIHRoZSBgbG9jYXRpb25gLlxuICAgKiBAcGFyYW0gbG9jYXRpb24gVGhlIGxvY2F0aW9uIHdpdGhpbiB0aGUgZ2VuZXJhdGVkIGBzb3VyY2VGaWxlYCB0aGF0IG5lZWRzIG1hcHBpbmcuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbmV3IGxvY2F0aW9uIHRoYXQgcmVmZXJzIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UgbG9jYXRpb24gbWFwcGVkIGZyb20gdGhlIGdpdmVuXG4gICAqICAgICBgbG9jYXRpb25gIGluIHRoZSBnZW5lcmF0ZWQgYHNvdXJjZUZpbGVgLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGU6IFNvdXJjZUZpbGUsIGxvY2F0aW9uOiDJtVNvdXJjZUxvY2F0aW9uKTogybVTb3VyY2VMb2NhdGlvbiB7XG4gICAgY29uc3Qgb3JpZ2luYWxTdGFydCA9XG4gICAgICAgIHNvdXJjZUZpbGUuZ2V0T3JpZ2luYWxMb2NhdGlvbihsb2NhdGlvbi5zdGFydC5saW5lLCBsb2NhdGlvbi5zdGFydC5jb2x1bW4pO1xuICAgIGlmIChvcmlnaW5hbFN0YXJ0ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsRW5kID0gc291cmNlRmlsZS5nZXRPcmlnaW5hbExvY2F0aW9uKGxvY2F0aW9uLmVuZC5saW5lLCBsb2NhdGlvbi5lbmQuY29sdW1uKTtcbiAgICBjb25zdCBzdGFydCA9IHtsaW5lOiBvcmlnaW5hbFN0YXJ0LmxpbmUsIGNvbHVtbjogb3JpZ2luYWxTdGFydC5jb2x1bW59O1xuICAgIC8vIFdlIGNoZWNrIHdoZXRoZXIgdGhlIGZpbGVzIGFyZSB0aGUgc2FtZSwgc2luY2UgdGhlIHJldHVybmVkIGxvY2F0aW9uIGNhbiBvbmx5IGhhdmUgYSBzaW5nbGVcbiAgICAvLyBgZmlsZWAgYW5kIGl0IHdvdWxkIG5vdCBtYWtlIHNlbnNlIHRvIHN0b3JlIHRoZSBlbmQgcG9zaXRpb24gZnJvbSBhIGRpZmZlcmVudCBzb3VyY2UgZmlsZS5cbiAgICBjb25zdCBlbmQgPSAob3JpZ2luYWxFbmQgIT09IG51bGwgJiYgb3JpZ2luYWxFbmQuZmlsZSA9PT0gb3JpZ2luYWxTdGFydC5maWxlKSA/XG4gICAgICAgIHtsaW5lOiBvcmlnaW5hbEVuZC5saW5lLCBjb2x1bW46IG9yaWdpbmFsRW5kLmNvbHVtbn0gOlxuICAgICAgICBzdGFydDtcbiAgICBjb25zdCBvcmlnaW5hbFNvdXJjZUZpbGUgPVxuICAgICAgICBzb3VyY2VGaWxlLnNvdXJjZXMuZmluZChzZiA9PiBzZj8uc291cmNlUGF0aCA9PT0gb3JpZ2luYWxTdGFydC5maWxlKSE7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBvcmlnaW5hbFNvdXJjZUZpbGUuc3RhcnRPZkxpbmVQb3NpdGlvbnNbc3RhcnQubGluZV0gKyBzdGFydC5jb2x1bW47XG4gICAgY29uc3QgZW5kUG9zID0gb3JpZ2luYWxTb3VyY2VGaWxlLnN0YXJ0T2ZMaW5lUG9zaXRpb25zW2VuZC5saW5lXSArIGVuZC5jb2x1bW47XG4gICAgY29uc3QgdGV4dCA9IG9yaWdpbmFsU291cmNlRmlsZS5jb250ZW50cy5zdWJzdHJpbmcoc3RhcnRQb3MsIGVuZFBvcyk7XG4gICAgcmV0dXJuIHtmaWxlOiBvcmlnaW5hbFN0YXJ0LmZpbGUsIHN0YXJ0LCBlbmQsIHRleHR9O1xuICB9XG59XG4iXX0=