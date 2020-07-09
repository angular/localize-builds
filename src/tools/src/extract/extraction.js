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
            var e_1, _a;
            var sourceFile = this.loader.loadSourceFile(this.fs.resolve(this.basePath, filename), contents);
            if (sourceFile === null) {
                return;
            }
            try {
                for (var messages_1 = tslib_1.__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                    var message = messages_1_1.value;
                    if (message.location !== undefined) {
                        message.location = this.getOriginalLocation(sourceFile, message.location);
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
            return { file: originalStart.file, start: start, end: end };
        };
        return MessageExtractor;
    }());
    exports.MessageExtractor = MessageExtractor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvZXh0cmFjdC9leHRyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFTQSx5RUFBd0Y7SUFFeEYsb0NBQTBDO0lBRTFDLG9IQUE2RTtJQUM3RSw4R0FBdUU7SUFRdkU7OztPQUdHO0lBQ0g7UUFNRSwwQkFDWSxFQUFjLEVBQVUsTUFBYyxFQUM5QyxFQUErRTtnQkFBOUUsUUFBUSxjQUFBLEVBQUUscUJBQW9CLEVBQXBCLGFBQWEsbUJBQUcsSUFBSSxLQUFBLEVBQUUsb0JBQTBCLEVBQTFCLFlBQVksbUJBQUcsV0FBVyxLQUFBO1lBRG5ELE9BQUUsR0FBRixFQUFFLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBRWhELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1lBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBRUQsMENBQWUsR0FBZixVQUNJLFFBQWdCO1lBRWxCLElBQU0sUUFBUSxHQUFxQixFQUFFLENBQUM7WUFDdEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlFLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzFDLDJFQUEyRTtnQkFDM0Usb0JBQWEsQ0FBQyxVQUFVLEVBQUU7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDekIsUUFBUSxVQUFBO29CQUNSLE9BQU8sRUFBRTt3QkFDUCwrQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQzt3QkFDcEQseUNBQW9CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7cUJBQ2xEO29CQUNELElBQUksRUFBRSxLQUFLO29CQUNYLEdBQUcsRUFBRSxLQUFLO2lCQUNYLENBQUMsQ0FBQzthQUNKO1lBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN0QixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1RDtZQUNELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxnREFBcUIsR0FBN0IsVUFBOEIsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLFFBQTBCOztZQUUxRixJQUFNLFVBQVUsR0FDWixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ25GLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtnQkFDdkIsT0FBTzthQUNSOztnQkFDRCxLQUFzQixJQUFBLGFBQUEsaUJBQUEsUUFBUSxDQUFBLGtDQUFBLHdEQUFFO29CQUEzQixJQUFNLE9BQU8scUJBQUE7b0JBQ2hCLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQ2xDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQzNFO2lCQUNGOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBRUQ7Ozs7Ozs7O1dBUUc7UUFDSyw4Q0FBbUIsR0FBM0IsVUFBNEIsVUFBc0IsRUFBRSxRQUF5QjtZQUMzRSxJQUFNLGFBQWEsR0FDZixVQUFVLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvRSxJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7Z0JBQzFCLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1lBQ0QsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0YsSUFBTSxLQUFLLEdBQUcsRUFBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBQyxDQUFDO1lBQ3ZFLDhGQUE4RjtZQUM5Riw2RkFBNkY7WUFDN0YsSUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLEVBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO2dCQUN0RCxLQUFLLENBQUM7WUFDVixPQUFPLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxPQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0gsdUJBQUM7SUFBRCxDQUFDLEFBakZELElBaUZDO0lBakZZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aCwgRmlsZVN5c3RlbSwgUGF0aFNlZ21lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvbG9nZ2luZyc7XG5pbXBvcnQge1NvdXJjZUZpbGUsIFNvdXJjZUZpbGVMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc291cmNlbWFwcyc7XG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHt0cmFuc2Zvcm1TeW5jfSBmcm9tICdAYmFiZWwvY29yZSc7XG5cbmltcG9ydCB7bWFrZUVzMjAxNUV4dHJhY3RQbHVnaW59IGZyb20gJy4vc291cmNlX2ZpbGVzL2VzMjAxNV9leHRyYWN0X3BsdWdpbic7XG5pbXBvcnQge21ha2VFczVFeHRyYWN0UGx1Z2lufSBmcm9tICcuL3NvdXJjZV9maWxlcy9lczVfZXh0cmFjdF9wbHVnaW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4dHJhY3Rpb25PcHRpb25zIHtcbiAgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoO1xuICB1c2VTb3VyY2VNYXBzPzogYm9vbGVhbjtcbiAgbG9jYWxpemVOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHBhcnNlZCBtZXNzYWdlcyBmcm9tIGZpbGUgY29udGVudHMsIGJ5IHBhcnNpbmcgdGhlIGNvbnRlbnRzIGFzIEphdmFTY3JpcHRcbiAqIGFuZCBsb29raW5nIGZvciBvY2N1cnJlbmNlcyBvZiBgJGxvY2FsaXplYCBpbiB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlRXh0cmFjdG9yIHtcbiAgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGg7XG4gIHByaXZhdGUgdXNlU291cmNlTWFwczogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsb2NhbGl6ZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBsb2FkZXI6IFNvdXJjZUZpbGVMb2FkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGZzOiBGaWxlU3lzdGVtLCBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLFxuICAgICAge2Jhc2VQYXRoLCB1c2VTb3VyY2VNYXBzID0gdHJ1ZSwgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBFeHRyYWN0aW9uT3B0aW9ucykge1xuICAgIHRoaXMuYmFzZVBhdGggPSBiYXNlUGF0aDtcbiAgICB0aGlzLnVzZVNvdXJjZU1hcHMgPSB1c2VTb3VyY2VNYXBzO1xuICAgIHRoaXMubG9jYWxpemVOYW1lID0gbG9jYWxpemVOYW1lO1xuICAgIHRoaXMubG9hZGVyID0gbmV3IFNvdXJjZUZpbGVMb2FkZXIodGhpcy5mcywgdGhpcy5sb2dnZXIsIHt3ZWJwYWNrOiBiYXNlUGF0aH0pO1xuICB9XG5cbiAgZXh0cmFjdE1lc3NhZ2VzKFxuICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICAgICk6IMm1UGFyc2VkTWVzc2FnZVtdIHtcbiAgICBjb25zdCBtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10gPSBbXTtcbiAgICBjb25zdCBzb3VyY2VDb2RlID0gdGhpcy5mcy5yZWFkRmlsZSh0aGlzLmZzLnJlc29sdmUodGhpcy5iYXNlUGF0aCwgZmlsZW5hbWUpKTtcbiAgICBpZiAoc291cmNlQ29kZS5pbmNsdWRlcyh0aGlzLmxvY2FsaXplTmFtZSkpIHtcbiAgICAgIC8vIE9ubHkgYm90aGVyIHRvIHBhcnNlIHRoZSBmaWxlIGlmIGl0IGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGAkbG9jYWxpemVgLlxuICAgICAgdHJhbnNmb3JtU3luYyhzb3VyY2VDb2RlLCB7XG4gICAgICAgIHNvdXJjZVJvb3Q6IHRoaXMuYmFzZVBhdGgsXG4gICAgICAgIGZpbGVuYW1lLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgbWFrZUVzMjAxNUV4dHJhY3RQbHVnaW4obWVzc2FnZXMsIHRoaXMubG9jYWxpemVOYW1lKSxcbiAgICAgICAgICBtYWtlRXM1RXh0cmFjdFBsdWdpbihtZXNzYWdlcywgdGhpcy5sb2NhbGl6ZU5hbWUpLFxuICAgICAgICBdLFxuICAgICAgICBjb2RlOiBmYWxzZSxcbiAgICAgICAgYXN0OiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZVNvdXJjZU1hcHMpIHtcbiAgICAgIHRoaXMudXBkYXRlU291cmNlTG9jYXRpb25zKGZpbGVuYW1lLCBzb3VyY2VDb2RlLCBtZXNzYWdlcyk7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxvY2F0aW9uIG9mIGVhY2ggbWVzc2FnZSB0byBwb2ludCB0byB0aGUgc291cmNlLW1hcHBlZCBvcmlnaW5hbCBzb3VyY2UgbG9jYXRpb24sIGlmXG4gICAqIGF2YWlsYWJsZS5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlU291cmNlTG9jYXRpb25zKGZpbGVuYW1lOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6XG4gICAgICB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID1cbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZFNvdXJjZUZpbGUodGhpcy5mcy5yZXNvbHZlKHRoaXMuYmFzZVBhdGgsIGZpbGVuYW1lKSwgY29udGVudHMpO1xuICAgIGlmIChzb3VyY2VGaWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgaWYgKG1lc3NhZ2UubG9jYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtZXNzYWdlLmxvY2F0aW9uID0gdGhpcy5nZXRPcmlnaW5hbExvY2F0aW9uKHNvdXJjZUZpbGUsIG1lc3NhZ2UubG9jYXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiB1c2luZyBzb3VyY2UtbWFwcyBpZiBhdmFpbGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2VGaWxlIFRoZSBnZW5lcmF0ZWQgYHNvdXJjZUZpbGVgIHRoYXQgY29udGFpbnMgdGhlIGBsb2NhdGlvbmAuXG4gICAqIEBwYXJhbSBsb2NhdGlvbiBUaGUgbG9jYXRpb24gd2l0aGluIHRoZSBnZW5lcmF0ZWQgYHNvdXJjZUZpbGVgIHRoYXQgbmVlZHMgbWFwcGluZy5cbiAgICpcbiAgICogQHJldHVybnMgQSBuZXcgbG9jYXRpb24gdGhhdCByZWZlcnMgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBsb2NhdGlvbiBtYXBwZWQgZnJvbSB0aGUgZ2l2ZW5cbiAgICogICAgIGBsb2NhdGlvbmAgaW4gdGhlIGdlbmVyYXRlZCBgc291cmNlRmlsZWAuXG4gICAqL1xuICBwcml2YXRlIGdldE9yaWdpbmFsTG9jYXRpb24oc291cmNlRmlsZTogU291cmNlRmlsZSwgbG9jYXRpb246IMm1U291cmNlTG9jYXRpb24pOiDJtVNvdXJjZUxvY2F0aW9uIHtcbiAgICBjb25zdCBvcmlnaW5hbFN0YXJ0ID1cbiAgICAgICAgc291cmNlRmlsZS5nZXRPcmlnaW5hbExvY2F0aW9uKGxvY2F0aW9uLnN0YXJ0LmxpbmUsIGxvY2F0aW9uLnN0YXJ0LmNvbHVtbik7XG4gICAgaWYgKG9yaWdpbmFsU3RhcnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9XG4gICAgY29uc3Qgb3JpZ2luYWxFbmQgPSBzb3VyY2VGaWxlLmdldE9yaWdpbmFsTG9jYXRpb24obG9jYXRpb24uZW5kLmxpbmUsIGxvY2F0aW9uLmVuZC5jb2x1bW4pO1xuICAgIGNvbnN0IHN0YXJ0ID0ge2xpbmU6IG9yaWdpbmFsU3RhcnQubGluZSwgY29sdW1uOiBvcmlnaW5hbFN0YXJ0LmNvbHVtbn07XG4gICAgLy8gV2UgY2hlY2sgd2hldGhlciB0aGUgZmlsZXMgYXJlIHRoZSBzYW1lLCBzaW5jZSB0aGUgcmV0dXJuZWQgbG9jYXRpb24gY2FuIG9ubHkgaGF2ZSBhIHNpbmdsZVxuICAgIC8vIGBmaWxlYCBhbmQgaXQgd291bGQgbm90IG1ha2Ugc2Vuc2UgdG8gc3RvcmUgdGhlIGVuZCBwb3NpdGlvbiBmcm9tIGEgZGlmZmVyZW50IHNvdXJjZSBmaWxlLlxuICAgIGNvbnN0IGVuZCA9IChvcmlnaW5hbEVuZCAhPT0gbnVsbCAmJiBvcmlnaW5hbEVuZC5maWxlID09PSBvcmlnaW5hbFN0YXJ0LmZpbGUpID9cbiAgICAgICAge2xpbmU6IG9yaWdpbmFsRW5kLmxpbmUsIGNvbHVtbjogb3JpZ2luYWxFbmQuY29sdW1ufSA6XG4gICAgICAgIHN0YXJ0O1xuICAgIHJldHVybiB7ZmlsZTogb3JpZ2luYWxTdGFydC5maWxlLCBzdGFydCwgZW5kfTtcbiAgfVxufVxuIl19