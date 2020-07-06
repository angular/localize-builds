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
    exports.SimpleJsonTranslationParser = void 0;
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
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
     *
     * @see SimpleJsonTranslationSerializer
     */
    var SimpleJsonTranslationParser = /** @class */ (function () {
        function SimpleJsonTranslationParser() {
        }
        /**
         * @deprecated
         */
        SimpleJsonTranslationParser.prototype.canParse = function (filePath, contents) {
            var result = this.analyze(filePath, contents);
            return result.canParse && result.hint;
        };
        SimpleJsonTranslationParser.prototype.analyze = function (filePath, contents) {
            var diagnostics = new diagnostics_1.Diagnostics();
            if (path_1.extname(filePath) !== '.json') {
                diagnostics.warn('File does not have .json extension.');
                return { canParse: false, diagnostics: diagnostics };
            }
            try {
                var json = JSON.parse(contents);
                if (json.locale === undefined) {
                    diagnostics.warn('Required "locale" property missing.');
                    return { canParse: false, diagnostics: diagnostics };
                }
                if (typeof json.locale !== 'string') {
                    diagnostics.warn('The "locale" property is not a string.');
                    return { canParse: false, diagnostics: diagnostics };
                }
                if (json.translations === undefined) {
                    diagnostics.warn('Required "translations" property missing.');
                    return { canParse: false, diagnostics: diagnostics };
                }
                if (typeof json.translations !== 'object') {
                    diagnostics.warn('The "translations" is not an object.');
                    return { canParse: false, diagnostics: diagnostics };
                }
                return { canParse: true, diagnostics: diagnostics, hint: json };
            }
            catch (e) {
                diagnostics.warn('File is not valid JSON.');
                return { canParse: false, diagnostics: diagnostics };
            }
        };
        SimpleJsonTranslationParser.prototype.parse = function (_filePath, contents, json) {
            var _a = json || JSON.parse(contents), parsedLocale = _a.locale, translations = _a.translations;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQW9GO0lBQ3BGLDZCQUE2QjtJQUM3QiwyRUFBaUQ7SUFJakQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSDtRQUFBO1FBaURBLENBQUM7UUFoREM7O1dBRUc7UUFDSCw4Q0FBUSxHQUFSLFVBQVMsUUFBZ0IsRUFBRSxRQUFnQjtZQUN6QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QyxDQUFDO1FBRUQsNkNBQU8sR0FBUCxVQUFRLFFBQWdCLEVBQUUsUUFBZ0I7WUFDeEMsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7WUFDdEMsSUFBSSxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxFQUFFO2dCQUNqQyxXQUFXLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsYUFBQSxFQUFDLENBQUM7YUFDdkM7WUFDRCxJQUFJO2dCQUNGLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7b0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztvQkFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO29CQUNuQyxXQUFXLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7b0JBQzNELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsYUFBQSxFQUFDLENBQUM7aUJBQ3ZDO2dCQUNELElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7b0JBQ25DLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssUUFBUSxFQUFFO29CQUN6QyxXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQ3pELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsYUFBQSxFQUFDLENBQUM7aUJBQ3ZDO2dCQUNELE9BQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsYUFBQSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQzthQUNsRDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLFdBQVcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQzthQUN2QztRQUNILENBQUM7UUFFRCwyQ0FBSyxHQUFMLFVBQU0sU0FBaUIsRUFBRSxRQUFnQixFQUFFLElBQWE7WUFDaEQsSUFBQSxLQUF1QyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBMUQsWUFBWSxZQUFBLEVBQUUsWUFBWSxrQkFBZ0MsQ0FBQztZQUMxRSxJQUFNLGtCQUFrQixHQUEyQyxFQUFFLENBQUM7WUFDdEUsS0FBSyxJQUFNLFNBQVMsSUFBSSxZQUFZLEVBQUU7Z0JBQ3BDLElBQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsNEJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbEU7WUFDRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLElBQUkseUJBQVcsRUFBRSxFQUFDLENBQUM7UUFDbEcsQ0FBQztRQUNILGtDQUFDO0lBQUQsQ0FBQyxBQWpERCxJQWlEQztJQWpEWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1cGFyc2VUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtQYXJzZUFuYWx5c2lzLCBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBwYXJzZSBKU09OIHRoYXQgaGFzIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICoge1xuICogICBcImxvY2FsZVwiOiBcIi4uLlwiLFxuICogICBcInRyYW5zbGF0aW9uc1wiOiB7XG4gKiAgICAgXCJtZXNzYWdlLWlkXCI6IFwiVGFyZ2V0IG1lc3NhZ2Ugc3RyaW5nXCIsXG4gKiAgICAgLi4uXG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBzZWUgU2ltcGxlSnNvblRyYW5zbGF0aW9uU2VyaWFsaXplclxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXI8T2JqZWN0PiB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IE9iamVjdHxmYWxzZSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hbmFseXplKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgcmV0dXJuIHJlc3VsdC5jYW5QYXJzZSAmJiByZXN1bHQuaGludDtcbiAgfVxuXG4gIGFuYWx5emUoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFBhcnNlQW5hbHlzaXM8T2JqZWN0PiB7XG4gICAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgICBpZiAoZXh0bmFtZShmaWxlUGF0aCkgIT09ICcuanNvbicpIHtcbiAgICAgIGRpYWdub3N0aWNzLndhcm4oJ0ZpbGUgZG9lcyBub3QgaGF2ZSAuanNvbiBleHRlbnNpb24uJyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgICAgaWYgKGpzb24ubG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignUmVxdWlyZWQgXCJsb2NhbGVcIiBwcm9wZXJ0eSBtaXNzaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBqc29uLmxvY2FsZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignVGhlIFwibG9jYWxlXCIgcHJvcGVydHkgaXMgbm90IGEgc3RyaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKGpzb24udHJhbnNsYXRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignUmVxdWlyZWQgXCJ0cmFuc2xhdGlvbnNcIiBwcm9wZXJ0eSBtaXNzaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBqc29uLnRyYW5zbGF0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignVGhlIFwidHJhbnNsYXRpb25zXCIgaXMgbm90IGFuIG9iamVjdC4nKTtcbiAgICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7Y2FuUGFyc2U6IHRydWUsIGRpYWdub3N0aWNzLCBoaW50OiBqc29ufTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkaWFnbm9zdGljcy53YXJuKCdGaWxlIGlzIG5vdCB2YWxpZCBKU09OLicpO1xuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gIH1cblxuICBwYXJzZShfZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZywganNvbj86IE9iamVjdCk6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9uc30gPSBqc29uIHx8IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgIGNvbnN0IHBhcnNlZFRyYW5zbGF0aW9uczogUmVjb3JkPMm1TWVzc2FnZUlkLCDJtVBhcnNlZFRyYW5zbGF0aW9uPiA9IHt9O1xuICAgIGZvciAoY29uc3QgbWVzc2FnZUlkIGluIHRyYW5zbGF0aW9ucykge1xuICAgICAgY29uc3QgdGFyZ2V0TWVzc2FnZSA9IHRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdO1xuICAgICAgcGFyc2VkVHJhbnNsYXRpb25zW21lc3NhZ2VJZF0gPSDJtXBhcnNlVHJhbnNsYXRpb24odGFyZ2V0TWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiB7bG9jYWxlOiBwYXJzZWRMb2NhbGUsIHRyYW5zbGF0aW9uczogcGFyc2VkVHJhbnNsYXRpb25zLCBkaWFnbm9zdGljczogbmV3IERpYWdub3N0aWNzKCl9O1xuICB9XG59XG4iXX0=