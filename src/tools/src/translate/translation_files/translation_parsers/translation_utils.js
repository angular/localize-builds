(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addParseError = exports.addParseDiagnostic = exports.isNamedElement = exports.canParseXml = exports.parseInnerRange = exports.getAttribute = exports.getAttrOrThrow = void 0;
    var tslib_1 = require("tslib");
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
    /**
     * Parse the "contents" of an XML element.
     *
     * This would be equivalent to parsing the `innerHTML` string of an HTML document.
     *
     * @param element The element whose inner range we want to parse.
     * @returns a collection of XML `Node` objects that were parsed from the element's contents.
     */
    function parseInnerRange(element) {
        var xmlParser = new compiler_1.XmlParser();
        var xml = xmlParser.parse(element.sourceSpan.start.file.content, element.sourceSpan.start.file.url, { tokenizeExpansionForms: true, range: getInnerRange(element) });
        if (xml.errors.length) {
            throw xml.errors.map(function (e) { return new translation_parse_error_1.TranslationParseError(e.span, e.msg).toString(); }).join('\n');
        }
        return xml.rootNodes;
    }
    exports.parseInnerRange = parseInnerRange;
    /**
     * Compute a `LexerRange` that contains all the children of the given `element`.
     * @param element The element whose inner range we want to compute.
     */
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
    /**
     * Can this XML be parsed for translations, given the expected `rootNodeName` and expected root node
     * `attributes` that should appear in the file.
     *
     * @param filePath The path to the file being checked.
     * @param contents The contents of the file being checked.
     * @param rootNodeName The expected name of an XML root node that should exist.
     * @param attributes The attributes (and their values) that should appear on the root node.
     * @returns The `XmlTranslationParserHint` object for use by `TranslationParser.parse()` if the XML
     * document has the expected format.
     */
    function canParseXml(filePath, contents, rootNodeName, attributes) {
        var e_1, _a;
        var xmlParser = new compiler_1.XmlParser();
        var xml = xmlParser.parse(contents, filePath);
        if (xml.rootNodes.length === 0 ||
            xml.errors.some(function (error) { return error.level === compiler_1.ParseErrorLevel.ERROR; })) {
            return false;
        }
        var rootElements = xml.rootNodes.filter(isNamedElement(rootNodeName));
        var rootElement = rootElements[0];
        if (rootElement === undefined) {
            return false;
        }
        var _loop_1 = function (attrKey) {
            var attr = rootElement.attrs.find(function (attr) { return attr.name === attrKey; });
            if (attr === undefined || attr.value !== attributes[attrKey]) {
                return { value: false };
            }
        };
        try {
            for (var _b = tslib_1.__values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attrKey = _c.value;
                var state_1 = _loop_1(attrKey);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (rootElements.length > 1) {
            xml.errors.push(new compiler_1.ParseError(xml.rootNodes[1].sourceSpan, 'Unexpected root node. XLIFF 1.2 files should only have a single <xliff> root node.', compiler_1.ParseErrorLevel.WARNING));
        }
        return { element: rootElement, errors: xml.errors };
    }
    exports.canParseXml = canParseXml;
    /**
     * Create a predicate, which can be used by things like `Array.filter()`, that will match a named
     * XML Element from a collection of XML Nodes.
     *
     * @param name The expected name of the element to match.
     */
    function isNamedElement(name) {
        function predicate(node) {
            return node instanceof compiler_1.Element && node.name === name;
        }
        return predicate;
    }
    exports.isNamedElement = isNamedElement;
    /**
     * Add an XML parser related message to the given `diagnostics` object.
     */
    function addParseDiagnostic(diagnostics, sourceSpan, message, level) {
        addParseError(diagnostics, new compiler_1.ParseError(sourceSpan, message, level));
    }
    exports.addParseDiagnostic = addParseDiagnostic;
    /**
     * Copy the formatted error message from the given `parseError` object into the given `diagnostics`
     * object.
     */
    function addParseError(diagnostics, parseError) {
        if (parseError.level === compiler_1.ParseErrorLevel.ERROR) {
            diagnostics.error(parseError.toString());
        }
        else {
            diagnostics.warn(parseError.toString());
        }
    }
    exports.addParseError = addParseError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBcUg7SUFFckgsbUpBQWdFO0lBRWhFLFNBQWdCLGNBQWMsQ0FBQyxPQUFnQixFQUFFLFFBQWdCO1FBQy9ELElBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQzNCLE1BQU0sSUFBSSwrQ0FBcUIsQ0FDM0IsT0FBTyxDQUFDLFVBQVUsRUFBRSx3QkFBcUIsUUFBUSxrQkFBYyxDQUFDLENBQUM7U0FDdEU7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBUEQsd0NBT0M7SUFFRCxTQUFnQixZQUFZLENBQUMsT0FBZ0IsRUFBRSxRQUFnQjtRQUM3RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDMUQsT0FBTyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDckQsQ0FBQztJQUhELG9DQUdDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxPQUFnQjtRQUM5QyxJQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztRQUNsQyxJQUFNLEdBQUcsR0FBRyxT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LEVBQzNCLG9GQUFvRixFQUNwRiwwQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDL0I7UUFFRCxPQUFPLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BELENBQUM7SUFoQ0Qsa0NBZ0NDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFnQixjQUFjLENBQUMsSUFBWTtRQUN6QyxTQUFTLFNBQVMsQ0FBQyxJQUFVO1lBQzNCLE9BQU8sSUFBSSxZQUFZLGtCQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7UUFDdkQsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFMRCx3Q0FLQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0Isa0JBQWtCLENBQzlCLFdBQXdCLEVBQUUsVUFBMkIsRUFBRSxPQUFlLEVBQ3RFLEtBQXNCO1FBQ3hCLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxxQkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBSkQsZ0RBSUM7SUFFRDs7O09BR0c7SUFDSCxTQUFnQixhQUFhLENBQUMsV0FBd0IsRUFBRSxVQUFzQjtRQUM1RSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssMEJBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDOUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMxQzthQUFNO1lBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7SUFORCxzQ0FNQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTGV4ZXJSYW5nZSwgTm9kZSwgUGFyc2VFcnJvciwgUGFyc2VFcnJvckxldmVsLCBQYXJzZVNvdXJjZVNwYW4sIFhtbFBhcnNlcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vLi4vLi4vZGlhZ25vc3RpY3MnO1xuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlRXJyb3J9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VfZXJyb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0ck9yVGhyb3coZWxlbWVudDogRWxlbWVudCwgYXR0ck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGF0dHJWYWx1ZSA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCBhdHRyTmFtZSk7XG4gIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoXG4gICAgICAgIGVsZW1lbnQuc291cmNlU3BhbiwgYE1pc3NpbmcgcmVxdWlyZWQgXCIke2F0dHJOYW1lfVwiIGF0dHJpYnV0ZTpgKTtcbiAgfVxuICByZXR1cm4gYXR0clZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0cmlidXRlKGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgY29uc3QgYXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZChhID0+IGEubmFtZSA9PT0gYXR0ck5hbWUpO1xuICByZXR1cm4gYXR0ciAhPT0gdW5kZWZpbmVkID8gYXR0ci52YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgXCJjb250ZW50c1wiIG9mIGFuIFhNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgd291bGQgYmUgZXF1aXZhbGVudCB0byBwYXJzaW5nIHRoZSBgaW5uZXJIVE1MYCBzdHJpbmcgb2YgYW4gSFRNTCBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHJldHVybnMgYSBjb2xsZWN0aW9uIG9mIFhNTCBgTm9kZWAgb2JqZWN0cyB0aGF0IHdlcmUgcGFyc2VkIGZyb20gdGhlIGVsZW1lbnQncyBjb250ZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSW5uZXJSYW5nZShlbGVtZW50OiBFbGVtZW50KTogTm9kZVtdIHtcbiAgY29uc3QgeG1sUGFyc2VyID0gbmV3IFhtbFBhcnNlcigpO1xuICBjb25zdCB4bWwgPSB4bWxQYXJzZXIucGFyc2UoXG4gICAgICBlbGVtZW50LnNvdXJjZVNwYW4uc3RhcnQuZmlsZS5jb250ZW50LCBlbGVtZW50LnNvdXJjZVNwYW4uc3RhcnQuZmlsZS51cmwsXG4gICAgICB7dG9rZW5pemVFeHBhbnNpb25Gb3JtczogdHJ1ZSwgcmFuZ2U6IGdldElubmVyUmFuZ2UoZWxlbWVudCl9KTtcbiAgaWYgKHhtbC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgeG1sLmVycm9ycy5tYXAoZSA9PiBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGUuc3BhbiwgZS5tc2cpLnRvU3RyaW5nKCkpLmpvaW4oJ1xcbicpO1xuICB9XG4gIHJldHVybiB4bWwucm9vdE5vZGVzO1xufVxuXG4vKipcbiAqIENvbXB1dGUgYSBgTGV4ZXJSYW5nZWAgdGhhdCBjb250YWlucyBhbGwgdGhlIGNoaWxkcmVuIG9mIHRoZSBnaXZlbiBgZWxlbWVudGAuXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIGNvbXB1dGUuXG4gKi9cbmZ1bmN0aW9uIGdldElubmVyUmFuZ2UoZWxlbWVudDogRWxlbWVudCk6IExleGVyUmFuZ2Uge1xuICBjb25zdCBzdGFydCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuIS5lbmQ7XG4gIGNvbnN0IGVuZCA9IGVsZW1lbnQuZW5kU291cmNlU3BhbiEuc3RhcnQ7XG4gIHJldHVybiB7XG4gICAgc3RhcnRQb3M6IHN0YXJ0Lm9mZnNldCxcbiAgICBzdGFydExpbmU6IHN0YXJ0LmxpbmUsXG4gICAgc3RhcnRDb2w6IHN0YXJ0LmNvbCxcbiAgICBlbmRQb3M6IGVuZC5vZmZzZXQsXG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBcImhpbnRcIiBvYmplY3QgaXMgdXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIGZyb20gYGNhblBhcnNlKClgIHRvIGBwYXJzZSgpYCBmb3JcbiAqIGBUcmFuc2xhdGlvblBhcnNlcmBzIHRoYXQgZXhwZWN0IFhNTCBjb250ZW50cy5cbiAqXG4gKiBUaGlzIHNhdmVzIHRoZSBgcGFyc2UoKWAgbWV0aG9kIGZyb20gaGF2aW5nIHRvIHJlLXBhcnNlIHRoZSBYTUwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50IHtcbiAgZWxlbWVudDogRWxlbWVudDtcbiAgZXJyb3JzOiBQYXJzZUVycm9yW107XG59XG5cbi8qKlxuICogQ2FuIHRoaXMgWE1MIGJlIHBhcnNlZCBmb3IgdHJhbnNsYXRpb25zLCBnaXZlbiB0aGUgZXhwZWN0ZWQgYHJvb3ROb2RlTmFtZWAgYW5kIGV4cGVjdGVkIHJvb3Qgbm9kZVxuICogYGF0dHJpYnV0ZXNgIHRoYXQgc2hvdWxkIGFwcGVhciBpbiB0aGUgZmlsZS5cbiAqXG4gKiBAcGFyYW0gZmlsZVBhdGggVGhlIHBhdGggdG8gdGhlIGZpbGUgYmVpbmcgY2hlY2tlZC5cbiAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgYmVpbmcgY2hlY2tlZC5cbiAqIEBwYXJhbSByb290Tm9kZU5hbWUgVGhlIGV4cGVjdGVkIG5hbWUgb2YgYW4gWE1MIHJvb3Qgbm9kZSB0aGF0IHNob3VsZCBleGlzdC5cbiAqIEBwYXJhbSBhdHRyaWJ1dGVzIFRoZSBhdHRyaWJ1dGVzIChhbmQgdGhlaXIgdmFsdWVzKSB0aGF0IHNob3VsZCBhcHBlYXIgb24gdGhlIHJvb3Qgbm9kZS5cbiAqIEByZXR1cm5zIFRoZSBgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50YCBvYmplY3QgZm9yIHVzZSBieSBgVHJhbnNsYXRpb25QYXJzZXIucGFyc2UoKWAgaWYgdGhlIFhNTFxuICogZG9jdW1lbnQgaGFzIHRoZSBleHBlY3RlZCBmb3JtYXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5QYXJzZVhtbChcbiAgICBmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCByb290Tm9kZU5hbWU6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgY29uc3QgeG1sUGFyc2VyID0gbmV3IFhtbFBhcnNlcigpO1xuICBjb25zdCB4bWwgPSB4bWxQYXJzZXIucGFyc2UoY29udGVudHMsIGZpbGVQYXRoKTtcblxuICBpZiAoeG1sLnJvb3ROb2Rlcy5sZW5ndGggPT09IDAgfHxcbiAgICAgIHhtbC5lcnJvcnMuc29tZShlcnJvciA9PiBlcnJvci5sZXZlbCA9PT0gUGFyc2VFcnJvckxldmVsLkVSUk9SKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHJvb3RFbGVtZW50cyA9IHhtbC5yb290Tm9kZXMuZmlsdGVyKGlzTmFtZWRFbGVtZW50KHJvb3ROb2RlTmFtZSkpO1xuICBjb25zdCByb290RWxlbWVudCA9IHJvb3RFbGVtZW50c1swXTtcbiAgaWYgKHJvb3RFbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IGF0dHJLZXkgb2YgT2JqZWN0LmtleXMoYXR0cmlidXRlcykpIHtcbiAgICBjb25zdCBhdHRyID0gcm9vdEVsZW1lbnQuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gYXR0cktleSk7XG4gICAgaWYgKGF0dHIgPT09IHVuZGVmaW5lZCB8fCBhdHRyLnZhbHVlICE9PSBhdHRyaWJ1dGVzW2F0dHJLZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJvb3RFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgeG1sLmVycm9ycy5wdXNoKG5ldyBQYXJzZUVycm9yKFxuICAgICAgICB4bWwucm9vdE5vZGVzWzFdLnNvdXJjZVNwYW4sXG4gICAgICAgICdVbmV4cGVjdGVkIHJvb3Qgbm9kZS4gWExJRkYgMS4yIGZpbGVzIHNob3VsZCBvbmx5IGhhdmUgYSBzaW5nbGUgPHhsaWZmPiByb290IG5vZGUuJyxcbiAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpKTtcbiAgfVxuXG4gIHJldHVybiB7ZWxlbWVudDogcm9vdEVsZW1lbnQsIGVycm9yczogeG1sLmVycm9yc307XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJlZGljYXRlLCB3aGljaCBjYW4gYmUgdXNlZCBieSB0aGluZ3MgbGlrZSBgQXJyYXkuZmlsdGVyKClgLCB0aGF0IHdpbGwgbWF0Y2ggYSBuYW1lZFxuICogWE1MIEVsZW1lbnQgZnJvbSBhIGNvbGxlY3Rpb24gb2YgWE1MIE5vZGVzLlxuICpcbiAqIEBwYXJhbSBuYW1lIFRoZSBleHBlY3RlZCBuYW1lIG9mIHRoZSBlbGVtZW50IHRvIG1hdGNoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOYW1lZEVsZW1lbnQobmFtZTogc3RyaW5nKTogKG5vZGU6IE5vZGUpID0+IG5vZGUgaXMgRWxlbWVudCB7XG4gIGZ1bmN0aW9uIHByZWRpY2F0ZShub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5uYW1lID09PSBuYW1lO1xuICB9XG4gIHJldHVybiBwcmVkaWNhdGU7XG59XG5cbi8qKlxuICogQWRkIGFuIFhNTCBwYXJzZXIgcmVsYXRlZCBtZXNzYWdlIHRvIHRoZSBnaXZlbiBgZGlhZ25vc3RpY3NgIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICBkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgbWVzc2FnZTogc3RyaW5nLFxuICAgIGxldmVsOiBQYXJzZUVycm9yTGV2ZWwpOiB2b2lkIHtcbiAgYWRkUGFyc2VFcnJvcihkaWFnbm9zdGljcywgbmV3IFBhcnNlRXJyb3Ioc291cmNlU3BhbiwgbWVzc2FnZSwgbGV2ZWwpKTtcbn1cblxuLyoqXG4gKiBDb3B5IHRoZSBmb3JtYXR0ZWQgZXJyb3IgbWVzc2FnZSBmcm9tIHRoZSBnaXZlbiBgcGFyc2VFcnJvcmAgb2JqZWN0IGludG8gdGhlIGdpdmVuIGBkaWFnbm9zdGljc2BcbiAqIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFBhcnNlRXJyb3IoZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBwYXJzZUVycm9yOiBQYXJzZUVycm9yKTogdm9pZCB7XG4gIGlmIChwYXJzZUVycm9yLmxldmVsID09PSBQYXJzZUVycm9yTGV2ZWwuRVJST1IpIHtcbiAgICBkaWFnbm9zdGljcy5lcnJvcihwYXJzZUVycm9yLnRvU3RyaW5nKCkpO1xuICB9IGVsc2Uge1xuICAgIGRpYWdub3N0aWNzLndhcm4ocGFyc2VFcnJvci50b1N0cmluZygpKTtcbiAgfVxufVxuIl19