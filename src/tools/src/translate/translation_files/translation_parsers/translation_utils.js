(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils", ["require", "exports", "tslib", "@angular/compiler", "@angular/localize/src/tools/src/diagnostics", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_parse_error"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addParseError = exports.addParseDiagnostic = exports.isNamedElement = exports.canParseXml = exports.parseInnerRange = exports.getAttribute = exports.getAttrOrThrow = void 0;
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
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
        var diagnostics = new diagnostics_1.Diagnostics();
        var xmlParser = new compiler_1.XmlParser();
        var xml = xmlParser.parse(contents, filePath);
        if (xml.rootNodes.length === 0 ||
            xml.errors.some(function (error) { return error.level === compiler_1.ParseErrorLevel.ERROR; })) {
            xml.errors.forEach(function (e) { return addParseError(diagnostics, e); });
            return { canParse: false, diagnostics: diagnostics };
        }
        var rootElements = xml.rootNodes.filter(isNamedElement(rootNodeName));
        var rootElement = rootElements[0];
        if (rootElement === undefined) {
            diagnostics.warn("The XML file does not contain a <" + rootNodeName + "> root node.");
            return { canParse: false, diagnostics: diagnostics };
        }
        var _loop_1 = function (attrKey) {
            var attr = rootElement.attrs.find(function (attr) { return attr.name === attrKey; });
            if (attr === undefined || attr.value !== attributes[attrKey]) {
                addParseDiagnostic(diagnostics, rootElement.sourceSpan, "The <" + rootNodeName + "> node does not have the required attribute: " + attrKey + "=\"" + attributes[attrKey] + "\".", compiler_1.ParseErrorLevel.WARNING);
                return { value: { canParse: false, diagnostics: diagnostics } };
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
        return { canParse: true, diagnostics: diagnostics, hint: { element: rootElement, errors: xml.errors } };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw4Q0FBcUg7SUFDckgsMkVBQWlEO0lBQ2pELG1KQUFnRTtJQUdoRSxTQUFnQixjQUFjLENBQUMsT0FBZ0IsRUFBRSxRQUFnQjtRQUMvRCxJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUMzQixNQUFNLElBQUksK0NBQXFCLENBQzNCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsd0JBQXFCLFFBQVEsa0JBQWMsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQVBELHdDQU9DO0lBRUQsU0FBZ0IsWUFBWSxDQUFDLE9BQWdCLEVBQUUsUUFBZ0I7UUFDN0QsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQzFELE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JELENBQUM7SUFIRCxvQ0FHQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxTQUFnQixlQUFlLENBQUMsT0FBZ0I7UUFDOUMsSUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7UUFDbEMsSUFB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QUFFLE9BQWUsRUFDdEUsS0FBc0I7UUFDeEIsYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLHFCQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFKRCxnREFJQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLGFBQWEsQ0FBQyxXQUF3QixFQUFFLFVBQXNCO1FBQzVFLElBQUksVUFBVSxDQUFDLEtBQUssS0FBSywwQkFBZSxDQUFDLEtBQUssRUFBRTtZQUM5QyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQU5ELHNDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnQsIExleGVyUmFuZ2UsIE5vZGUsIFBhcnNlRXJyb3IsIFBhcnNlRXJyb3JMZXZlbCwgUGFyc2VTb3VyY2VTcGFuLCBYbWxQYXJzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7VHJhbnNsYXRpb25QYXJzZUVycm9yfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlX2Vycm9yJztcbmltcG9ydCB7UGFyc2VBbmFseXNpc30gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0ck9yVGhyb3coZWxlbWVudDogRWxlbWVudCwgYXR0ck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGF0dHJWYWx1ZSA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCBhdHRyTmFtZSk7XG4gIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoXG4gICAgICAgIGVsZW1lbnQuc291cmNlU3BhbiwgYE1pc3NpbmcgcmVxdWlyZWQgXCIke2F0dHJOYW1lfVwiIGF0dHJpYnV0ZTpgKTtcbiAgfVxuICByZXR1cm4gYXR0clZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0cmlidXRlKGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgY29uc3QgYXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZChhID0+IGEubmFtZSA9PT0gYXR0ck5hbWUpO1xuICByZXR1cm4gYXR0ciAhPT0gdW5kZWZpbmVkID8gYXR0ci52YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgXCJjb250ZW50c1wiIG9mIGFuIFhNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgd291bGQgYmUgZXF1aXZhbGVudCB0byBwYXJzaW5nIHRoZSBgaW5uZXJIVE1MYCBzdHJpbmcgb2YgYW4gSFRNTCBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHJldHVybnMgYSBjb2xsZWN0aW9uIG9mIFhNTCBgTm9kZWAgb2JqZWN0cyB0aGF0IHdlcmUgcGFyc2VkIGZyb20gdGhlIGVsZW1lbnQncyBjb250ZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSW5uZXJSYW5nZShlbGVtZW50OiBFbGVtZW50KTogTm9kZVtdIHtcbiAgY29uc3QgeG1sUGFyc2VyID0gbmV3IFhtbFBhcnNlcigpO1xuICBjb25zdCB4bWwgPSB4bWxQYXJzZXIucGFyc2UoXG4gICAgICBlbGVtZW50LnNvdXJjZVNwYW4uc3RhcnQuZmlsZS5jb250ZW50LCBlbGVtZW50LnNvdXJjZVNwYW4uc3RhcnQuZmlsZS51cmwsXG4gICAgICB7dG9rZW5pemVFeHBhbnNpb25Gb3JtczogdHJ1ZSwgcmFuZ2U6IGdldElubmVyUmFuZ2UoZWxlbWVudCl9KTtcbiAgaWYgKHhtbC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgeG1sLmVycm9ycy5tYXAoZSA9PiBuZXcgVHJhbnNsYXRpb25QYXJzZUVycm9yKGUuc3BhbiwgZS5tc2cpLnRvU3RyaW5nKCkpLmpvaW4oJ1xcbicpO1xuICB9XG4gIHJldHVybiB4bWwucm9vdE5vZGVzO1xufVxuXG4vKipcbiAqIENvbXB1dGUgYSBgTGV4ZXJSYW5nZWAgdGhhdCBjb250YWlucyBhbGwgdGhlIGNoaWxkcmVuIG9mIHRoZSBnaXZlbiBgZWxlbWVudGAuXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIGNvbXB1dGUuXG4gKi9cbmZ1bmN0aW9uIGdldElubmVyUmFuZ2UoZWxlbWVudDogRWxlbWVudCk6IExleGVyUmFuZ2Uge1xuICBjb25zdCBzdGFydCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuIS5lbmQ7XG4gIGNvbnN0IGVuZCA9IGVsZW1lbnQuZW5kU291cmNlU3BhbiEuc3RhcnQ7XG4gIHJldHVybiB7XG4gICAgc3RhcnRQb3M6IHN0YXJ0Lm9mZnNldCxcbiAgICBzdGFydExpbmU6IHN0YXJ0LmxpbmUsXG4gICAgc3RhcnRDb2w6IHN0YXJ0LmNvbCxcbiAgICBlbmRQb3M6IGVuZC5vZmZzZXQsXG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBcImhpbnRcIiBvYmplY3QgaXMgdXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIGZyb20gYGNhblBhcnNlKClgIHRvIGBwYXJzZSgpYCBmb3JcbiAqIGBUcmFuc2xhdGlvblBhcnNlcmBzIHRoYXQgZXhwZWN0IFhNTCBjb250ZW50cy5cbiAqXG4gKiBUaGlzIHNhdmVzIHRoZSBgcGFyc2UoKWAgbWV0aG9kIGZyb20gaGF2aW5nIHRvIHJlLXBhcnNlIHRoZSBYTUwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50IHtcbiAgZWxlbWVudDogRWxlbWVudDtcbiAgZXJyb3JzOiBQYXJzZUVycm9yW107XG59XG5cbi8qKlxuICogQ2FuIHRoaXMgWE1MIGJlIHBhcnNlZCBmb3IgdHJhbnNsYXRpb25zLCBnaXZlbiB0aGUgZXhwZWN0ZWQgYHJvb3ROb2RlTmFtZWAgYW5kIGV4cGVjdGVkIHJvb3Qgbm9kZVxuICogYGF0dHJpYnV0ZXNgIHRoYXQgc2hvdWxkIGFwcGVhciBpbiB0aGUgZmlsZS5cbiAqXG4gKiBAcGFyYW0gZmlsZVBhdGggVGhlIHBhdGggdG8gdGhlIGZpbGUgYmVpbmcgY2hlY2tlZC5cbiAqIEBwYXJhbSBjb250ZW50cyBUaGUgY29udGVudHMgb2YgdGhlIGZpbGUgYmVpbmcgY2hlY2tlZC5cbiAqIEBwYXJhbSByb290Tm9kZU5hbWUgVGhlIGV4cGVjdGVkIG5hbWUgb2YgYW4gWE1MIHJvb3Qgbm9kZSB0aGF0IHNob3VsZCBleGlzdC5cbiAqIEBwYXJhbSBhdHRyaWJ1dGVzIFRoZSBhdHRyaWJ1dGVzIChhbmQgdGhlaXIgdmFsdWVzKSB0aGF0IHNob3VsZCBhcHBlYXIgb24gdGhlIHJvb3Qgbm9kZS5cbiAqIEByZXR1cm5zIFRoZSBgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50YCBvYmplY3QgZm9yIHVzZSBieSBgVHJhbnNsYXRpb25QYXJzZXIucGFyc2UoKWAgaWYgdGhlIFhNTFxuICogZG9jdW1lbnQgaGFzIHRoZSBleHBlY3RlZCBmb3JtYXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5QYXJzZVhtbChcbiAgICBmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCByb290Tm9kZU5hbWU6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUGFyc2VBbmFseXNpczxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgY29uc3QgZGlhZ25vc3RpY3MgPSBuZXcgRGlhZ25vc3RpY3MoKTtcbiAgY29uc3QgeG1sUGFyc2VyID0gbmV3IFhtbFBhcnNlcigpO1xuICBjb25zdCB4bWwgPSB4bWxQYXJzZXIucGFyc2UoY29udGVudHMsIGZpbGVQYXRoKTtcblxuICBpZiAoeG1sLnJvb3ROb2Rlcy5sZW5ndGggPT09IDAgfHxcbiAgICAgIHhtbC5lcnJvcnMuc29tZShlcnJvciA9PiBlcnJvci5sZXZlbCA9PT0gUGFyc2VFcnJvckxldmVsLkVSUk9SKSkge1xuICAgIHhtbC5lcnJvcnMuZm9yRWFjaChlID0+IGFkZFBhcnNlRXJyb3IoZGlhZ25vc3RpY3MsIGUpKTtcbiAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICB9XG5cbiAgY29uc3Qgcm9vdEVsZW1lbnRzID0geG1sLnJvb3ROb2Rlcy5maWx0ZXIoaXNOYW1lZEVsZW1lbnQocm9vdE5vZGVOYW1lKSk7XG4gIGNvbnN0IHJvb3RFbGVtZW50ID0gcm9vdEVsZW1lbnRzWzBdO1xuICBpZiAocm9vdEVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGRpYWdub3N0aWNzLndhcm4oYFRoZSBYTUwgZmlsZSBkb2VzIG5vdCBjb250YWluIGEgPCR7cm9vdE5vZGVOYW1lfT4gcm9vdCBub2RlLmApO1xuICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gIH1cblxuICBmb3IgKGNvbnN0IGF0dHJLZXkgb2YgT2JqZWN0LmtleXMoYXR0cmlidXRlcykpIHtcbiAgICBjb25zdCBhdHRyID0gcm9vdEVsZW1lbnQuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gYXR0cktleSk7XG4gICAgaWYgKGF0dHIgPT09IHVuZGVmaW5lZCB8fCBhdHRyLnZhbHVlICE9PSBhdHRyaWJ1dGVzW2F0dHJLZXldKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIHJvb3RFbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYFRoZSA8JHtyb290Tm9kZU5hbWV9PiBub2RlIGRvZXMgbm90IGhhdmUgdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZTogJHthdHRyS2V5fT1cIiR7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cktleV19XCIuYCxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgfVxuXG4gIGlmIChyb290RWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgIHhtbC5lcnJvcnMucHVzaChuZXcgUGFyc2VFcnJvcihcbiAgICAgICAgeG1sLnJvb3ROb2Rlc1sxXS5zb3VyY2VTcGFuLFxuICAgICAgICAnVW5leHBlY3RlZCByb290IG5vZGUuIFhMSUZGIDEuMiBmaWxlcyBzaG91bGQgb25seSBoYXZlIGEgc2luZ2xlIDx4bGlmZj4gcm9vdCBub2RlLicsXG4gICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKSk7XG4gIH1cblxuICByZXR1cm4ge2NhblBhcnNlOiB0cnVlLCBkaWFnbm9zdGljcywgaGludDoge2VsZW1lbnQ6IHJvb3RFbGVtZW50LCBlcnJvcnM6IHhtbC5lcnJvcnN9fTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBwcmVkaWNhdGUsIHdoaWNoIGNhbiBiZSB1c2VkIGJ5IHRoaW5ncyBsaWtlIGBBcnJheS5maWx0ZXIoKWAsIHRoYXQgd2lsbCBtYXRjaCBhIG5hbWVkXG4gKiBYTUwgRWxlbWVudCBmcm9tIGEgY29sbGVjdGlvbiBvZiBYTUwgTm9kZXMuXG4gKlxuICogQHBhcmFtIG5hbWUgVGhlIGV4cGVjdGVkIG5hbWUgb2YgdGhlIGVsZW1lbnQgdG8gbWF0Y2guXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkRWxlbWVudChuYW1lOiBzdHJpbmcpOiAobm9kZTogTm9kZSkgPT4gbm9kZSBpcyBFbGVtZW50IHtcbiAgZnVuY3Rpb24gcHJlZGljYXRlKG5vZGU6IE5vZGUpOiBub2RlIGlzIEVsZW1lbnQge1xuICAgIHJldHVybiBub2RlIGluc3RhbmNlb2YgRWxlbWVudCAmJiBub2RlLm5hbWUgPT09IG5hbWU7XG4gIH1cbiAgcmV0dXJuIHByZWRpY2F0ZTtcbn1cblxuLyoqXG4gKiBBZGQgYW4gWE1MIHBhcnNlciByZWxhdGVkIG1lc3NhZ2UgdG8gdGhlIGdpdmVuIGBkaWFnbm9zdGljc2Agb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBtZXNzYWdlOiBzdHJpbmcsXG4gICAgbGV2ZWw6IFBhcnNlRXJyb3JMZXZlbCk6IHZvaWQge1xuICBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzLCBuZXcgUGFyc2VFcnJvcihzb3VyY2VTcGFuLCBtZXNzYWdlLCBsZXZlbCkpO1xufVxuXG4vKipcbiAqIENvcHkgdGhlIGZvcm1hdHRlZCBlcnJvciBtZXNzYWdlIGZyb20gdGhlIGdpdmVuIGBwYXJzZUVycm9yYCBvYmplY3QgaW50byB0aGUgZ2l2ZW4gYGRpYWdub3N0aWNzYFxuICogb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUGFyc2VFcnJvcihkaWFnbm9zdGljczogRGlhZ25vc3RpY3MsIHBhcnNlRXJyb3I6IFBhcnNlRXJyb3IpOiB2b2lkIHtcbiAgaWYgKHBhcnNlRXJyb3IubGV2ZWwgPT09IFBhcnNlRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGRpYWdub3N0aWNzLmVycm9yKHBhcnNlRXJyb3IudG9TdHJpbmcoKSk7XG4gIH0gZWxzZSB7XG4gICAgZGlhZ25vc3RpY3Mud2FybihwYXJzZUVycm9yLnRvU3RyaW5nKCkpO1xuICB9XG59XG4iXX0=