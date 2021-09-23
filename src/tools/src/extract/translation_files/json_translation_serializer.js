(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/json_translation_serializer", ["require", "exports", "tslib", "@angular/localize/src/tools/src/extract/translation_files/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleJsonTranslationSerializer = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
    /**
     * This is a semi-public bespoke serialization format that is used for testing and sometimes as a
     * format for storing translations that will be inlined at runtime.
     *
     * @see SimpleJsonTranslationParser
     */
    var SimpleJsonTranslationSerializer = /** @class */ (function () {
        function SimpleJsonTranslationSerializer(sourceLocale) {
            this.sourceLocale = sourceLocale;
        }
        SimpleJsonTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var fileObj = { locale: this.sourceLocale, translations: {} };
            try {
                for (var _b = (0, tslib_1.__values)((0, utils_1.consolidateMessages)(messages, function (message) { return message.id; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = (0, tslib_1.__read)(_c.value, 1), message = _d[0];
                    fileObj.translations[message.id] = message.text;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return JSON.stringify(fileObj, null, 2);
        };
        return SimpleJsonTranslationSerializer;
    }());
    exports.SimpleJsonTranslationSerializer = SimpleJsonTranslationSerializer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl90cmFuc2xhdGlvbl9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy9leHRyYWN0L3RyYW5zbGF0aW9uX2ZpbGVzL2pzb25fdHJhbnNsYXRpb25fc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EseUZBQTRDO0lBUTVDOzs7OztPQUtHO0lBQ0g7UUFDRSx5Q0FBb0IsWUFBb0I7WUFBcEIsaUJBQVksR0FBWixZQUFZLENBQVE7UUFBRyxDQUFDO1FBQzVDLG1EQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxPQUFPLEdBQThCLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxDQUFDOztnQkFDekYsS0FBd0IsSUFBQSxLQUFBLHNCQUFBLElBQUEsMkJBQW1CLEVBQUMsUUFBUSxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLEVBQUUsRUFBVixDQUFVLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBbkUsSUFBQSxLQUFBLGdDQUFTLEVBQVIsT0FBTyxRQUFBO29CQUNqQixPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO2lCQUNqRDs7Ozs7Ozs7O1lBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNILHNDQUFDO0lBQUQsQ0FBQyxBQVRELElBU0M7SUFUWSwwRUFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkTWVzc2FnZSwgybVTb3VyY2VNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7Y29uc29saWRhdGVNZXNzYWdlc30gZnJvbSAnLi91dGlscyc7XG5cblxuaW50ZXJmYWNlIFNpbXBsZUpzb25UcmFuc2xhdGlvbkZpbGUge1xuICBsb2NhbGU6IHN0cmluZztcbiAgdHJhbnNsYXRpb25zOiBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1U291cmNlTWVzc2FnZT47XG59XG5cbi8qKlxuICogVGhpcyBpcyBhIHNlbWktcHVibGljIGJlc3Bva2Ugc2VyaWFsaXphdGlvbiBmb3JtYXQgdGhhdCBpcyB1c2VkIGZvciB0ZXN0aW5nIGFuZCBzb21ldGltZXMgYXMgYVxuICogZm9ybWF0IGZvciBzdG9yaW5nIHRyYW5zbGF0aW9ucyB0aGF0IHdpbGwgYmUgaW5saW5lZCBhdCBydW50aW1lLlxuICpcbiAqIEBzZWUgU2ltcGxlSnNvblRyYW5zbGF0aW9uUGFyc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVKc29uVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZykge31cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgZmlsZU9iajogU2ltcGxlSnNvblRyYW5zbGF0aW9uRmlsZSA9IHtsb2NhbGU6IHRoaXMuc291cmNlTG9jYWxlLCB0cmFuc2xhdGlvbnM6IHt9fTtcbiAgICBmb3IgKGNvbnN0IFttZXNzYWdlXSBvZiBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IG1lc3NhZ2UuaWQpKSB7XG4gICAgICBmaWxlT2JqLnRyYW5zbGF0aW9uc1ttZXNzYWdlLmlkXSA9IG1lc3NhZ2UudGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZpbGVPYmosIG51bGwsIDIpO1xuICB9XG59XG4iXX0=