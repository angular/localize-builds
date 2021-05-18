/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseErrorLevel, visitAll } from '@angular/compiler';
import { extname } from 'path';
import { Diagnostics } from '../../../diagnostics';
import { BaseVisitor } from '../base_visitor';
import { serializeTranslationMessage } from './serialize_translation_message';
import { addErrorsToBundle, addParseDiagnostic, addParseError, canParseXml, getAttribute } from './translation_utils';
/**
 * A translation parser that can load XTB files.
 *
 * http://cldr.unicode.org/development/development-process/design-proposals/xmb
 *
 * @see XmbTranslationSerializer
 * @publicApi used by CLI
 */
export class XtbTranslationParser {
    /**
     * @deprecated
     */
    canParse(filePath, contents) {
        const result = this.analyze(filePath, contents);
        return result.canParse && result.hint;
    }
    analyze(filePath, contents) {
        const extension = extname(filePath);
        if (extension !== '.xtb' && extension !== '.xmb') {
            const diagnostics = new Diagnostics();
            diagnostics.warn('Must have xtb or xmb extension.');
            return { canParse: false, diagnostics };
        }
        return canParseXml(filePath, contents, 'translationbundle', {});
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
        const langAttr = element.attrs.find((attr) => attr.name === 'lang');
        const bundle = {
            locale: langAttr && langAttr.value,
            translations: {},
            diagnostics: new Diagnostics()
        };
        errors.forEach(e => addParseError(bundle.diagnostics, e));
        const bundleVisitor = new XtbVisitor();
        visitAll(bundleVisitor, element.children, bundle);
        return bundle;
    }
    extractBundleDeprecated(filePath, contents) {
        const hint = this.canParse(filePath, contents);
        if (!hint) {
            throw new Error(`Unable to parse "${filePath}" as XMB/XTB format.`);
        }
        const bundle = this.extractBundle(hint);
        if (bundle.diagnostics.hasErrors) {
            const message = bundle.diagnostics.formatDiagnostics(`Failed to parse "${filePath}" as XMB/XTB format`);
            throw new Error(message);
        }
        return bundle;
    }
}
class XtbVisitor extends BaseVisitor {
    visitElement(element, bundle) {
        switch (element.name) {
            case 'translation':
                // Error if no `id` attribute
                const id = getAttribute(element, 'id');
                if (id === undefined) {
                    addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Missing required "id" attribute on <translation> element.`, ParseErrorLevel.ERROR);
                    return;
                }
                // Error if there is already a translation with the same id
                if (bundle.translations[id] !== undefined) {
                    addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Duplicated translations for message "${id}"`, ParseErrorLevel.ERROR);
                    return;
                }
                const { translation, parseErrors, serializeErrors } = serializeTranslationMessage(element, { inlineElements: [], placeholder: { elementName: 'ph', nameAttribute: 'name' } });
                if (parseErrors.length) {
                    // We only want to warn (not error) if there were problems parsing the translation for
                    // XTB formatted files. See https://github.com/angular/angular/issues/14046.
                    bundle.diagnostics.warn(computeParseWarning(id, parseErrors));
                }
                else if (translation !== null) {
                    // Only store the translation if there were no parse errors
                    bundle.translations[id] = translation;
                }
                addErrorsToBundle(bundle, serializeErrors);
                break;
            default:
                addParseDiagnostic(bundle.diagnostics, element.sourceSpan, `Unexpected <${element.name}> tag.`, ParseErrorLevel.ERROR);
        }
    }
}
function computeParseWarning(id, errors) {
    const msg = errors.map(e => e.toString()).join('\n');
    return `Could not parse message with id "${id}" - perhaps it has an unrecognised ICU format?\n` +
        msg;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMveHRiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQXNCLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTdCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFNUUsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUEyQixNQUFNLHFCQUFxQixDQUFDO0FBRzlJOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLE9BQU8sb0JBQW9CO0lBQy9COztPQUVHO0lBQ0gsUUFBUSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEQsT0FBTyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsS0FBSyxNQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNwRCxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBK0I7UUFFdkUsSUFBSSxJQUFJLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUM7SUFFTyxhQUFhLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUEyQjtRQUMvRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQztRQUNwRSxNQUFNLE1BQU0sR0FBNEI7WUFDdEMsTUFBTSxFQUFFLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSztZQUNsQyxZQUFZLEVBQUUsRUFBRTtZQUNoQixXQUFXLEVBQUUsSUFBSSxXQUFXLEVBQUU7U0FDL0IsQ0FBQztRQUNGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFELE1BQU0sYUFBYSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDdkMsUUFBUSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ2hFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixRQUFRLHNCQUFzQixDQUFDLENBQUM7U0FDckU7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDaEMsTUFBTSxPQUFPLEdBQ1QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsUUFBUSxxQkFBcUIsQ0FBQyxDQUFDO1lBQzVGLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVcsU0FBUSxXQUFXO0lBQ2xDLFlBQVksQ0FBQyxPQUFnQixFQUFFLE1BQStCO1FBQzVELFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNwQixLQUFLLGFBQWE7Z0JBQ2hCLDZCQUE2QjtnQkFDN0IsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO29CQUNwQixrQkFBa0IsQ0FDZCxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQ3RDLDJEQUEyRCxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEYsT0FBTztpQkFDUjtnQkFFRCwyREFBMkQ7Z0JBQzNELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQ3pDLGtCQUFrQixDQUNkLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSx3Q0FBd0MsRUFBRSxHQUFHLEVBQ3JGLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsT0FBTztpQkFDUjtnQkFFRCxNQUFNLEVBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUMsR0FBRywyQkFBMkIsQ0FDM0UsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQzVGLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtvQkFDdEIsc0ZBQXNGO29CQUN0Riw0RUFBNEU7b0JBQzVFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDtxQkFBTSxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7b0JBQy9CLDJEQUEyRDtvQkFDM0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUM7aUJBQ3ZDO2dCQUNELGlCQUFpQixDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDM0MsTUFBTTtZQUVSO2dCQUNFLGtCQUFrQixDQUNkLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxlQUFlLE9BQU8sQ0FBQyxJQUFJLFFBQVEsRUFDM0UsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztDQUNGO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxFQUFVLEVBQUUsTUFBb0I7SUFDM0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxPQUFPLG9DQUFvQyxFQUFFLGtEQUFrRDtRQUMzRixHQUFHLENBQUM7QUFDVixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0VsZW1lbnQsIFBhcnNlRXJyb3IsIFBhcnNlRXJyb3JMZXZlbCwgdmlzaXRBbGx9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7ZXh0bmFtZX0gZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7QmFzZVZpc2l0b3J9IGZyb20gJy4uL2Jhc2VfdmlzaXRvcic7XG5cbmltcG9ydCB7c2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlfSBmcm9tICcuL3NlcmlhbGl6ZV90cmFuc2xhdGlvbl9tZXNzYWdlJztcbmltcG9ydCB7UGFyc2VBbmFseXNpcywgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge2FkZEVycm9yc1RvQnVuZGxlLCBhZGRQYXJzZURpYWdub3N0aWMsIGFkZFBhcnNlRXJyb3IsIGNhblBhcnNlWG1sLCBnZXRBdHRyaWJ1dGUsIFhtbFRyYW5zbGF0aW9uUGFyc2VySGludH0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cblxuLyoqXG4gKiBBIHRyYW5zbGF0aW9uIHBhcnNlciB0aGF0IGNhbiBsb2FkIFhUQiBmaWxlcy5cbiAqXG4gKiBodHRwOi8vY2xkci51bmljb2RlLm9yZy9kZXZlbG9wbWVudC9kZXZlbG9wbWVudC1wcm9jZXNzL2Rlc2lnbi1wcm9wb3NhbHMveG1iXG4gKlxuICogQHNlZSBYbWJUcmFuc2xhdGlvblNlcmlhbGl6ZXJcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGNsYXNzIFh0YlRyYW5zbGF0aW9uUGFyc2VyIGltcGxlbWVudHMgVHJhbnNsYXRpb25QYXJzZXI8WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50PiB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludHxmYWxzZSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hbmFseXplKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgcmV0dXJuIHJlc3VsdC5jYW5QYXJzZSAmJiByZXN1bHQuaGludDtcbiAgfVxuXG4gIGFuYWx5emUoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFBhcnNlQW5hbHlzaXM8WG1sVHJhbnNsYXRpb25QYXJzZXJIaW50PiB7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gZXh0bmFtZShmaWxlUGF0aCk7XG4gICAgaWYgKGV4dGVuc2lvbiAhPT0gJy54dGInICYmIGV4dGVuc2lvbiAhPT0gJy54bWInKSB7XG4gICAgICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICAgICAgZGlhZ25vc3RpY3Mud2FybignTXVzdCBoYXZlIHh0YiBvciB4bWIgZXh0ZW5zaW9uLicpO1xuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gICAgcmV0dXJuIGNhblBhcnNlWG1sKGZpbGVQYXRoLCBjb250ZW50cywgJ3RyYW5zbGF0aW9uYnVuZGxlJywge30pO1xuICB9XG5cbiAgcGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZywgaGludD86IFhtbFRyYW5zbGF0aW9uUGFyc2VySGludCk6XG4gICAgICBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgaWYgKGhpbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGUoaGludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmV4dHJhY3RCdW5kbGVEZXByZWNhdGVkKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0QnVuZGxlKHtlbGVtZW50LCBlcnJvcnN9OiBYbWxUcmFuc2xhdGlvblBhcnNlckhpbnQpOiBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgbGFuZ0F0dHIgPSBlbGVtZW50LmF0dHJzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gJ2xhbmcnKTtcbiAgICBjb25zdCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlID0ge1xuICAgICAgbG9jYWxlOiBsYW5nQXR0ciAmJiBsYW5nQXR0ci52YWx1ZSxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBkaWFnbm9zdGljczogbmV3IERpYWdub3N0aWNzKClcbiAgICB9O1xuICAgIGVycm9ycy5mb3JFYWNoKGUgPT4gYWRkUGFyc2VFcnJvcihidW5kbGUuZGlhZ25vc3RpY3MsIGUpKTtcblxuICAgIGNvbnN0IGJ1bmRsZVZpc2l0b3IgPSBuZXcgWHRiVmlzaXRvcigpO1xuICAgIHZpc2l0QWxsKGJ1bmRsZVZpc2l0b3IsIGVsZW1lbnQuY2hpbGRyZW4sIGJ1bmRsZSk7XG4gICAgcmV0dXJuIGJ1bmRsZTtcbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdEJ1bmRsZURlcHJlY2F0ZWQoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAgIGNvbnN0IGhpbnQgPSB0aGlzLmNhblBhcnNlKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgaWYgKCFoaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBwYXJzZSBcIiR7ZmlsZVBhdGh9XCIgYXMgWE1CL1hUQiBmb3JtYXQuYCk7XG4gICAgfVxuICAgIGNvbnN0IGJ1bmRsZSA9IHRoaXMuZXh0cmFjdEJ1bmRsZShoaW50KTtcbiAgICBpZiAoYnVuZGxlLmRpYWdub3N0aWNzLmhhc0Vycm9ycykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLmZvcm1hdERpYWdub3N0aWNzKGBGYWlsZWQgdG8gcGFyc2UgXCIke2ZpbGVQYXRofVwiIGFzIFhNQi9YVEIgZm9ybWF0YCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBidW5kbGU7XG4gIH1cbn1cblxuY2xhc3MgWHRiVmlzaXRvciBleHRlbmRzIEJhc2VWaXNpdG9yIHtcbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIGJ1bmRsZTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUpOiBhbnkge1xuICAgIHN3aXRjaCAoZWxlbWVudC5uYW1lKSB7XG4gICAgICBjYXNlICd0cmFuc2xhdGlvbic6XG4gICAgICAgIC8vIEVycm9yIGlmIG5vIGBpZGAgYXR0cmlidXRlXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0QXR0cmlidXRlKGVsZW1lbnQsICdpZCcpO1xuICAgICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFkZFBhcnNlRGlhZ25vc3RpYyhcbiAgICAgICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLCBlbGVtZW50LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgIGBNaXNzaW5nIHJlcXVpcmVkIFwiaWRcIiBhdHRyaWJ1dGUgb24gPHRyYW5zbGF0aW9uPiBlbGVtZW50LmAsIFBhcnNlRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXJyb3IgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRyYW5zbGF0aW9uIHdpdGggdGhlIHNhbWUgaWRcbiAgICAgICAgaWYgKGJ1bmRsZS50cmFuc2xhdGlvbnNbaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgICAgIGJ1bmRsZS5kaWFnbm9zdGljcywgZWxlbWVudC5zb3VyY2VTcGFuLCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCxcbiAgICAgICAgICAgICAgUGFyc2VFcnJvckxldmVsLkVSUk9SKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7dHJhbnNsYXRpb24sIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnN9ID0gc2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlKFxuICAgICAgICAgICAgZWxlbWVudCwge2lubGluZUVsZW1lbnRzOiBbXSwgcGxhY2Vob2xkZXI6IHtlbGVtZW50TmFtZTogJ3BoJywgbmFtZUF0dHJpYnV0ZTogJ25hbWUnfX0pO1xuICAgICAgICBpZiAocGFyc2VFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHdhcm4gKG5vdCBlcnJvcikgaWYgdGhlcmUgd2VyZSBwcm9ibGVtcyBwYXJzaW5nIHRoZSB0cmFuc2xhdGlvbiBmb3JcbiAgICAgICAgICAvLyBYVEIgZm9ybWF0dGVkIGZpbGVzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQwNDYuXG4gICAgICAgICAgYnVuZGxlLmRpYWdub3N0aWNzLndhcm4oY29tcHV0ZVBhcnNlV2FybmluZyhpZCwgcGFyc2VFcnJvcnMpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cmFuc2xhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIE9ubHkgc3RvcmUgdGhlIHRyYW5zbGF0aW9uIGlmIHRoZXJlIHdlcmUgbm8gcGFyc2UgZXJyb3JzXG4gICAgICAgICAgYnVuZGxlLnRyYW5zbGF0aW9uc1tpZF0gPSB0cmFuc2xhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBhZGRFcnJvcnNUb0J1bmRsZShidW5kbGUsIHNlcmlhbGl6ZUVycm9ycyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhZGRQYXJzZURpYWdub3N0aWMoXG4gICAgICAgICAgICBidW5kbGUuZGlhZ25vc3RpY3MsIGVsZW1lbnQuc291cmNlU3BhbiwgYFVuZXhwZWN0ZWQgPCR7ZWxlbWVudC5uYW1lfT4gdGFnLmAsXG4gICAgICAgICAgICBQYXJzZUVycm9yTGV2ZWwuRVJST1IpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlUGFyc2VXYXJuaW5nKGlkOiBzdHJpbmcsIGVycm9yczogUGFyc2VFcnJvcltdKTogc3RyaW5nIHtcbiAgY29uc3QgbXNnID0gZXJyb3JzLm1hcChlID0+IGUudG9TdHJpbmcoKSkuam9pbignXFxuJyk7XG4gIHJldHVybiBgQ291bGQgbm90IHBhcnNlIG1lc3NhZ2Ugd2l0aCBpZCBcIiR7aWR9XCIgLSBwZXJoYXBzIGl0IGhhcyBhbiB1bnJlY29nbmlzZWQgSUNVIGZvcm1hdD9cXG5gICtcbiAgICAgIG1zZztcbn1cbiJdfQ==