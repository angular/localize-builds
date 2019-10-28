(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json/simple_json_translation_parser", ["require", "exports", "@angular/localize", "path"], factory);
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
        SimpleJsonTranslationParser.prototype.canParse = function (filePath, _contents) { return (path_1.extname(filePath) === '.json'); };
        SimpleJsonTranslationParser.prototype.parse = function (_filePath, contents) {
            var _a = JSON.parse(contents), parsedLocale = _a.locale, translations = _a.translations;
            var parsedTranslations = {};
            for (var messageId in translations) {
                var targetMessage = translations[messageId];
                parsedTranslations[messageId] = localize_1.ɵparseTranslation(targetMessage);
            }
            return { locale: parsedLocale, translations: parsedTranslations };
        };
        return SimpleJsonTranslationParser;
    }());
    exports.SimpleJsonTranslationParser = SimpleJsonTranslationParser;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbi9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBb0Y7SUFDcEYsNkJBQTZCO0lBRzdCOzs7Ozs7Ozs7Ozs7T0FZRztJQUNIO1FBQUE7UUFZQSxDQUFDO1FBWEMsOENBQVEsR0FBUixVQUFTLFFBQWdCLEVBQUUsU0FBaUIsSUFBYSxPQUFPLENBQUMsY0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRywyQ0FBSyxHQUFMLFVBQU0sU0FBaUIsRUFBRSxRQUFnQjtZQUNqQyxJQUFBLHlCQUEyRCxFQUExRCx3QkFBb0IsRUFBRSw4QkFBb0MsQ0FBQztZQUNsRSxJQUFNLGtCQUFrQixHQUEyQyxFQUFFLENBQUM7WUFDdEUsS0FBSyxJQUFNLFNBQVMsSUFBSSxZQUFZLEVBQUU7Z0JBQ3BDLElBQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsNEJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbEU7WUFDRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQ0gsa0NBQUM7SUFBRCxDQUFDLEFBWkQsSUFZQztJQVpZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1cGFyc2VUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7UGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIHBhcnNlIEpTT04gdGhhdCBoYXMgdGhlIGZvcm06XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIFwibG9jYWxlXCI6IFwiLi4uXCIsXG4gKiAgIFwidHJhbnNsYXRpb25zXCI6IHtcbiAqICAgICBcIm1lc3NhZ2UtaWRcIjogXCJUYXJnZXQgbWVzc2FnZSBzdHJpbmdcIixcbiAqICAgICAuLi5cbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlciB7XG4gIGNhblBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIF9jb250ZW50czogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiAoZXh0bmFtZShmaWxlUGF0aCkgPT09ICcuanNvbicpOyB9XG5cbiAgcGFyc2UoX2ZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3Qge2xvY2FsZTogcGFyc2VkTG9jYWxlLCB0cmFuc2xhdGlvbnN9ID0gSlNPTi5wYXJzZShjb250ZW50cyk7XG4gICAgY29uc3QgcGFyc2VkVHJhbnNsYXRpb25zOiBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24+ID0ge307XG4gICAgZm9yIChjb25zdCBtZXNzYWdlSWQgaW4gdHJhbnNsYXRpb25zKSB7XG4gICAgICBjb25zdCB0YXJnZXRNZXNzYWdlID0gdHJhbnNsYXRpb25zW21lc3NhZ2VJZF07XG4gICAgICBwYXJzZWRUcmFuc2xhdGlvbnNbbWVzc2FnZUlkXSA9IMm1cGFyc2VUcmFuc2xhdGlvbih0YXJnZXRNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIHtsb2NhbGU6IHBhcnNlZExvY2FsZSwgdHJhbnNsYXRpb25zOiBwYXJzZWRUcmFuc2xhdGlvbnN9O1xuICB9XG59XG4iXX0=