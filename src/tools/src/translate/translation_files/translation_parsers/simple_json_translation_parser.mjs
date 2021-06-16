/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵparseTranslation } from '@angular/localize';
import { extname } from 'path';
import { Diagnostics } from '../../../diagnostics';
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
 *
 * @see SimpleJsonTranslationSerializer
 * @publicApi used by CLI
 */
export class SimpleJsonTranslationParser {
    /**
     * @deprecated
     */
    canParse(filePath, contents) {
        const result = this.analyze(filePath, contents);
        return result.canParse && result.hint;
    }
    analyze(filePath, contents) {
        const diagnostics = new Diagnostics();
        // For this to be parsable, the extension must be `.json` and the contents must include "locale"
        // and "translations" keys.
        if (extname(filePath) !== '.json' ||
            !(contents.includes('"locale"') && contents.includes('"translations"'))) {
            diagnostics.warn('File does not have .json extension.');
            return { canParse: false, diagnostics };
        }
        try {
            const json = JSON.parse(contents);
            if (json.locale === undefined) {
                diagnostics.warn('Required "locale" property missing.');
                return { canParse: false, diagnostics };
            }
            if (typeof json.locale !== 'string') {
                diagnostics.warn('The "locale" property is not a string.');
                return { canParse: false, diagnostics };
            }
            if (json.translations === undefined) {
                diagnostics.warn('Required "translations" property missing.');
                return { canParse: false, diagnostics };
            }
            if (typeof json.translations !== 'object') {
                diagnostics.warn('The "translations" is not an object.');
                return { canParse: false, diagnostics };
            }
            return { canParse: true, diagnostics, hint: json };
        }
        catch (e) {
            diagnostics.warn('File is not valid JSON.');
            return { canParse: false, diagnostics };
        }
    }
    parse(_filePath, contents, json) {
        const { locale: parsedLocale, translations } = json || JSON.parse(contents);
        const parsedTranslations = {};
        for (const messageId in translations) {
            const targetMessage = translations[messageId];
            parsedTranslations[messageId] = ɵparseTranslation(targetMessage);
        }
        return { locale: parsedLocale, translations: parsedTranslations, diagnostics: new Diagnostics() };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2pzb25fdHJhbnNsYXRpb25fcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3Rvb2xzL3NyYy90cmFuc2xhdGUvdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFpQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBU2pEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sT0FBTywyQkFBMkI7SUFDdEM7O09BRUc7SUFDSCxRQUFRLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUN0QyxnR0FBZ0c7UUFDaEcsMkJBQTJCO1FBQzNCLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU87WUFDN0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7WUFDM0UsV0FBVyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFtQixDQUFDO1lBQ3BELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDeEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUM7YUFDdkM7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLFdBQVcsQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDM0QsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUM7YUFDdkM7WUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO2dCQUNuQyxXQUFXLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7Z0JBQzlELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDO2FBQ3ZDO1lBQ0QsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssUUFBUSxFQUFFO2dCQUN6QyxXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Z0JBQ3pELE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDO2FBQ3ZDO1lBQ0QsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztTQUNsRDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsV0FBVyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsSUFBcUI7UUFDOUQsTUFBTSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFtQixDQUFDO1FBQzVGLE1BQU0sa0JBQWtCLEdBQTJDLEVBQUUsQ0FBQztRQUN0RSxLQUFLLE1BQU0sU0FBUyxJQUFJLFlBQVksRUFBRTtZQUNwQyxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbEU7UUFDRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLElBQUksV0FBVyxFQUFFLEVBQUMsQ0FBQztJQUNsRyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24sIMm1cGFyc2VUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdwYXRoJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcblxuaW1wb3J0IHtQYXJzZUFuYWx5c2lzLCBQYXJzZWRUcmFuc2xhdGlvbkJ1bmRsZSwgVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fcGFyc2VyJztcblxuaW50ZXJmYWNlIFNpbXBsZUpzb25GaWxlIHtcbiAgbG9jYWxlOiBzdHJpbmc7XG4gIHRyYW5zbGF0aW9uczoge1ttZXNzYWdlSWQ6IHN0cmluZ106IHN0cmluZ307XG59XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBwYXJzZXIgdGhhdCBjYW4gcGFyc2UgSlNPTiB0aGF0IGhhcyB0aGUgZm9ybTpcbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgXCJsb2NhbGVcIjogXCIuLi5cIixcbiAqICAgXCJ0cmFuc2xhdGlvbnNcIjoge1xuICogICAgIFwibWVzc2FnZS1pZFwiOiBcIlRhcmdldCBtZXNzYWdlIHN0cmluZ1wiLFxuICogICAgIC4uLlxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAc2VlIFNpbXBsZUpzb25UcmFuc2xhdGlvblNlcmlhbGl6ZXJcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyPFNpbXBsZUpzb25GaWxlPiB7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgY2FuUGFyc2UoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZyk6IFNpbXBsZUpzb25GaWxlfGZhbHNlIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFuYWx5emUoZmlsZVBhdGgsIGNvbnRlbnRzKTtcbiAgICByZXR1cm4gcmVzdWx0LmNhblBhcnNlICYmIHJlc3VsdC5oaW50O1xuICB9XG5cbiAgYW5hbHl6ZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUGFyc2VBbmFseXNpczxTaW1wbGVKc29uRmlsZT4ge1xuICAgIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gICAgLy8gRm9yIHRoaXMgdG8gYmUgcGFyc2FibGUsIHRoZSBleHRlbnNpb24gbXVzdCBiZSBgLmpzb25gIGFuZCB0aGUgY29udGVudHMgbXVzdCBpbmNsdWRlIFwibG9jYWxlXCJcbiAgICAvLyBhbmQgXCJ0cmFuc2xhdGlvbnNcIiBrZXlzLlxuICAgIGlmIChleHRuYW1lKGZpbGVQYXRoKSAhPT0gJy5qc29uJyB8fFxuICAgICAgICAhKGNvbnRlbnRzLmluY2x1ZGVzKCdcImxvY2FsZVwiJykgJiYgY29udGVudHMuaW5jbHVkZXMoJ1widHJhbnNsYXRpb25zXCInKSkpIHtcbiAgICAgIGRpYWdub3N0aWNzLndhcm4oJ0ZpbGUgZG9lcyBub3QgaGF2ZSAuanNvbiBleHRlbnNpb24uJyk7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoY29udGVudHMpIGFzIFNpbXBsZUpzb25GaWxlO1xuICAgICAgaWYgKGpzb24ubG9jYWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignUmVxdWlyZWQgXCJsb2NhbGVcIiBwcm9wZXJ0eSBtaXNzaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBqc29uLmxvY2FsZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignVGhlIFwibG9jYWxlXCIgcHJvcGVydHkgaXMgbm90IGEgc3RyaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKGpzb24udHJhbnNsYXRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignUmVxdWlyZWQgXCJ0cmFuc2xhdGlvbnNcIiBwcm9wZXJ0eSBtaXNzaW5nLicpO1xuICAgICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBqc29uLnRyYW5zbGF0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgZGlhZ25vc3RpY3Mud2FybignVGhlIFwidHJhbnNsYXRpb25zXCIgaXMgbm90IGFuIG9iamVjdC4nKTtcbiAgICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7Y2FuUGFyc2U6IHRydWUsIGRpYWdub3N0aWNzLCBoaW50OiBqc29ufTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkaWFnbm9zdGljcy53YXJuKCdGaWxlIGlzIG5vdCB2YWxpZCBKU09OLicpO1xuICAgICAgcmV0dXJuIHtjYW5QYXJzZTogZmFsc2UsIGRpYWdub3N0aWNzfTtcbiAgICB9XG4gIH1cblxuICBwYXJzZShfZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZywganNvbj86IFNpbXBsZUpzb25GaWxlKTogUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUge1xuICAgIGNvbnN0IHtsb2NhbGU6IHBhcnNlZExvY2FsZSwgdHJhbnNsYXRpb25zfSA9IGpzb24gfHwgSlNPTi5wYXJzZShjb250ZW50cykgYXMgU2ltcGxlSnNvbkZpbGU7XG4gICAgY29uc3QgcGFyc2VkVHJhbnNsYXRpb25zOiBSZWNvcmQ8ybVNZXNzYWdlSWQsIMm1UGFyc2VkVHJhbnNsYXRpb24+ID0ge307XG4gICAgZm9yIChjb25zdCBtZXNzYWdlSWQgaW4gdHJhbnNsYXRpb25zKSB7XG4gICAgICBjb25zdCB0YXJnZXRNZXNzYWdlID0gdHJhbnNsYXRpb25zW21lc3NhZ2VJZF07XG4gICAgICBwYXJzZWRUcmFuc2xhdGlvbnNbbWVzc2FnZUlkXSA9IMm1cGFyc2VUcmFuc2xhdGlvbih0YXJnZXRNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIHtsb2NhbGU6IHBhcnNlZExvY2FsZSwgdHJhbnNsYXRpb25zOiBwYXJzZWRUcmFuc2xhdGlvbnMsIGRpYWdub3N0aWNzOiBuZXcgRGlhZ25vc3RpY3MoKX07XG4gIH1cbn1cbiJdfQ==