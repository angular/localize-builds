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
     * @publicApi used by CLI
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
            // For this to be parsable, the extension must be `.json` and the contents must include "locale"
            // and "translations" keys.
            if (path_1.extname(filePath) !== '.json' ||
                !(contents.includes('"locale"') && contents.includes('"translations"'))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQW9GO0lBQ3BGLDZCQUE2QjtJQUM3QiwyRUFBaUQ7SUFJakQ7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0g7UUFBQTtRQW9EQSxDQUFDO1FBbkRDOztXQUVHO1FBQ0gsOENBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7WUFDekMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsT0FBTyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEMsQ0FBQztRQUVELDZDQUFPLEdBQVAsVUFBUSxRQUFnQixFQUFFLFFBQWdCO1lBQ3hDLElBQU0sV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1lBQ3RDLGdHQUFnRztZQUNoRywyQkFBMkI7WUFDM0IsSUFBSSxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTztnQkFDN0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7Z0JBQzNFLFdBQVcsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQzthQUN2QztZQUNELElBQUk7Z0JBQ0YsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsV0FBVyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO29CQUN4RCxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDO2lCQUN2QztnQkFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7b0JBQ25DLFdBQVcsQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztvQkFDM0QsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO29CQUM5RCxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDO2lCQUN2QztnQkFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFlBQVksS0FBSyxRQUFRLEVBQUU7b0JBQ3pDLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztvQkFDekQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxhQUFBLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO2FBQ2xEO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsV0FBVyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQztRQUVELDJDQUFLLEdBQUwsVUFBTSxTQUFpQixFQUFFLFFBQWdCLEVBQUUsSUFBYTtZQUNoRCxJQUFBLEtBQXVDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUExRCxZQUFZLFlBQUEsRUFBRSxZQUFZLGtCQUFnQyxDQUFDO1lBQzFFLElBQU0sa0JBQWtCLEdBQTJDLEVBQUUsQ0FBQztZQUN0RSxLQUFLLElBQU0sU0FBUyxJQUFJLFlBQVksRUFBRTtnQkFDcEMsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyw0QkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNsRTtZQUNELE9BQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsSUFBSSx5QkFBVyxFQUFFLEVBQUMsQ0FBQztRQUNsRyxDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBcERELElBb0RDO0lBcERZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVwYXJzZVRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuXG5pbXBvcnQge1BhcnNlQW5hbHlzaXMsIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIHBhcnNlIEpTT04gdGhhdCBoYXMgdGhlIGZvcm06XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIFwibG9jYWxlXCI6IFwiLi4uXCIsXG4gKiAgIFwidHJhbnNsYXRpb25zXCI6IHtcbiAqICAgICBcIm1lc3NhZ2UtaWRcIjogXCJUYXJnZXQgbWVzc2FnZSBzdHJpbmdcIixcbiAqICAgICAuLi5cbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHNlZSBTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxPYmplY3Q+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogT2JqZWN0fGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxPYmplY3Q+IHtcbiAgICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICAgIC8vIEZvciB0aGlzIHRvIGJlIHBhcnNhYmxlLCB0aGUgZXh0ZW5zaW9uIG11c3QgYmUgYC5qc29uYCBhbmQgdGhlIGNvbnRlbnRzIG11c3QgaW5jbHVkZSBcImxvY2FsZVwiXG4gICAgLy8gYW5kIFwidHJhbnNsYXRpb25zXCIga2V5cy5cbiAgICBpZiAoZXh0bmFtZShmaWxlUGF0aCkgIT09ICcuanNvbicgfHxcbiAgICAgICAgIShjb250ZW50cy5pbmNsdWRlcygnXCJsb2NhbGVcIicpICYmIGNvbnRlbnRzLmluY2x1ZGVzKCdcInRyYW5zbGF0aW9uc1wiJykpKSB7XG4gICAgICBkaWFnbm9zdGljcy53YXJuKCdGaWxlIGRvZXMgbm90IGhhdmUgLmpzb24gZXh0ZW5zaW9uLicpO1xuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICAgIGlmIChqc29uLmxvY2FsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLndhcm4oJ1JlcXVpcmVkIFwibG9jYWxlXCIgcHJvcGVydHkgbWlzc2luZy4nKTtcbiAgICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YganNvbi5sb2NhbGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLndhcm4oJ1RoZSBcImxvY2FsZVwiIHByb3BlcnR5IGlzIG5vdCBhIHN0cmluZy4nKTtcbiAgICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICAgIH1cbiAgICAgIGlmIChqc29uLnRyYW5zbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLndhcm4oJ1JlcXVpcmVkIFwidHJhbnNsYXRpb25zXCIgcHJvcGVydHkgbWlzc2luZy4nKTtcbiAgICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YganNvbi50cmFuc2xhdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGRpYWdub3N0aWNzLndhcm4oJ1RoZSBcInRyYW5zbGF0aW9uc1wiIGlzIG5vdCBhbiBvYmplY3QuJyk7XG4gICAgICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gICAgICB9XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiB0cnVlLCBkaWFnbm9zdGljcywgaGludDoganNvbn07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGlhZ25vc3RpY3Mud2FybignRmlsZSBpcyBub3QgdmFsaWQgSlNPTi4nKTtcbiAgICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gICAgfVxuICB9XG5cbiAgcGFyc2UoX2ZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGpzb24/OiBPYmplY3QpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3Qge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnN9ID0ganNvbiB8fCBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICBjb25zdCBwYXJzZWRUcmFuc2xhdGlvbnM6IFJlY29yZDzJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2VJZCBpbiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSB0cmFuc2xhdGlvbnNbbWVzc2FnZUlkXTtcbiAgICAgIHBhcnNlZFRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdID0gybVwYXJzZVRyYW5zbGF0aW9uKHRhcmdldE1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4ge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHBhcnNlZFRyYW5zbGF0aW9ucywgZGlhZ25vc3RpY3M6IG5ldyBEaWFnbm9zdGljcygpfTtcbiAgfVxufVxuIl19