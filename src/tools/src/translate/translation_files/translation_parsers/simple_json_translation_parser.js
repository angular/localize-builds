(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", ["require", "exports", "@angular/localize", "path", "@angular/localize/src/tools/src/diagnostics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var path_1 = require("path");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    /**
     * A translation parser that can parse JSON that has the form:
     *
     * ```
     * {
     *   "locale": "...",
     *   "translations": {
     *     "message-id": "Target message string",
     *     ...
     *   }
     * }
     * ```
     */
    var SimpleJsonTranslationParser = /** @class */ (function () {
        function SimpleJsonTranslationParser() {
        }
        SimpleJsonTranslationParser.prototype.canParse = function (filePath, _contents) {
            return (path_1.extname(filePath) === '.json');
        };
        SimpleJsonTranslationParser.prototype.parse = function (_filePath, contents) {
            var _a = JSON.parse(contents), parsedLocale = _a.locale, translations = _a.translations;
            var parsedTranslations = {};
            for (var messageId in translations) {
                var targetMessage = translations[messageId];
                parsedTranslations[messageId] = localize_1.ɵparseTranslation(targetMessage);
            }
            return { locale: parsedLocale, translations: parsedTranslations, diagnostics: new diagnostics_1.Diagnostics() };
        };
        return SimpleJsonTranslationParser;
    }());
    exports.SimpleJsonTranslationParser = SimpleJsonTranslationParser;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBb0Y7SUFDcEYsNkJBQTZCO0lBQzdCLDJFQUFpRDtJQUdqRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSDtRQUFBO1FBY0EsQ0FBQztRQWJDLDhDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFNBQWlCO1lBQzFDLE9BQU8sQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELDJDQUFLLEdBQUwsVUFBTSxTQUFpQixFQUFFLFFBQWdCO1lBQ2pDLElBQUEseUJBQTJELEVBQTFELHdCQUFvQixFQUFFLDhCQUFvQyxDQUFDO1lBQ2xFLElBQU0sa0JBQWtCLEdBQTJDLEVBQUUsQ0FBQztZQUN0RSxLQUFLLElBQU0sU0FBUyxJQUFJLFlBQVksRUFBRTtnQkFDcEMsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyw0QkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNsRTtZQUNELE9BQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsSUFBSSx5QkFBVyxFQUFFLEVBQUMsQ0FBQztRQUNsRyxDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBZEQsSUFjQztJQWRZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1cGFyc2VUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7UGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlcic7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gcGFyc2UgSlNPTiB0aGF0IGhhcyB0aGUgZm9ybTpcbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgXCJsb2NhbGVcIjogXCIuLi5cIixcbiAqICAgXCJ0cmFuc2xhdGlvbnNcIjoge1xuICogICAgIFwibWVzc2FnZS1pZFwiOiBcIlRhcmdldCBtZXNzYWdlIHN0cmluZ1wiLFxuICogICAgIC4uLlxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyIHtcbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgX2NvbnRlbnRzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKGV4dG5hbWUoZmlsZVBhdGgpID09PSAnLmpzb24nKTtcbiAgfVxuXG4gIHBhcnNlKF9maWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IHtsb2NhbGU6IHBhcnNlZExvY2FsZSwgdHJhbnNsYXRpb25zfSA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgIGNvbnN0IHBhcnNlZFRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiA9IHt9O1xuICAgIGZvciAoY29uc3QgbWVzc2FnZUlkIGluIHRyYW5zbGF0aW9ucykge1xuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdO1xuICAgICAgcGFyc2VkVHJhbnNsYXRpb25zW21lc3NhZ2VJZF0gPSDJtXBhcnNlVHJhbnNsYXRpb24odGFyZ2V0TWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9uczogcGFyc2VkVHJhbnNsYXRpb25zLCBkaWFnbm9zdGljczogbmV3IERpYWdub3N0aWNzKCl9O1xuICB9XG59XG4iXX0=