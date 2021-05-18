/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, ParseErrorLevel, visitAll } from '@angular/compiler';
import { Diagnostics } from '../../../diagnostics';
import { BaseVisitor } from '../base_visitor';
import { serializeTranslationMessage } from './serialize_translation_message';
import { addErrorsToBundle, addParseDiagnostic, addParseError, canParseXml, getAttribute, isNamedElement } from './translation_utils';
/**
 * A translation parser that can load translations from XLIFF 2 files.
 *
 * https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
 *
 * @see Xliff2TranslationSerializer
 * @publicApi used by CLI
 */
export class Xliff2TranslationParser {
    /**
     * @deprecated
     */
    canParse(filePath, contents) {
        const result = this.analyze(filePath, contents);
        return result.canParse && result.hint;
    }
    analyze(filePath, contents) {
        return canParseXml(filePath, contents, 'xliff', { version: '2.0' });
    }
    parse(filePath, contents, hint) {
        if (hint) {
            return this.extractBundle(hint);
        }
        else {
            return this.extractBundleDeprecated(filePath, contents);
        }
    }
    extractBundle({ element, errors }) {
        const diagnostics = new Diagnostics();
        errors.forEach(e => addParseError(diagnostics, e));
        const locale = getAttribute(element, 'trgLang');
        const files = element.children.filter(isFileElement);
        if (files.length === 0) {
            addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', ParseErrorLevel.WARNING);
        }
        else if (files.length > 1) {
            addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', ParseErrorLevel.WARNING);
        }
        const bundle = { locale, translations: {}, diagnostics };
        const translationVisitor = new Xliff2TranslationVisitor();
        for (const file of files) {
            visitAll(translationVisitor, file.children, { bundle });
        }
        return bundle;
    }
    extractBundleDeprecated(filePath, contents) {
        const hint = this.canParse(filePath, contents);
        if (!hint) {
            throw new Error(`Unable to parse "${filePath}" as XLIFF 2.0 format.`);
        }
        const bundle = this.extractBundle(hint);
        if (bundle.diagnostics.hasErrors) {
            const message = bundle.diagnostics.formatDiagnostics(`Failed to parse "${filePath}" as XLIFF 2.0 format`);
            throw new Error(message);
        }
        return bundle;
    }
}
class Xliff2TranslationVisitor extends BaseVisitor {
    visitElement(element, { bundle, unit }) {
        if (element.name === 'unit') {
            this.visitUnitElement(element, bundle);
        }
        else if (element.name === 'segment') {
            this.visitSegmentElement(element, bundle, unit);
        }
        else {
            visitAll(this, element.children, { bundle, unit });
        }
    }
    visitUnitElement(element, bundle) {
        // Error if no `id` attribute
        const externalId = getAttribute(element, 'id');
        if (externalId === undefined) {
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Missing required "id" attribute on <trans-unit> element.`, ParseErrorLevel.ERROR);
            return;
        }
        // Error if there is already a translation with the same id
        if (bundle.translations[externalId] !== undefined) {
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Duplicated translations for message "${externalId}"`, ParseErrorLevel.ERROR);
            return;
        }
        visitAll(this, element.children, { bundle, unit: externalId });
    }
    visitSegmentElement(element, bundle, unit) {
        // A `<segment>` element must be below a `<unit>` element
        if (unit === undefined) {
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Invalid <segment> element: should be a child of a <unit> element.', ParseErrorLevel.ERROR);
            return;
        }
        let targetMessage = element.children.find(isNamedElement('target'));
        if (targetMessage === undefined) {
            // Warn if there is no `<target>` child element
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing <target> element', ParseErrorLevel.WARNING);
            // Fallback to the `<source>` element if available.
            targetMessage = element.children.find(isNamedElement('source'));
            if (targetMessage === undefined) {
                // Error if there is neither `<target>` nor `<source>`.
                addParseDiagnostic(bundle.diagnostics, element.sourceSpan, 'Missing required element: one of <target> or <source> is required', ParseErrorLevel.ERROR);
                return;
            }
        }
        const { translation, parseErrors, serializeErrors } = serializeTranslationMessage(targetMessage, {
            inlineElements: ['cp', 'sc', 'ec', 'mrk', 'sm', 'em'],
            placeholder: { elementName: 'ph', nameAttribute: 'equiv', bodyAttribute: 'disp' },
            placeholderContainer: { elementName: 'pc', startAttribute: 'equivStart', endAttribute: 'equivEnd' }
        });
        if (translation !== null) {
            bundle.translations[unit] = translation;
        }
        addErrorsToBundle(bundle, parseErrors);
        addErrorsToBundle(bundle, serializeErrors);
    }
}
function isFileElement(node) {
    return node instanceof Element && node.name === 'file';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYyX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsT0FBTyxFQUFRLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUUzRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTVDLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBRTVFLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQTJCLE1BQU0scUJBQXFCLENBQUM7QUFFOUo7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBTyx1QkFBdUI7SUFDbEM7O09BRUc7SUFDSCxRQUFRLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDeEMsT0FBTyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsS0FB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QUFhLENBQUMsSUFBVTtJQUMvQixPQUFPLElBQUksWUFBWSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtFbGVtZW50LCBOb2RlLCBQYXJzZUVycm9yTGV2ZWwsIHZpc2l0QWxsfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5cbmltcG9ydCB7c2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlfSBmcm9tICcuL3NlcmlhbGl6ZV90cmFuc2xhdGlvbl9tZXNzYWdlJztcbmltcG9ydCB7UGFyc2VBbmFseXNpcywgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge2FkZEVycm9yc1RvQnVuZGxlLCBhZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIGlzTmFtZWRFbGVtZW50LCBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnR9IGZyb20gJy4vdHJhbnNsYXRpb25fdXRpbHMnO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIGxvYWQgdHJhbnNsYXRpb25zIGZyb20gWExJRkYgMiBmaWxlcy5cbiAqXG4gKiBodHRwczovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG4gKlxuICogQHNlZSBYbGlmZjJUcmFuc2xhdGlvblNlcmlhbGl6ZXJcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGNsYXNzIFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXI8WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50PiB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludHxmYWxzZSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hbmFseXplKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgcmV0dXJuIHJlc3VsdC5jYW5QYXJzZSAmJiByZXN1bHQuaGludDtcbiAgfVxuXG4gIGFuYWx5emUoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFBhcnNlQW5hbHlzaXM8WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50PiB7XG4gICAgcmV0dXJuIGNhblBhcnNlWG1sKGZpbGVQYXRoLCBjb250ZW50cywgJ3hsaWZmJywge3ZlcnNpb246ICcyLjAnfSk7XG4gIH1cblxuICBwYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nLCBoaW50PzogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTpcbiAgICAgIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBpZiAoaGludCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGUoe2VsZW1lbnQsIGVycm9yc306IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICAgIGVycm9ycy5mb3JFYWNoKGUgPT4gYWRkUGFyc2VFcnJvcihkaWFnbm9zdGljcywgZSkpO1xuXG4gICAgY29uc3QgbG9jYWxlID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICd0cmdMYW5nJyk7XG4gICAgY29uc3QgZmlsZXMgPSBlbGVtZW50LmNoaWxkcmVuLmZpbHRlcihpc0ZpbGVFbGVtZW50KTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbiwgJ05vIDxmaWxlPiBlbGVtZW50cyBmb3VuZCBpbiA8eGxpZmY+JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfSBlbHNlIGlmIChmaWxlcy5sZW5ndGggPiAxKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgZGlhZ25vc3RpY3MsIGZpbGVzWzFdLnNvdXJjZVNwYW4sICdNb3JlIHRoYW4gb25lIDxmaWxlPiBlbGVtZW50IGZvdW5kIGluIDx4bGlmZj4nLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcbiAgICB9XG5cbiAgICBjb25zdCBidW5kbGUgPSB7bG9jYWxlLCB0cmFuc2xhdGlvbnM6IHt9LCBkaWFnbm9zdGljc307XG4gICAgY29uc3QgdHJhbnNsYXRpb25WaXNpdG9yID0gbmV3IFhsaWZmMlRyYW5zbGF0aW9uVmlzaXRvcigpO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgdmlzaXRBbGwodHJhbnNsYXRpb25WaXNpdG9yLCBmaWxlLmNoaWxkcmVuLCB7YnVuZGxlfSk7XG4gICAgfVxuICAgIHJldHVybiBidW5kbGU7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoaW50ID0gdGhpcy5jYW5QYXJzZShmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIGlmICghaGludCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhMSUZGIDIuMCBmb3JtYXQuYCk7XG4gICAgfVxuICAgIGNvbnN0IGJ1bmRsZSA9IHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICBpZiAoYnVuZGxlLmRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKGBGYWlsZWQgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhMSUZGIDIuMCBmb3JtYXRgKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5cbmludGVyZmFjZSBUcmFuc2xhdGlvblZpc2l0b3JDb250ZXh0IHtcbiAgdW5pdD86IHN0cmluZztcbiAgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZTtcbn1cblxuY2xhc3MgWGxpZmYyVHJhbnNsYXRpb25WaXNpdG9yIGV4dGVuZHMgQmFzZVZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwge2J1bmRsZSwgdW5pdH06IFRyYW5zbGF0aW9uVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGlmIChlbGVtZW50Lm5hbWUgPT09ICd1bml0Jykge1xuICAgICAgdGhpcy52aXNpdFVuaXRFbGVtZW50KGVsZW1lbnQsIGJ1bmRsZSk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT09ICdzZWdtZW50Jykge1xuICAgICAgdGhpcy52aXNpdFNlZ21lbnRFbGVtZW50KGVsZW1lbnQsIGJ1bmRsZSwgdW5pdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIHtidW5kbGUsIHVuaXR9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZpc2l0VW5pdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSk6IHZvaWQge1xuICAgIC8vIEVycm9yIGlmIG5vIGBpZGAgYXR0cmlidXRlXG4gICAgY29uc3QgZXh0ZXJuYWxJZCA9IGdldEF0dHJpYnV0ZShlbGVtZW50LCAnaWQnKTtcbiAgICBpZiAoZXh0ZXJuYWxJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYE1pc3NpbmcgcmVxdWlyZWQgXCJpZFwiIGF0dHJpYnV0ZSBvbiA8dHJhbnMtdW5pdD4gZWxlbWVudC5gLCBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB0cmFuc2xhdGlvbiB3aXRoIHRoZSBzYW1lIGlkXG4gICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbZXh0ZXJuYWxJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbWVzc2FnZSBcIiR7ZXh0ZXJuYWxJZH1cImAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwge2J1bmRsZSwgdW5pdDogZXh0ZXJuYWxJZH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB2aXNpdFNlZ21lbnRFbGVtZW50KFxuICAgICAgZWxlbWVudDogRWxlbWVudCwgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgdW5pdDogc3RyaW5nfHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIC8vIEEgYDxzZWdtZW50PmAgZWxlbWVudCBtdXN0IGJlIGJlbG93IGEgYDx1bml0PmAgZWxlbWVudFxuICAgIGlmICh1bml0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbixcbiAgICAgICAgICAnSW52YWxpZCA8c2VnbWVudD4gZWxlbWVudDogc2hvdWxkIGJlIGEgY2hpbGQgb2YgYSA8dW5pdD4gZWxlbWVudC4nLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRhcmdldE1lc3NhZ2UgPSBlbGVtZW50LmNoaWxkcmVuLmZpbmQoaXNOYW1lZEVsZW1lbnQoJ3RhcmdldCcpKTtcbiAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBXYXJuIGlmIHRoZXJlIGlzIG5vIGA8dGFyZ2V0PmAgY2hpbGQgZWxlbWVudFxuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTWlzc2luZyA8dGFyZ2V0PiBlbGVtZW50JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG5cbiAgICAgIC8vIEZhbGxiYWNrIHRvIHRoZSBgPHNvdXJjZT5gIGVsZW1lbnQgaWYgYXZhaWxhYmxlLlxuICAgICAgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc05hbWVkRWxlbWVudCgnc291cmNlJykpO1xuICAgICAgaWYgKHRhcmdldE1lc3NhZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBFcnJvciBpZiB0aGVyZSBpcyBuZWl0aGVyIGA8dGFyZ2V0PmAgbm9yIGA8c291cmNlPmAuXG4gICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgJ01pc3NpbmcgcmVxdWlyZWQgZWxlbWVudDogb25lIG9mIDx0YXJnZXQ+IG9yIDxzb3VyY2U+IGlzIHJlcXVpcmVkJyxcbiAgICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7dHJhbnNsYXRpb24sIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnN9ID0gc2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlKHRhcmdldE1lc3NhZ2UsIHtcbiAgICAgIGlubGluZUVsZW1lbnRzOiBbJ2NwJywgJ3NjJywgJ2VjJywgJ21yaycsICdzbScsICdlbSddLFxuICAgICAgcGxhY2Vob2xkZXI6IHtlbGVtZW50TmFtZTogJ3BoJywgbmFtZUF0dHJpYnV0ZTogJ2VxdWl2JywgYm9keUF0dHJpYnV0ZTogJ2Rpc3AnfSxcbiAgICAgIHBsYWNlaG9sZGVyQ29udGFpbmVyOlxuICAgICAgICAgIHtlbGVtZW50TmFtZTogJ3BjJywgc3RhcnRBdHRyaWJ1dGU6ICdlcXVpdlN0YXJ0JywgZW5kQXR0cmlidXRlOiAnZXF1aXZFbmQnfVxuICAgIH0pO1xuICAgIGlmICh0cmFuc2xhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgYnVuZGxlLnRyYW5zbGF0aW9uc1t1bml0XSA9IHRyYW5zbGF0aW9uO1xuICAgIH1cbiAgICBhZGRFcnJvcnNUb0J1bmRsZShidW5kbGUsIHBhcnNlRXJyb3JzKTtcbiAgICBhZGRFcnJvcnNUb0J1bmRsZShidW5kbGUsIHNlcmlhbGl6ZUVycm9ycyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNGaWxlRWxlbWVudChub2RlOiBOb2RlKTogbm9kZSBpcyBFbGVtZW50IHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIG5vZGUubmFtZSA9PT0gJ2ZpbGUnO1xufVxuIl19