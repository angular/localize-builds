(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/arb_translation_parser", ["require", "exports", "tslib", "@angular/localize", "@angular/localize/src/tools/src/diagnostics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArbTranslationParser = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    /**
     * A translation parser that can parse JSON formatted as an Application Resource Bundle (ARB).
     *
     * See https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification
     *
     * ```
     * {
     *   "@@locale": "en-US",
     *   "message-id": "Target message string",
     *   "@message-id": {
     *     "type": "text",
     *     "description": "Some description text",
     *     "x-locations": [
     *       {
     *         "start": {"line": 23, "column": 145},
     *         "end": {"line": 24, "column": 53},
     *         "file": "some/file.ts"
     *       },
     *       ...
     *     ]
     *   },
     *   ...
     * }
     * ```
     */
    var ArbTranslationParser = /** @class */ (function () {
        function ArbTranslationParser() {
        }
        /**
         * @deprecated
         */
        ArbTranslationParser.prototype.canParse = function (filePath, contents) {
            var result = this.analyze(filePath, contents);
            return result.canParse && result.hint;
        };
        ArbTranslationParser.prototype.analyze = function (_filePath, contents) {
            var diagnostics = new diagnostics_1.Diagnostics();
            if (!contents.includes('"@@locale"')) {
                return { canParse: false, diagnostics: diagnostics };
            }
            try {
                // We can parse this file if it is valid JSON and contains the `"@@locale"` property.
                return { canParse: true, diagnostics: diagnostics, hint: this.tryParseArbFormat(contents) };
            }
            catch (_a) {
                diagnostics.warn('File is not valid JSON.');
                return { canParse: false, diagnostics: diagnostics };
            }
        };
        ArbTranslationParser.prototype.parse = function (_filePath, contents, arb) {
            var e_1, _a;
            if (arb === void 0) { arb = this.tryParseArbFormat(contents); }
            var bundle = {
                locale: arb['@@locale'],
                translations: {},
                diagnostics: new diagnostics_1.Diagnostics()
            };
            try {
                for (var _b = tslib_1.__values(Object.keys(arb)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var messageId = _c.value;
                    if (messageId.startsWith('@')) {
                        // Skip metadata keys
                        continue;
                    }
                    var targetMessage = arb[messageId];
                    bundle.translations[messageId] = localize_1.ɵparseTranslation(targetMessage);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return bundle;
        };
        ArbTranslationParser.prototype.tryParseArbFormat = function (contents) {
            var json = JSON.parse(contents);
            if (typeof json['@@locale'] !== 'string') {
                throw new Error('Missing @@locale property.');
            }
            return json;
        };
        return ArbTranslationParser;
    }());
    exports.ArbTranslationParser = ArbTranslationParser;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvYXJiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQWlHO0lBQ2pHLDJFQUFpRDtJQW1CakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNIO1FBQUE7UUFpREEsQ0FBQztRQWhEQzs7V0FFRztRQUNILHVDQUFRLEdBQVIsVUFBUyxRQUFnQixFQUFFLFFBQWdCO1lBQ3pDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxzQ0FBTyxHQUFQLFVBQVEsU0FBaUIsRUFBRSxRQUFnQjtZQUN6QyxJQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDcEMsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQzthQUN2QztZQUNELElBQUk7Z0JBQ0YscUZBQXFGO2dCQUNyRixPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLGFBQUEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUM7YUFDOUU7WUFBQyxXQUFNO2dCQUNOLFdBQVcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxhQUFBLEVBQUMsQ0FBQzthQUN2QztRQUNILENBQUM7UUFFRCxvQ0FBSyxHQUFMLFVBQU0sU0FBaUIsRUFBRSxRQUFnQixFQUFFLEdBQXFEOztZQUFyRCxvQkFBQSxFQUFBLE1BQXFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7WUFFOUYsSUFBTSxNQUFNLEdBQTRCO2dCQUN0QyxNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDdkIsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJLHlCQUFXLEVBQUU7YUFDL0IsQ0FBQzs7Z0JBRUYsS0FBd0IsSUFBQSxLQUFBLGlCQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXJDLElBQU0sU0FBUyxXQUFBO29CQUNsQixJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQzdCLHFCQUFxQjt3QkFDckIsU0FBUztxQkFDVjtvQkFDRCxJQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFXLENBQUM7b0JBQy9DLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsNEJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ25FOzs7Ozs7Ozs7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRU8sZ0RBQWlCLEdBQXpCLFVBQTBCLFFBQWdCO1lBQ3hDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQzthQUMvQztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNILDJCQUFDO0lBQUQsQ0FBQyxBQWpERCxJQWlEQztJQWpEWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1cGFyc2VUcmFuc2xhdGlvbiwgybVTb3VyY2VMb2NhdGlvbiwgybVTb3VyY2VNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1BhcnNlQW5hbHlzaXMsIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFyYkpzb25PYmplY3QgZXh0ZW5kcyBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1U291cmNlTWVzc2FnZXxBcmJNZXRhZGF0YT4ge1xuICAnQEBsb2NhbGUnOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJiTWV0YWRhdGEge1xuICB0eXBlPzogJ3RleHQnfCdpbWFnZSd8J2Nzcyc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBbJ3gtbG9jYXRpb25zJ10/OiBBcmJMb2NhdGlvbltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFyYkxvY2F0aW9uIHtcbiAgc3RhcnQ6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfTtcbiAgZW5kOiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn07XG4gIGZpbGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBwYXJzZSBKU09OIGZvcm1hdHRlZCBhcyBhbiBBcHBsaWNhdGlvbiBSZXNvdXJjZSBCdW5kbGUgKEFSQikuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvYXBwLXJlc291cmNlLWJ1bmRsZS93aWtpL0FwcGxpY2F0aW9uUmVzb3VyY2VCdW5kbGVTcGVjaWZpY2F0aW9uXG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIFwiQEBsb2NhbGVcIjogXCJlbi1VU1wiLFxuICogICBcIm1lc3NhZ2UtaWRcIjogXCJUYXJnZXQgbWVzc2FnZSBzdHJpbmdcIixcbiAqICAgXCJAbWVzc2FnZS1pZFwiOiB7XG4gKiAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICogICAgIFwiZGVzY3JpcHRpb25cIjogXCJTb21lIGRlc2NyaXB0aW9uIHRleHRcIixcbiAqICAgICBcIngtbG9jYXRpb25zXCI6IFtcbiAqICAgICAgIHtcbiAqICAgICAgICAgXCJzdGFydFwiOiB7XCJsaW5lXCI6IDIzLCBcImNvbHVtblwiOiAxNDV9LFxuICogICAgICAgICBcImVuZFwiOiB7XCJsaW5lXCI6IDI0LCBcImNvbHVtblwiOiA1M30sXG4gKiAgICAgICAgIFwiZmlsZVwiOiBcInNvbWUvZmlsZS50c1wiXG4gKiAgICAgICB9LFxuICogICAgICAgLi4uXG4gKiAgICAgXVxuICogICB9LFxuICogICAuLi5cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQXJiVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxBcmJKc29uT2JqZWN0PiB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IEFyYkpzb25PYmplY3R8ZmFsc2Uge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYW5hbHl6ZShmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIHJldHVybiByZXN1bHQuY2FuUGFyc2UgJiYgcmVzdWx0LmhpbnQ7XG4gIH1cblxuICBhbmFseXplKF9maWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxBcmJKc29uT2JqZWN0PiB7XG4gICAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgICBpZiAoIWNvbnRlbnRzLmluY2x1ZGVzKCdcIkBAbG9jYWxlXCInKSkge1xuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIFdlIGNhbiBwYXJzZSB0aGlzIGZpbGUgaWYgaXQgaXMgdmFsaWQgSlNPTiBhbmQgY29udGFpbnMgdGhlIGBcIkBAbG9jYWxlXCJgIHByb3BlcnR5LlxuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogdHJ1ZSwgZGlhZ25vc3RpY3MsIGhpbnQ6IHRoaXMudHJ5UGFyc2VBcmJGb3JtYXQoY29udGVudHMpfTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGRpYWdub3N0aWNzLndhcm4oJ0ZpbGUgaXMgbm90IHZhbGlkIEpTT04uJyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlKF9maWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBhcmI6IEFyYkpzb25PYmplY3QgPSB0aGlzLnRyeVBhcnNlQXJiRm9ybWF0KGNvbnRlbnRzKSk6XG4gICAgICBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSA9IHtcbiAgICAgIGxvY2FsZTogYXJiWydAQGxvY2FsZSddLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIGRpYWdub3N0aWNzOiBuZXcgRGlhZ25vc3RpY3MoKVxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2VJZCBvZiBPYmplY3Qua2V5cyhhcmIpKSB7XG4gICAgICBpZiAobWVzc2FnZUlkLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICAvLyBTa2lwIG1ldGFkYXRhIGtleXNcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCB0YXJnZXRNZXNzYWdlID0gYXJiW21lc3NhZ2VJZF0gYXMgc3RyaW5nO1xuICAgICAgYnVuZGxlLnRyYW5zbGF0aW9uc1ttZXNzYWdlSWRdID0gybVwYXJzZVRyYW5zbGF0aW9uKHRhcmdldE1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gYnVuZGxlO1xuICB9XG5cbiAgcHJpdmF0ZSB0cnlQYXJzZUFyYkZvcm1hdChjb250ZW50czogc3RyaW5nKTogQXJiSnNvbk9iamVjdCB7XG4gICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgIGlmICh0eXBlb2YganNvblsnQEBsb2NhbGUnXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBAQGxvY2FsZSBwcm9wZXJ0eS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb247XG4gIH1cbn1cbiJdfQ==