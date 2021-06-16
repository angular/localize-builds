/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseErrorLevel, visitAll } from '@angular/compiler';
import { Diagnostics } from '../../../diagnostics';
import { BaseVisitor } from '../base_visitor';
import { serializeTranslationMessage } from './serialize_translation_message';
import { addErrorsToBundle, addParseDiagnostic, addParseError, canParseXml, getAttribute, isNamedElement } from './translation_utils';
/**
 * A translation parser that can load XLIFF 1.2 files.
 *
 * https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
 * https://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
 *
 * @see Xliff1TranslationSerializer
 * @publicApi used by CLI
 */
export class Xliff1TranslationParser {
    /**
     * @deprecated
     */
    canParse(filePath, contents) {
        const result = this.analyze(filePath, contents);
        return result.canParse && result.hint;
    }
    analyze(filePath, contents) {
        return canParseXml(filePath, contents, 'xliff', { version: '1.2' });
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
        if (element.children.length === 0) {
            addParseDiagnostic(diagnostics, element.sourceSpan, 'Missing expected <file> element', ParseErrorLevel.WARNING);
            return { locale: undefined, translations: {}, diagnostics };
        }
        const files = element.children.filter(isNamedElement('file'));
        if (files.length === 0) {
            addParseDiagnostic(diagnostics, element.sourceSpan, 'No <file> elements found in <xliff>', ParseErrorLevel.WARNING);
        }
        else if (files.length > 1) {
            addParseDiagnostic(diagnostics, files[1].sourceSpan, 'More than one <file> element found in <xliff>', ParseErrorLevel.WARNING);
        }
        const bundle = { locale: undefined, translations: {}, diagnostics };
        const translationVisitor = new XliffTranslationVisitor();
        const localesFound = new Set();
        for (const file of files) {
            const locale = getAttribute(file, 'target-language');
            if (locale !== undefined) {
                localesFound.add(locale);
                bundle.locale = locale;
            }
            visitAll(translationVisitor, file.children, bundle);
        }
        if (localesFound.size > 1) {
            addParseDiagnostic(diagnostics, element.sourceSpan, `More than one locale found in translation file: ${JSON.stringify(Array.from(localesFound))}. Using "${bundle.locale}"`, ParseErrorLevel.WARNING);
        }
        return bundle;
    }
    extractBundleDeprecated(filePath, contents) {
        const hint = this.canParse(filePath, contents);
        if (!hint) {
            throw new Error(`Unable to parse "${filePath}" as XLIFF 1.2 format.`);
        }
        const bundle = this.extractBundle(hint);
        if (bundle.diagnostics.hasErrors) {
            const message = bundle.diagnostics.formatDiagnostics(`Failed to parse "${filePath}" as XLIFF 1.2 format`);
            throw new Error(message);
        }
        return bundle;
    }
}
class XliffFileElementVisitor extends BaseVisitor {
    visitElement(fileElement) {
        if (fileElement.name === 'file') {
            return { fileElement, locale: getAttribute(fileElement, 'target-language') };
        }
    }
}
class XliffTranslationVisitor extends BaseVisitor {
    visitElement(element, bundle) {
        if (element.name === 'trans-unit') {
            this.visitTransUnitElement(element, bundle);
        }
        else {
            visitAll(this, element.children, bundle);
        }
    }
    visitTransUnitElement(element, bundle) {
        // Error if no `id` attribute
        const id = getAttribute(element, 'id');
        if (id === undefined) {
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Missing required "id" attribute on <trans-unit> element.`, ParseErrorLevel.ERROR);
            return;
        }
        // Error if there is already a translation with the same id
        if (bundle.translations[id] !== undefined) {
            addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Duplicated translations for message "${id}"`, ParseErrorLevel.ERROR);
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
            inlineElements: ['g', 'bx', 'ex', 'bpt', 'ept', 'ph', 'it', 'mrk'],
            placeholder: { elementName: 'x', nameAttribute: 'id' }
        });
        if (translation !== null) {
            bundle.translations[id] = translation;
        }
        addErrorsToBundle(bundle, parseErrors);
        addErrorsToBundle(bundle, serializeErrors);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveGxpZmYxX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQVUsZUFBZSxFQUFFLFFBQVEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXJFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFNUUsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBMkIsTUFBTSxxQkFBcUIsQ0FBQztBQUU5Sjs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyx1QkFBdUI7SUFDbEM7O09BRUc7SUFDSCxRQUFRLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDeEMsT0FBTyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFFB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RyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUM7U0FDckQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDO1NBQ3ZDO1FBQ0QsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvckxldmVsLCB2aXNpdEFsbH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0Jhc2VWaXNpdG9yfSBmcm9tICcuLi9iYXNlX3Zpc2l0b3InO1xuXG5pbXBvcnQge3NlcmlhbGl6ZVRyYW5zbGF0aW9uTWVzc2FnZX0gZnJvbSAnLi9zZXJpYWxpemVfdHJhbnNsYXRpb25fbWVzc2FnZSc7XG5pbXBvcnQge1BhcnNlQW5hbHlzaXMsIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlLCBUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHthZGRFcnJvcnNUb0J1bmRsZSwgYWRkUGFyc2VEaWFnbm9zdGljLCBhZGRQYXJzZUVycm9yLCBjYW5QYXJzZVhtbCwgZ2V0QXR0cmlidXRlLCBpc05hbWVkRWxlbWVudCwgWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fSBmcm9tICcuL3RyYW5zbGF0aW9uX3V0aWxzJztcblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBsb2FkIFhMSUZGIDEuMiBmaWxlcy5cbiAqXG4gKiBodHRwczovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi9vcy94bGlmZi1jb3JlLmh0bWxcbiAqIGh0dHBzOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL3hsaWZmLXByb2ZpbGUtaHRtbC94bGlmZi1wcm9maWxlLWh0bWwtMS4yLmh0bWxcbiAqXG4gKiBAc2VlIFhsaWZmMVRyYW5zbGF0aW9uU2VyaWFsaXplclxuICogQHB1YmxpY0FwaSB1c2VkIGJ5IENMSVxuICovXG5leHBvcnQgY2xhc3MgWGxpZmYxVHJhbnNsYXRpb25QYXJzZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblBhcnNlcjxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50fGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQ+IHtcbiAgICByZXR1cm4gY2FuUGFyc2VYbWwoZmlsZVBhdGgsIGNvbnRlbnRzLCAneGxpZmYnLCB7dmVyc2lvbjogJzEuMid9KTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGhpbnQ/OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOlxuICAgICAgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGlmIChoaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlKGhpbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHRyYWN0QnVuZGxlRGVwcmVjYXRlZChmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZSh7ZWxlbWVudCwgZXJyb3JzfTogWG1sVHJhbnNsYXRpb25QYXJzZXJIaW50KTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgZXJyb3JzLmZvckVhY2goZSA9PiBhZGRQYXJzZUVycm9yKGRpYWdub3N0aWNzLCBlKSk7XG5cbiAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBkaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCAnTWlzc2luZyBleHBlY3RlZCA8ZmlsZT4gZWxlbWVudCcsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgICAgcmV0dXJuIHtsb2NhbGU6IHVuZGVmaW5lZCwgdHJhbnNsYXRpb25zOiB7fSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVzID0gZWxlbWVudC5jaGlsZHJlbi5maWx0ZXIoaXNOYW1lZEVsZW1lbnQoJ2ZpbGUnKSk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdObyA8ZmlsZT4gZWxlbWVudHMgZm91bmQgaW4gPHhsaWZmPicsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH0gZWxzZSBpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBmaWxlc1sxXS5zb3VyY2VTcGFuLCAnTW9yZSB0aGFuIG9uZSA8ZmlsZT4gZWxlbWVudCBmb3VuZCBpbiA8eGxpZmY+JyxcbiAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuV0FSTklORyk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVuZGxlOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSA9IHtsb2NhbGU6IHVuZGVmaW5lZCwgdHJhbnNsYXRpb25zOiB7fSwgZGlhZ25vc3RpY3N9O1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uVmlzaXRvciA9IG5ldyBYbGlmZlRyYW5zbGF0aW9uVmlzaXRvcigpO1xuICAgIGNvbnN0IGxvY2FsZXNGb3VuZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgY29uc3QgbG9jYWxlID0gZ2V0QXR0cmlidXRlKGZpbGUsICd0YXJnZXQtbGFuZ3VhZ2UnKTtcbiAgICAgIGlmIChsb2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsb2NhbGVzRm91bmQuYWRkKGxvY2FsZSk7XG4gICAgICAgIGJ1bmRsZS5sb2NhbGUgPSBsb2NhbGU7XG4gICAgICB9XG4gICAgICB2aXNpdEFsbCh0cmFuc2xhdGlvblZpc2l0b3IsIGZpbGUuY2hpbGRyZW4sIGJ1bmRsZSk7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsZXNGb3VuZC5zaXplID4gMSkge1xuICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgIGRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYE1vcmUgdGhhbiBvbmUgbG9jYWxlIGZvdW5kIGluIHRyYW5zbGF0aW9uIGZpbGU6ICR7XG4gICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KEFycmF5LmZyb20obG9jYWxlc0ZvdW5kKSl9LiBVc2luZyBcIiR7YnVuZGxlLmxvY2FsZX1cImAsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLldBUk5JTkcpO1xuICAgIH1cblxuICAgIHJldHVybiBidW5kbGU7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoaW50ID0gdGhpcy5jYW5QYXJzZShmaWxlUGF0aCwgY29udGVudHMpO1xuICAgIGlmICghaGludCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhMSUZGIDEuMiBmb3JtYXQuYCk7XG4gICAgfVxuICAgIGNvbnN0IGJ1bmRsZSA9IHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICBpZiAoYnVuZGxlLmRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKGBGYWlsZWQgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhMSUZGIDEuMiBmb3JtYXRgKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxufVxuXG5jbGFzcyBYbGlmZkZpbGVFbGVtZW50VmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KGZpbGVFbGVtZW50OiBFbGVtZW50KTogYW55IHtcbiAgICBpZiAoZmlsZUVsZW1lbnQubmFtZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICByZXR1cm4ge2ZpbGVFbGVtZW50LCBsb2NhbGU6IGdldEF0dHJpYnV0ZShmaWxlRWxlbWVudCwgJ3RhcmdldC1sYW5ndWFnZScpfTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgWGxpZmZUcmFuc2xhdGlvblZpc2l0b3IgZXh0ZW5kcyBCYXNlVmlzaXRvciB7XG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlKTogdm9pZCB7XG4gICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gJ3RyYW5zLXVuaXQnKSB7XG4gICAgICB0aGlzLnZpc2l0VHJhbnNVbml0RWxlbWVudChlbGVtZW50LCBidW5kbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCBidW5kbGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmlzaXRUcmFuc1VuaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUpOiB2b2lkIHtcbiAgICAvLyBFcnJvciBpZiBubyBgaWRgIGF0dHJpYnV0ZVxuICAgIGNvbnN0IGlkID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICdpZCcpO1xuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgYE1pc3NpbmcgcmVxdWlyZWQgXCJpZFwiIGF0dHJpYnV0ZSBvbiA8dHJhbnMtdW5pdD4gZWxlbWVudC5gLCBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB0cmFuc2xhdGlvbiB3aXRoIHRoZSBzYW1lIGlkXG4gICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbiwgYER1cGxpY2F0ZWQgdHJhbnNsYXRpb25zIGZvciBtZXNzYWdlIFwiJHtpZH1cImAsXG4gICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0TWVzc2FnZSA9IGVsZW1lbnQuY2hpbGRyZW4uZmluZChpc05hbWVkRWxlbWVudCgndGFyZ2V0JykpO1xuICAgIGlmICh0YXJnZXRNZXNzYWdlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFdhcm4gaWYgdGhlcmUgaXMgbm8gYDx0YXJnZXQ+YCBjaGlsZCBlbGVtZW50XG4gICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sICdNaXNzaW5nIDx0YXJnZXQ+IGVsZW1lbnQnLFxuICAgICAgICAgIFBhcnNlRXJyb3JMZXZlbC5XQVJOSU5HKTtcblxuICAgICAgLy8gRmFsbGJhY2sgdG8gdGhlIGA8c291cmNlPmAgZWxlbWVudCBpZiBhdmFpbGFibGUuXG4gICAgICB0YXJnZXRNZXNzYWdlID0gZWxlbWVudC5jaGlsZHJlbi5maW5kKGlzTmFtZWRFbGVtZW50KCdzb3VyY2UnKSk7XG4gICAgICBpZiAodGFyZ2V0TWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIEVycm9yIGlmIHRoZXJlIGlzIG5laXRoZXIgYDx0YXJnZXQ+YCBub3IgYDxzb3VyY2U+YC5cbiAgICAgICAgYWRkUGFyc2VEaWFnbm9zdGljKFxuICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAnTWlzc2luZyByZXF1aXJlZCBlbGVtZW50OiBvbmUgb2YgPHRhcmdldD4gb3IgPHNvdXJjZT4gaXMgcmVxdWlyZWQnLFxuICAgICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHt0cmFuc2xhdGlvbiwgcGFyc2VFcnJvcnMsIHNlcmlhbGl6ZUVycm9yc30gPSBzZXJpYWxpemVUcmFuc2xhdGlvbk1lc3NhZ2UodGFyZ2V0TWVzc2FnZSwge1xuICAgICAgaW5saW5lRWxlbWVudHM6IFsnZycsICdieCcsICdleCcsICdicHQnLCAnZXB0JywgJ3BoJywgJ2l0JywgJ21yayddLFxuICAgICAgcGxhY2Vob2xkZXI6IHtlbGVtZW50TmFtZTogJ3gnLCBuYW1lQXR0cmlidXRlOiAnaWQnfVxuICAgIH0pO1xuICAgIGlmICh0cmFuc2xhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gPSB0cmFuc2xhdGlvbjtcbiAgICB9XG4gICAgYWRkRXJyb3JzVG9CdW5kbGUoYnVuZGxlLCBwYXJzZUVycm9ycyk7XG4gICAgYWRkRXJyb3JzVG9CdW5kbGUoYnVuZGxlLCBzZXJpYWxpemVFcnJvcnMpO1xuICB9XG59XG4iXX0=