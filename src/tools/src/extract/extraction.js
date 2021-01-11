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
     *
     * @publicApi used by CLI
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
                        es2015_extract_plugin_1.makeEs2015ExtractPlugin(this.fs, messages, this.localizeName),
                        es5_extract_plugin_1.makeEs5ExtractPlugin(this.fs, messages, this.localizeName),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9leHRyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFTQSx5RUFBd0Y7SUFFeEYsb0NBQTBDO0lBRTFDLG9IQUE2RTtJQUM3RSw4R0FBdUU7SUFRdkU7Ozs7O09BS0c7SUFDSDtRQU1FLDBCQUNZLEVBQXNCLEVBQVUsTUFBYyxFQUN0RCxFQUErRTtnQkFBOUUsUUFBUSxjQUFBLEVBQUUscUJBQW9CLEVBQXBCLGFBQWEsbUJBQUcsSUFBSSxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1lBRG5ELE9BQUUsR0FBRixFQUFFLENBQW9CO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUV4RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztZQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksNkJBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUVELDBDQUFlLEdBQWYsVUFDSSxRQUFnQjtZQUVsQixJQUFNLFFBQVEsR0FBcUIsRUFBRSxDQUFDO1lBQ3RDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlB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cEdELElBb0dDO0lBcEdZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgUmVhZG9ubHlGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2xvZ2dpbmcnO1xuaW1wb3J0IHtTb3VyY2VGaWxlLCBTb3VyY2VGaWxlTG9hZGVyfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL3NvdXJjZW1hcHMnO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7dHJhbnNmb3JtU3luY30gZnJvbSAnQGJhYmVsL2NvcmUnO1xuXG5pbXBvcnQge21ha2VFczIwMTVFeHRyYWN0UGx1Z2lufSBmcm9tICcuL3NvdXJjZV9maWxlcy9lczIwMTVfZXh0cmFjdF9wbHVnaW4nO1xuaW1wb3J0IHttYWtlRXM1RXh0cmFjdFBsdWdpbn0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvZXM1X2V4dHJhY3RfcGx1Z2luJztcblxuZXhwb3J0IGludGVyZmFjZSBFeHRyYWN0aW9uT3B0aW9ucyB7XG4gIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aDtcbiAgdXNlU291cmNlTWFwcz86IGJvb2xlYW47XG4gIGxvY2FsaXplTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBwYXJzZWQgbWVzc2FnZXMgZnJvbSBmaWxlIGNvbnRlbnRzLCBieSBwYXJzaW5nIHRoZSBjb250ZW50cyBhcyBKYXZhU2NyaXB0XG4gKiBhbmQgbG9va2luZyBmb3Igb2NjdXJyZW5jZXMgb2YgYCRsb2NhbGl6ZWAgaW4gdGhlIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGNsYXNzIE1lc3NhZ2VFeHRyYWN0b3Ige1xuICBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aDtcbiAgcHJpdmF0ZSB1c2VTb3VyY2VNYXBzOiBib29sZWFuO1xuICBwcml2YXRlIGxvY2FsaXplTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIGxvYWRlcjogU291cmNlRmlsZUxvYWRlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZnM6IFJlYWRvbmx5RmlsZVN5c3RlbSwgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAgIHtiYXNlUGF0aCwgdXNlU291cmNlTWFwcyA9IHRydWUsIGxvY2FsaXplTmFtZSA9ICckbG9jYWxpemUnfTogRXh0cmFjdGlvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmJhc2VQYXRoID0gYmFzZVBhdGg7XG4gICAgdGhpcy51c2VTb3VyY2VNYXBzID0gdXNlU291cmNlTWFwcztcbiAgICB0aGlzLmxvY2FsaXplTmFtZSA9IGxvY2FsaXplTmFtZTtcbiAgICB0aGlzLmxvYWRlciA9IG5ldyBTb3VyY2VGaWxlTG9hZGVyKHRoaXMuZnMsIHRoaXMubG9nZ2VyLCB7d2VicGFjazogYmFzZVBhdGh9KTtcbiAgfVxuXG4gIGV4dHJhY3RNZXNzYWdlcyhcbiAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICApOiDJtVBhcnNlZE1lc3NhZ2VbXSB7XG4gICAgY29uc3QgbWVzc2FnZXM6IMm1UGFyc2VkTWVzc2FnZVtdID0gW107XG4gICAgY29uc3Qgc291cmNlQ29kZSA9IHRoaXMuZnMucmVhZEZpbGUodGhpcy5mcy5yZXNvbHZlKHRoaXMuYmFzZVBhdGgsIGZpbGVuYW1lKSk7XG4gICAgaWYgKHNvdXJjZUNvZGUuaW5jbHVkZXModGhpcy5sb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAvLyBPbmx5IGJvdGhlciB0byBwYXJzZSB0aGUgZmlsZSBpZiBpdCBjb250YWlucyBhIHJlZmVyZW5jZSB0byBgJGxvY2FsaXplYC5cbiAgICAgIHRyYW5zZm9ybVN5bmMoc291cmNlQ29kZSwge1xuICAgICAgICBzb3VyY2VSb290OiB0aGlzLmJhc2VQYXRoLFxuICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIG1ha2VFczIwMTVFeHRyYWN0UGx1Z2luKHRoaXMuZnMsIG1lc3NhZ2VzLCB0aGlzLmxvY2FsaXplTmFtZSksXG4gICAgICAgICAgbWFrZUVzNUV4dHJhY3RQbHVnaW4odGhpcy5mcywgbWVzc2FnZXMsIHRoaXMubG9jYWxpemVOYW1lKSxcbiAgICAgICAgXSxcbiAgICAgICAgY29kZTogZmFsc2UsXG4gICAgICAgIGFzdDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VTb3VyY2VNYXBzKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNvdXJjZUxvY2F0aW9ucyhmaWxlbmFtZSwgc291cmNlQ29kZSwgbWVzc2FnZXMpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBsb2NhdGlvbiBvZiBlYWNoIG1lc3NhZ2UgdG8gcG9pbnQgdG8gdGhlIHNvdXJjZS1tYXBwZWQgb3JpZ2luYWwgc291cmNlIGxvY2F0aW9uLCBpZlxuICAgKiBhdmFpbGFibGUuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZVNvdXJjZUxvY2F0aW9ucyhmaWxlbmFtZTogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOlxuICAgICAgdm9pZCB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9XG4gICAgICAgIHRoaXMubG9hZGVyLmxvYWRTb3VyY2VGaWxlKHRoaXMuZnMucmVzb2x2ZSh0aGlzLmJhc2VQYXRoLCBmaWxlbmFtZSksIGNvbnRlbnRzKTtcbiAgICBpZiAoc291cmNlRmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgIGlmIChtZXNzYWdlLmxvY2F0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbWVzc2FnZS5sb2NhdGlvbiA9IHRoaXMuZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlLCBtZXNzYWdlLmxvY2F0aW9uKTtcblxuICAgICAgICBpZiAobWVzc2FnZS5tZXNzYWdlUGFydExvY2F0aW9ucykge1xuICAgICAgICAgIG1lc3NhZ2UubWVzc2FnZVBhcnRMb2NhdGlvbnMgPSBtZXNzYWdlLm1lc3NhZ2VQYXJ0TG9jYXRpb25zLm1hcChcbiAgICAgICAgICAgICAgbG9jYXRpb24gPT4gbG9jYXRpb24gJiYgdGhpcy5nZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGUsIGxvY2F0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnMpIHtcbiAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlck5hbWVzID0gT2JqZWN0LmtleXMobWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnMpO1xuICAgICAgICAgIGZvciAoY29uc3QgcGxhY2Vob2xkZXJOYW1lIG9mIHBsYWNlaG9sZGVyTmFtZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbWVzc2FnZS5zdWJzdGl0dXRpb25Mb2NhdGlvbnNbcGxhY2Vob2xkZXJOYW1lXTtcbiAgICAgICAgICAgIG1lc3NhZ2Uuc3Vic3RpdHV0aW9uTG9jYXRpb25zW3BsYWNlaG9sZGVyTmFtZV0gPVxuICAgICAgICAgICAgICAgIGxvY2F0aW9uICYmIHRoaXMuZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlLCBsb2NhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG9yaWdpbmFsIGxvY2F0aW9uIHVzaW5nIHNvdXJjZS1tYXBzIGlmIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHNvdXJjZUZpbGUgVGhlIGdlbmVyYXRlZCBgc291cmNlRmlsZWAgdGhhdCBjb250YWlucyB0aGUgYGxvY2F0aW9uYC5cbiAgICogQHBhcmFtIGxvY2F0aW9uIFRoZSBsb2NhdGlvbiB3aXRoaW4gdGhlIGdlbmVyYXRlZCBgc291cmNlRmlsZWAgdGhhdCBuZWVkcyBtYXBwaW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG5ldyBsb2NhdGlvbiB0aGF0IHJlZmVycyB0byB0aGUgb3JpZ2luYWwgc291cmNlIGxvY2F0aW9uIG1hcHBlZCBmcm9tIHRoZSBnaXZlblxuICAgKiAgICAgYGxvY2F0aW9uYCBpbiB0aGUgZ2VuZXJhdGVkIGBzb3VyY2VGaWxlYC5cbiAgICovXG4gIHByaXZhdGUgZ2V0T3JpZ2luYWxMb2NhdGlvbihzb3VyY2VGaWxlOiBTb3VyY2VGaWxlLCBsb2NhdGlvbjogybVTb3VyY2VMb2NhdGlvbik6IMm1U291cmNlTG9jYXRpb24ge1xuICAgIGNvbnN0IG9yaWdpbmFsU3RhcnQgPVxuICAgICAgICBzb3VyY2VGaWxlLmdldE9yaWdpbmFsTG9jYXRpb24obG9jYXRpb24uc3RhcnQubGluZSwgbG9jYXRpb24uc3RhcnQuY29sdW1uKTtcbiAgICBpZiAob3JpZ2luYWxTdGFydCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2F0aW9uO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbEVuZCA9IHNvdXJjZUZpbGUuZ2V0T3JpZ2luYWxMb2NhdGlvbihsb2NhdGlvbi5lbmQubGluZSwgbG9jYXRpb24uZW5kLmNvbHVtbik7XG4gICAgY29uc3Qgc3RhcnQgPSB7bGluZTogb3JpZ2luYWxTdGFydC5saW5lLCBjb2x1bW46IG9yaWdpbmFsU3RhcnQuY29sdW1ufTtcbiAgICAvLyBXZSBjaGVjayB3aGV0aGVyIHRoZSBmaWxlcyBhcmUgdGhlIHNhbWUsIHNpbmNlIHRoZSByZXR1cm5lZCBsb2NhdGlvbiBjYW4gb25seSBoYXZlIGEgc2luZ2xlXG4gICAgLy8gYGZpbGVgIGFuZCBpdCB3b3VsZCBub3QgbWFrZSBzZW5zZSB0byBzdG9yZSB0aGUgZW5kIHBvc2l0aW9uIGZyb20gYSBkaWZmZXJlbnQgc291cmNlIGZpbGUuXG4gICAgY29uc3QgZW5kID0gKG9yaWdpbmFsRW5kICE9PSBudWxsICYmIG9yaWdpbmFsRW5kLmZpbGUgPT09IG9yaWdpbmFsU3RhcnQuZmlsZSkgP1xuICAgICAgICB7bGluZTogb3JpZ2luYWxFbmQubGluZSwgY29sdW1uOiBvcmlnaW5hbEVuZC5jb2x1bW59IDpcbiAgICAgICAgc3RhcnQ7XG4gICAgY29uc3Qgb3JpZ2luYWxTb3VyY2VGaWxlID1cbiAgICAgICAgc291cmNlRmlsZS5zb3VyY2VzLmZpbmQoc2YgPT4gc2Y/LnNvdXJjZVBhdGggPT09IG9yaWdpbmFsU3RhcnQuZmlsZSkhO1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gb3JpZ2luYWxTb3VyY2VGaWxlLnN0YXJ0T2ZMaW5lUG9zaXRpb25zW3N0YXJ0LmxpbmVdICsgc3RhcnQuY29sdW1uO1xuICAgIGNvbnN0IGVuZFBvcyA9IG9yaWdpbmFsU291cmNlRmlsZS5zdGFydE9mTGluZVBvc2l0aW9uc1tlbmQubGluZV0gKyBlbmQuY29sdW1uO1xuICAgIGNvbnN0IHRleHQgPSBvcmlnaW5hbFNvdXJjZUZpbGUuY29udGVudHMuc3Vic3RyaW5nKHN0YXJ0UG9zLCBlbmRQb3MpO1xuICAgIHJldHVybiB7ZmlsZTogb3JpZ2luYWxTdGFydC5maWxlLCBzdGFydCwgZW5kLCB0ZXh0fTtcbiAgfVxufVxuIl19