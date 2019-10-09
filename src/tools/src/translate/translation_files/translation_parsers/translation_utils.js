(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils", ["require", "exports", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error"], factory);
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
    var compiler_1 = require("@angular/compiler");
    var translation_parse_error_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error");
    function getAttrOrThrow(element, attrName) {
        var attrValue = getAttribute(element, attrName);
        if (attrValue === undefined) {
            throw new translation_parse_error_1.TranslationParseError(element.sourceSpan, "Missing required \"" + attrName + "\" attribute:");
        }
        return attrValue;
    }
    exports.getAttrOrThrow = getAttrOrThrow;
    function getAttribute(element, attrName) {
        var attr = element.attrs.find(function (a) { return a.name === attrName; });
        return attr !== undefined ? attr.value : undefined;
    }
    exports.getAttribute = getAttribute;
    function parseInnerRange(element) {
        var xmlParser = new compiler_1.XmlParser();
        var xml = xmlParser.parse(element.sourceSpan.start.file.content, element.sourceSpan.start.file.url, { tokenizeExpansionForms: true, range: getInnerRange(element) });
        return xml.rootNodes;
    }
    exports.parseInnerRange = parseInnerRange;
    function getInnerRange(element) {
        var start = element.startSourceSpan.end;
        var end = element.endSourceSpan.start;
        return {
            startPos: start.offset,
            startLine: start.line,
            startCol: start.col,
            endPos: end.offset,
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOENBQXVFO0lBQ3ZFLG1KQUFnRTtJQUVoRSxTQUFnQixjQUFjLENBQUMsT0FBZ0IsRUFBRSxRQUFnQjtRQUMvRCxJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUMzQixNQUFNLElBQUksK0NBQXFCLENBQzNCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsd0JBQXFCLFFBQVEsa0JBQWMsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQVBELHdDQU9DO0lBRUQsU0FBZ0IsWUFBWSxDQUFDLE9BQWdCLEVBQUUsUUFBZ0I7UUFDN0QsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQzFELE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUM7SUFIRCxvQ0FHQztJQUVELFNBQWdCLGVBQWUsQ0FBQyxPQUFnQjtRQUM5QyxJQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztRQUNsQyxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUN2QixPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQ3hFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUN2QixDQUFDO0lBTkQsMENBTUM7SUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFnQjtRQUNyQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBaUIsQ0FBQyxHQUFHLENBQUM7UUFDNUMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGFBQWUsQ0FBQyxLQUFLLENBQUM7UUFDMUMsT0FBTztZQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTTtZQUN0QixTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDckIsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ25CLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtTQUNuQixDQUFDO0lBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTGV4ZXJSYW5nZSwgTm9kZSwgWG1sUGFyc2VyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uUGFyc2VFcnJvcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZV9lcnJvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRyT3JUaHJvdyhlbGVtZW50OiBFbGVtZW50LCBhdHRyTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYXR0clZhbHVlID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJOYW1lKTtcbiAgaWYgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFRyYW5zbGF0aW9uUGFyc2VFcnJvcihcbiAgICAgICAgZWxlbWVudC5zb3VyY2VTcGFuLCBgTWlzc2luZyByZXF1aXJlZCBcIiR7YXR0ck5hbWV9XCIgYXR0cmlidXRlOmApO1xuICB9XG4gIHJldHVybiBhdHRyVmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRyaWJ1dGUoZWxlbWVudDogRWxlbWVudCwgYXR0ck5hbWU6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQge1xuICBjb25zdCBhdHRyID0gZWxlbWVudC5hdHRycy5maW5kKGEgPT4gYS5uYW1lID09PSBhdHRyTmFtZSk7XG4gIHJldHVybiBhdHRyICE9PSB1bmRlZmluZWQgPyBhdHRyLnZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJbm5lclJhbmdlKGVsZW1lbnQ6IEVsZW1lbnQpOiBOb2RlW10ge1xuICBjb25zdCB4bWxQYXJzZXIgPSBuZXcgWG1sUGFyc2VyKCk7XG4gIGNvbnN0IHhtbCA9IHhtbFBhcnNlci5wYXJzZShcbiAgICAgIGVsZW1lbnQuc291cmNlU3Bhbi5zdGFydC5maWxlLmNvbnRlbnQsIGVsZW1lbnQuc291cmNlU3Bhbi5zdGFydC5maWxlLnVybCxcbiAgICAgIHt0b2tlbml6ZUV4cGFuc2lvbkZvcm1zOiB0cnVlLCByYW5nZTogZ2V0SW5uZXJSYW5nZShlbGVtZW50KX0pO1xuICByZXR1cm4geG1sLnJvb3ROb2Rlcztcbn1cblxuZnVuY3Rpb24gZ2V0SW5uZXJSYW5nZShlbGVtZW50OiBFbGVtZW50KTogTGV4ZXJSYW5nZSB7XG4gIGNvbnN0IHN0YXJ0ID0gZWxlbWVudC5zdGFydFNvdXJjZVNwYW4gIS5lbmQ7XG4gIGNvbnN0IGVuZCA9IGVsZW1lbnQuZW5kU291cmNlU3BhbiAhLnN0YXJ0O1xuICByZXR1cm4ge1xuICAgIHN0YXJ0UG9zOiBzdGFydC5vZmZzZXQsXG4gICAgc3RhcnRMaW5lOiBzdGFydC5saW5lLFxuICAgIHN0YXJ0Q29sOiBzdGFydC5jb2wsXG4gICAgZW5kUG9zOiBlbmQub2Zmc2V0LFxuICB9O1xufSJdfQ==