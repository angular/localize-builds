/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, ParseError, ParseErrorLevel, XmlParser } from '@angular/compiler';
import { Diagnostics } from '../../../diagnostics';
import { TranslationParseError } from './translation_parse_error';
export function getAttrOrThrow(element, attrName) {
    const attrValue = getAttribute(element, attrName);
    if (attrValue === undefined) {
        throw new TranslationParseError(element.sourceSpan, `Missing required "${attrName}" attribute:`);
    }
    return attrValue;
}
export function getAttribute(element, attrName) {
    const attr = element.attrs.find(a => a.name === attrName);
    return attr !== undefined ? attr.value : undefined;
}
/**
 * Parse the "contents" of an XML element.
 *
 * This would be equivalent to parsing the `innerHTML` string of an HTML document.
 *
 * @param element The element whose inner range we want to parse.
 * @returns a collection of XML `Node` objects and any errors that were parsed from the element's
 *     contents.
 */
export function parseInnerRange(element) {
    const xmlParser = new XmlParser();
    const xml = xmlParser.parse(element.sourceSpan.start.file.content, element.sourceSpan.start.file.url, { tokenizeExpansionForms: true, range: getInnerRange(element) });
    return xml;
}
/**
 * Compute a `LexerRange` that contains all the children of the given `element`.
 * @param element The element whose inner range we want to compute.
 */
