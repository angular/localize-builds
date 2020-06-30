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
        SimpleJsonTranslationParser.prototype.canParse = function (filePath, contents) {
            if (path_1.extname(filePath) !== '.json') {
                return false;
            }
            try {
                var json = JSON.parse(contents);
                return (typeof json.locale === 'string' && typeof json.translations === 'object') && json;
            }
            catch (_a) {
                return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQW9GO0lBQ3BGLDZCQUE2QjtJQUM3QiwyRUFBaUQ7SUFHakQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSDtRQUFBO1FBc0JBLENBQUM7UUFyQkMsOENBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsUUFBZ0I7WUFDekMsSUFBSSxjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxFQUFFO2dCQUNqQyxPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsSUFBSTtnQkFDRixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO2FBQzNGO1lBQUMsV0FBTTtnQkFDTixPQUFPLEtBQUssQ0FBQzthQUNkO1FBQ0gsQ0FBQztRQUVELDJDQUFLLEdBQUwsVUFBTSxTQUFpQixFQUFFLFFBQWdCLEVBQUUsSUFBYTtZQUNoRCxJQUFBLEtBQXVDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUExRCxZQUFZLFlBQUEsRUFBRSxZQUFZLGtCQUFnQyxDQUFDO1lBQzFFLElBQU0sa0JBQWtCLEdBQTJDLEVBQUUsQ0FBQztZQUN0RSxLQUFLLElBQU0sU0FBUyxJQUFJLFlBQVksRUFBRTtnQkFDcEMsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5QyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyw0QkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNsRTtZQUNELE9BQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsSUFBSSx5QkFBVyxFQUFFLEVBQUMsQ0FBQztRQUNsRyxDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBdEJELElBc0JDO0lBdEJZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbiwgybVwYXJzZVRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBwYXJzZSBKU09OIHRoYXQgaGFzIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICoge1xuICogICBcImxvY2FsZVwiOiBcIi4uLlwiLFxuICogICBcInRyYW5zbGF0aW9uc1wiOiB7XG4gKiAgICAgXCJtZXNzYWdlLWlkXCI6IFwiVGFyZ2V0IG1lc3NhZ2Ugc3RyaW5nXCIsXG4gKiAgICAgLi4uXG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBzZWUgU2ltcGxlSnNvblRyYW5zbGF0aW9uU2VyaWFsaXplclxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXI8T2JqZWN0PiB7XG4gIGNhblBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBPYmplY3R8ZmFsc2Uge1xuICAgIGlmIChleHRuYW1lKGZpbGVQYXRoKSAhPT0gJy5qc29uJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgICAgcmV0dXJuICh0eXBlb2YganNvbi5sb2NhbGUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBqc29uLnRyYW5zbGF0aW9ucyA9PT0gJ29iamVjdCcpICYmIGpzb247XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFyc2UoX2ZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGpzb24/OiBPYmplY3QpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3Qge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnN9ID0ganNvbiB8fCBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICBjb25zdCBwYXJzZWRUcmFuc2xhdGlvbnM6IFJlY29yZDzJtU1lc3NhZ2VJZCwgybVQYXJzZWRUcmFuc2xhdGlvbj4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2VJZCBpbiB0cmFuc2xhdGlvbnMpIHtcbiAgICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSB0cmFuc2xhdGlvbnNbbWVzc2FnZUlkXTtcbiAgICAgIHBhcnNlZFRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdID0gybVwYXJzZVRyYW5zbGF0aW9uKHRhcmdldE1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4ge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHBhcnNlZFRyYW5zbGF0aW9ucywgZGlhZ25vc3RpY3M6IG5ldyBEaWFnbm9zdGljcygpfTtcbiAgfVxufVxuIl19