function getInnerRange(element) {
    const start = element.startSourceSpan.end;
    const end = element.endSourceSpan.start;
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
export function canParseXml(filePath, contents, rootNodeName, attributes) {
    const diagnostics = new Diagnostics();
    const xmlParser = new XmlParser();
    const xml = xmlParser.parse(contents, filePath);
    if (xml.rootNodes.length === 0 ||
        xml.errors.some(error => error.level === ParseErrorLevel.ERROR)) {
        xml.errors.forEach(e => addParseError(diagnostics, e));
        return { canParse: false, diagnostics };
    }
    const rootElements = xml.rootNodes.filter(isNamedElement(rootNodeName));
    const rootElement = rootElements[0];
    if (rootElement === undefined) {
        diagnostics.warn(`The XML file does not contain a <${rootNodeName}> root node.`);
        return { canParse: false, diagnostics };
    }
    for (const attrKey of Object.keys(attributes)) {
        const attr = rootElement.attrs.find(attr => attr.name === attrKey);
        if (attr === undefined || attr.value !== attributes[attrKey]) {
            addParseDiagnostic(diagnostics, rootElement.sourceSpan, `The <${rootNodeName}> node does not have the required attribute: ${attrKey}="${attributes[attrKey]}".`, ParseErrorLevel.WARNING);
            return { canParse: false, diagnostics };
        }
    }
    if (rootElements.length > 1) {
        xml.errors.push(new ParseError(xml.rootNodes[1].sourceSpan, 'Unexpected root node. XLIFF 1.2 files should only have a single <xliff> root node.', ParseErrorLevel.WARNING));
    }
    return { canParse: true, diagnostics, hint: { element: rootElement, errors: xml.errors } };
}
/**
 * Create a predicate, which can be used by things like `Array.filter()`, that will match a named
 * XML Element from a collection of XML Nodes.
 *
 * @param name The expected name of the element to match.
 */
export function isNamedElement(name) {
    function predicate(node) {
        return node instanceof Element && node.name === name;
    }
    return predicate;
}
/**
 * Add an XML parser related message to the given `diagnostics` object.
 */
export function addParseDiagnostic(diagnostics, sourceSpan, message, level) {
    addParseError(diagnostics, new ParseError(sourceSpan, message, level));
}
/**
 * Copy the formatted error message from the given `parseError` object into the given `diagnostics`
 * object.
 */
export function addParseError(diagnostics, parseError) {
    if (parseError.level === ParseErrorLevel.ERROR) {
        diagnostics.error(parseError.toString());
    }
    else {
        diagnostics.warn(parseError.toString());
    }
}
/**
 * Add the provided `errors` to the `bundle` diagnostics.
 */
export function addErrorsToBundle(bundle, errors) {
    for (const error of errors) {
        addParseError(bundle.diagnostics, error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3RyYW5zbGF0aW9uX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxPQUFPLEVBQW9CLFVBQVUsRUFBRSxlQUFlLEVBQW9DLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXRJLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVqRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUdoRSxNQUFNLFVBQVUsY0FBYyxDQUFDLE9BQWdCLEVBQUUsUUFBZ0I7SUFDL0QsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7UUFDM0IsTUFBTSxJQUFJLHFCQUFxQixDQUMzQixPQUFPLENBQUMsVUFBVSxFQUFFLHFCQUFxQixRQUFRLGNBQWMsQ0FBQyxDQUFDO0tBQ3RFO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsT0FBZ0IsRUFBRSxRQUFnQjtJQUM3RCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDMUQsT0FBTyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDckQsQ0FBQztBQUVEOzs7Ozs7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Q0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDekM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsTUFBK0IsRUFBRSxNQUFvQjtJQUNyRixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUMxQixhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMxQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgTGV4ZXJSYW5nZSwgTm9kZSwgUGFyc2VFcnJvciwgUGFyc2VFcnJvckxldmVsLCBQYXJzZVNvdXJjZVNwYW4sIFBhcnNlVHJlZVJlc3VsdCwgWG1sUGFyc2VyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtUcmFuc2xhdGlvblBhcnNlRXJyb3J9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VfZXJyb3InO1xuaW1wb3J0IHtQYXJzZUFuYWx5c2lzLCBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZX0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0ck9yVGhyb3coZWxlbWVudDogRWxlbWVudCwgYXR0ck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGF0dHJWYWx1ZSA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCBhdHRyTmFtZSk7XG4gIGlmIChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBUcmFuc2xhdGlvblBhcnNlRXJyb3IoXG4gICAgICAgIGVsZW1lbnQuc291cmNlU3BhbiwgYE1pc3NpbmcgcmVxdWlyZWQgXCIke2F0dHJOYW1lfVwiIGF0dHJpYnV0ZTpgKTtcbiAgfVxuICByZXR1cm4gYXR0clZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0cmlidXRlKGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJOYW1lOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcbiAgY29uc3QgYXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZChhID0+IGEubmFtZSA9PT0gYXR0ck5hbWUpO1xuICByZXR1cm4gYXR0ciAhPT0gdW5kZWZpbmVkID8gYXR0ci52YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgXCJjb250ZW50c1wiIG9mIGFuIFhNTCBlbGVtZW50LlxuICpcbiAqIFRoaXMgd291bGQgYmUgZXF1aXZhbGVudCB0byBwYXJzaW5nIHRoZSBgaW5uZXJIVE1MYCBzdHJpbmcgb2YgYW4gSFRNTCBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHJldHVybnMgYSBjb2xsZWN0aW9uIG9mIFhNTCBgTm9kZWAgb2JqZWN0cyBhbmQgYW55IGVycm9ycyB0aGF0IHdlcmUgcGFyc2VkIGZyb20gdGhlIGVsZW1lbnQnc1xuICogICAgIGNvbnRlbnRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJbm5lclJhbmdlKGVsZW1lbnQ6IEVsZW1lbnQpOiBQYXJzZVRyZWVSZXN1bHQge1xuICBjb25zdCB4bWxQYXJzZXIgPSBuZXcgWG1sUGFyc2VyKCk7XG4gIGNvbnN0IHhtbCA9IHhtbFBhcnNlci5wYXJzZShcbiAgICAgIGVsZW1lbnQuc291cmNlU3Bhbi5zdGFydC5maWxlLmNvbnRlbnQsIGVsZW1lbnQuc291cmNlU3Bhbi5zdGFydC5maWxlLnVybCxcbiAgICAgIHt0b2tlbml6ZUV4cGFuc2lvbkZvcm1zOiB0cnVlLCByYW5nZTogZ2V0SW5uZXJSYW5nZShlbGVtZW50KX0pO1xuICByZXR1cm4geG1sO1xufVxuXG4vKipcbiAqIENvbXB1dGUgYSBgTGV4ZXJSYW5nZWAgdGhhdCBjb250YWlucyBhbGwgdGhlIGNoaWxkcmVuIG9mIHRoZSBnaXZlbiBgZWxlbWVudGAuXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB3aG9zZSBpbm5lciByYW5nZSB3ZSB3YW50IHRvIGNvbXB1dGUuXG4gKi9cbmZ1bmN0aW9uIGdldElubmVyUmFuZ2UoZWxlbWVudDogRWxlbWVudCk6IExleGVyUmFuZ2Uge1xuICBjb25zdCBzdGFydCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuLmVuZDtcbiAgY29uc3QgZW5kID0gZWxlbWVudC5lbmRTb3VyY2VTcGFuIS5zdGFydDtcbiAgcmV0dXJuIHtcbiAgICBzdGFydFBvczogc3RhcnQub2Zmc2V0LFxuICAgIHN0YXJ0TGluZTogc3RhcnQubGluZSxcbiAgICBzdGFydENvbDogc3RhcnQuY29sLFxuICAgIGVuZFBvczogZW5kLm9mZnNldCxcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIFwiaGludFwiIG9iamVjdCBpcyB1c2VkIHRvIHBhc3MgaW5mb3JtYXRpb24gZnJvbSBgY2FuUGFyc2UoKWAgdG8gYHBhcnNlKClgIGZvclxuICogYFRyYW5zbGF0aW9uUGFyc2VyYHMgdGhhdCBleHBlY3QgWE1MIGNvbnRlbnRzLlxuICpcbiAqIFRoaXMgc2F2ZXMgdGhlIGBwYXJzZSgpYCBtZXRob2QgZnJvbSBoYXZpbmcgdG8gcmUtcGFyc2UgdGhlIFhNTC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQge1xuICBlbGVtZW50OiBFbGVtZW50O1xuICBlcnJvcnM6IFBhcnNlRXJyb3JbXTtcbn1cblxuLyoqXG4gKiBDYW4gdGhpcyBYTUwgYmUgcGFyc2VkIGZvciB0cmFuc2xhdGlvbnMsIGdpdmVuIHRoZSBleHBlY3RlZCBgcm9vdE5vZGVOYW1lYCBhbmQgZXhwZWN0ZWQgcm9vdCBub2RlXG4gKiBgYXR0cmlidXRlc2AgdGhhdCBzaG91bGQgYXBwZWFyIGluIHRoZSBmaWxlLlxuICpcbiAqIEBwYXJhbSBmaWxlUGF0aCBUaGUgcGF0aCB0byB0aGUgZmlsZSBiZWluZyBjaGVja2VkLlxuICogQHBhcmFtIGNvbnRlbnRzIFRoZSBjb250ZW50cyBvZiB0aGUgZmlsZSBiZWluZyBjaGVja2VkLlxuICogQHBhcmFtIHJvb3ROb2RlTmFtZSBUaGUgZXhwZWN0ZWQgbmFtZSBvZiBhbiBYTUwgcm9vdCBub2RlIHRoYXQgc2hvdWxkIGV4aXN0LlxuICogQHBhcmFtIGF0dHJpYnV0ZXMgVGhlIGF0dHJpYnV0ZXMgKGFuZCB0aGVpciB2YWx1ZXMpIHRoYXQgc2hvdWxkIGFwcGVhciBvbiB0aGUgcm9vdCBub2RlLlxuICogQHJldHVybnMgVGhlIGBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnRgIG9iamVjdCBmb3IgdXNlIGJ5IGBUcmFuc2xhdGlvblBhcnNlci5wYXJzZSgpYCBpZiB0aGUgWE1MXG4gKiBkb2N1bWVudCBoYXMgdGhlIGV4cGVjdGVkIGZvcm1hdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblBhcnNlWG1sKFxuICAgIGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIHJvb3ROb2RlTmFtZTogc3RyaW5nLFxuICAgIGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQYXJzZUFuYWx5c2lzPFhtbFRyYW5zbGF0aW9uUGFyc2VySGludD4ge1xuICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICBjb25zdCB4bWxQYXJzZXIgPSBuZXcgWG1sUGFyc2VyKCk7XG4gIGNvbnN0IHhtbCA9IHhtbFBhcnNlci5wYXJzZShjb250ZW50cywgZmlsZVBhdGgpO1xuXG4gIGlmICh4bWwucm9vdE5vZGVzLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgeG1sLmVycm9ycy5zb21lKGVycm9yID0+IGVycm9yLmxldmVsID09PSBQYXJzZUVycm9yTGV2ZWwuRVJST1IpKSB7XG4gICAgeG1sLmVycm9ycy5mb3JFYWNoKGUgPT4gYWRkUGFyc2VFcnJvcihkaWFnbm9zdGljcywgZSkpO1xuICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gIH1cblxuICBjb25zdCByb290RWxlbWVudHMgPSB4bWwucm9vdE5vZGVzLmZpbHRlcihpc05hbWVkRWxlbWVudChyb290Tm9kZU5hbWUpKTtcbiAgY29uc3Qgcm9vdEVsZW1lbnQgPSByb290RWxlbWVudHNbMF07XG4gIGlmIChyb290RWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZGlhZ25vc3RpY3Mud2FybihgVGhlIFhNTCBmaWxlIGRvZXMgbm90IGNvbnRhaW4gYSA8JHtyb290Tm9kZU5hbWV9PiByb290IG5vZGUuYCk7XG4gICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgfVxuXG4gIGZvciAoY29uc3QgYXR0cktleSBvZiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKSkge1xuICAgIGNvbnN0IGF0dHIgPSByb290RWxlbWVudC5hdHRycy5maW5kKGF0dHIgPT4gYXR0ci5uYW1lID09PSBhdHRyS2V5KTtcbiAgICBpZiAoYXR0ciA9PT0gdW5kZWZpbmVkIHx8IGF0dHIudmFsdWUgIT09IGF0dHJpYnV0ZXNbYXR0cktleV0pIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgcm9vdEVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICBgVGhlIDwke3Jvb3ROb2RlTmFtZX0+IG5vZGUgZG9lcyBub3QgaGF2ZSB0aGUgcmVxdWlyZWQgYXR0cmlidXRlOiAke2F0dHJLZXl9PVwiJHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlc1thdHRyS2V5XX1cIi5gLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcbiAgICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gICAgfVxuICB9XG5cbiAgaWYgKHJvb3RFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgeG1sLmVycm9ycy5wdXNoKG5ldyBQYXJzZUVycm9yKFxuICAgICAgICB4bWwucm9vdE5vZGVzWzFdLnNvdXJjZVNwYW4sXG4gICAgICAgICdVbmV4cGVjdGVkIHJvb3Qgbm9kZS4gWExJRkYgMS4yIGZpbGVzIHNob3VsZCBvbmx5IGhhdmUgYSBzaW5nbGUgPHhsaWZmPiByb290IG5vZGUuJyxcbiAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpKTtcbiAgfVxuXG4gIHJldHVybiB7Y2FuUGFyc2U6IHRydWUsIGRpYWdub3N0aWNzLCBoaW50OiB7ZWxlbWVudDogcm9vdEVsZW1lbnQsIGVycm9yczogeG1sLmVycm9yc319O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHByZWRpY2F0ZSwgd2hpY2ggY2FuIGJlIHVzZWQgYnkgdGhpbmdzIGxpa2UgYEFycmF5LmZpbHRlcigpYCwgdGhhdCB3aWxsIG1hdGNoIGEgbmFtZWRcbiAqIFhNTCBFbGVtZW50IGZyb20gYSBjb2xsZWN0aW9uIG9mIFhNTCBOb2Rlcy5cbiAqXG4gKiBAcGFyYW0gbmFtZSBUaGUgZXhwZWN0ZWQgbmFtZSBvZiB0aGUgZWxlbWVudCB0byBtYXRjaC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTmFtZWRFbGVtZW50KG5hbWU6IHN0cmluZyk6IChub2RlOiBOb2RlKSA9PiBub2RlIGlzIEVsZW1lbnQge1xuICBmdW5jdGlvbiBwcmVkaWNhdGUobm9kZTogTm9kZSk6IG5vZGUgaXMgRWxlbWVudCB7XG4gICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gbmFtZTtcbiAgfVxuICByZXR1cm4gcHJlZGljYXRlO1xufVxuXG4vKipcbiAqIEFkZCBhbiBYTUwgcGFyc2VyIHJlbGF0ZWQgbWVzc2FnZSB0byB0aGUgZ2l2ZW4gYGRpYWdub3N0aWNzYCBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBsZXZlbDogUGFyc2VFcnJvckxldmVsKTogdm9pZCB7XG4gIGFkZFBhcnNlRXJyb3IoZGlhZ25vc3RpY3MsIG5ldyBQYXJzZUVycm9yKHNvdXJjZVNwYW4sIG1lc3NhZ2UsIGxldmVsKSk7XG59XG5cbi8qKlxuICogQ29weSB0aGUgZm9ybWF0dGVkIGVycm9yIG1lc3NhZ2UgZnJvbSB0aGUgZ2l2ZW4gYHBhcnNlRXJyb3JgIG9iamVjdCBpbnRvIHRoZSBnaXZlbiBgZGlhZ25vc3RpY3NgXG4gKiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgcGFyc2VFcnJvcjogUGFyc2VFcnJvcik6IHZvaWQge1xuICBpZiAocGFyc2VFcnJvci5sZXZlbCA9PT0gUGFyc2VFcnJvckxldmVsLkVSUk9SKSB7XG4gICAgZGlhZ25vc3RpY3MuZXJyb3IocGFyc2VFcnJvci50b1N0cmluZygpKTtcbiAgfSBlbHNlIHtcbiAgICBkaWFnbm9zdGljcy53YXJuKHBhcnNlRXJyb3IudG9TdHJpbmcoKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgdGhlIHByb3ZpZGVkIGBlcnJvcnNgIHRvIHRoZSBgYnVuZGxlYCBkaWFnbm9zdGljcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEVycm9yc1RvQnVuZGxlKGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIGVycm9yczogUGFyc2VFcnJvcltdKTogdm9pZCB7XG4gIGZvciAoY29uc3QgZXJyb3Igb2YgZXJyb3JzKSB7XG4gICAgYWRkUGFyc2VFcnJvcihidW5kbGUuZGlhZ25vc3RpY3MsIGVycm9yKTtcbiAgfVxufVxuIl19