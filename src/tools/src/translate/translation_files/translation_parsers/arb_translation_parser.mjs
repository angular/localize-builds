/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵparseTranslation } from '@angular/localize';
import { Diagnostics } from '../../../diagnostics';
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
export class ArbTranslationParser {
    /**
     * @deprecated
     */
    canParse(filePath, contents) {
        const result = this.analyze(filePath, contents);
        return result.canParse && result.hint;
    }
    analyze(_filePath, contents) {
        const diagnostics = new Diagnostics();
        if (!contents.includes('"@@locale"')) {
            return { canParse: false, diagnostics };
        }
        try {
            // We can parse this file if it is valid JSON and contains the `"@@locale"` property.
            return { canParse: true, diagnostics, hint: this.tryParseArbFormat(contents) };
        }
        catch (_a) {
            diagnostics.warn('File is not valid JSON.');
            return { canParse: false, diagnostics };
        }
    }
    parse(_filePath, contents, arb = this.tryParseArbFormat(contents)) {
        const bundle = {
            locale: arb['@@locale'],
            translations: {},
            diagnostics: new Diagnostics()
        };
        for (const messageId of Object.keys(arb)) {
            if (messageId.startsWith('@')) {
                // Skip metadata keys
                continue;
            }
            const targetMessage = arb[messageId];
            bundle.translations[messageId] = ɵparseTranslation(targetMessage);
        }
        return bundle;
    }
    tryParseArbFormat(contents) {
        const json = JSON.parse(contents);
        if (typeof json['@@locale'] !== 'string') {
            throw new Error('Missing @@locale property.');
        }
        return json;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvYXJiX3RyYW5zbGF0aW9uX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQWEsaUJBQWlCLEVBQWtDLE1BQU0sbUJBQW1CLENBQUM7QUFDakcsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBbUJqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQjs7T0FFRztJQUNILFFBQVEsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBaUIsRUFBRSxRQUFnQjtRQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BDLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSTtZQUNGLHFGQUFxRjtZQUNyRixPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDO1NBQzlFO1FBQUMsV0FBTTtZQUNOLFdBQVcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUM1QyxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsU0FBaUIsRUFBRSxRQUFnQixFQUFFLE1BQXFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7UUFFOUYsTUFBTSxNQUFNLEdBQTRCO1lBQ3RDLE1BQU0sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQ3ZCLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFdBQVcsRUFBRSxJQUFJLFdBQVcsRUFBRTtTQUMvQixDQUFDO1FBRUYsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IscUJBQXFCO2dCQUNyQixTQUFTO2FBQ1Y7WUFDRCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFXLENBQUM7WUFDL0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNuRTtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxRQUFnQjtRQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztRQUNuRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtU1lc3NhZ2VJZCwgybVwYXJzZVRyYW5zbGF0aW9uLCDJtVNvdXJjZUxvY2F0aW9uLCDJtVNvdXJjZU1lc3NhZ2V9IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7RGlhZ25vc3RpY3N9IGZyb20gJy4uLy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7UGFyc2VBbmFseXNpcywgUGFyc2VkVHJhbnNsYXRpb25CdW5kbGUsIFRyYW5zbGF0aW9uUGFyc2VyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3BhcnNlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJiSnNvbk9iamVjdCBleHRlbmRzIFJlY29yZDzJtU1lc3NhZ2VJZCwgybVTb3VyY2VNZXNzYWdlfEFyYk1ldGFkYXRhPiB7XG4gICdAQGxvY2FsZSc6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcmJNZXRhZGF0YSB7XG4gIHR5cGU/OiAndGV4dCd8J2ltYWdlJ3wnY3NzJztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIFsneC1sb2NhdGlvbnMnXT86IEFyYkxvY2F0aW9uW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJiTG9jYXRpb24ge1xuICBzdGFydDoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9O1xuICBlbmQ6IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfTtcbiAgZmlsZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gcGFyc2VyIHRoYXQgY2FuIHBhcnNlIEpTT04gZm9ybWF0dGVkIGFzIGFuIEFwcGxpY2F0aW9uIFJlc291cmNlIEJ1bmRsZSAoQVJCKS5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9hcHAtcmVzb3VyY2UtYnVuZGxlL3dpa2kvQXBwbGljYXRpb25SZXNvdXJjZUJ1bmRsZVNwZWNpZmljYXRpb25cbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgXCJAQGxvY2FsZVwiOiBcImVuLVVTXCIsXG4gKiAgIFwibWVzc2FnZS1pZFwiOiBcIlRhcmdldCBtZXNzYWdlIHN0cmluZ1wiLFxuICogICBcIkBtZXNzYWdlLWlkXCI6IHtcbiAqICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gKiAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlNvbWUgZGVzY3JpcHRpb24gdGV4dFwiLFxuICogICAgIFwieC1sb2NhdGlvbnNcIjogW1xuICogICAgICAge1xuICogICAgICAgICBcInN0YXJ0XCI6IHtcImxpbmVcIjogMjMsIFwiY29sdW1uXCI6IDE0NX0sXG4gKiAgICAgICAgIFwiZW5kXCI6IHtcImxpbmVcIjogMjQsIFwiY29sdW1uXCI6IDUzfSxcbiAqICAgICAgICAgXCJmaWxlXCI6IFwic29tZS9maWxlLnRzXCJcbiAqICAgICAgIH0sXG4gKiAgICAgICAuLi5cbiAqICAgICBdXG4gKiAgIH0sXG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBBcmJUcmFuc2xhdGlvblBhcnNlciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uUGFyc2VyPEFyYkpzb25PYmplY3Q+IHtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBjYW5QYXJzZShmaWxlUGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogQXJiSnNvbk9iamVjdHxmYWxzZSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hbmFseXplKGZpbGVQYXRoLCBjb250ZW50cyk7XG4gICAgcmV0dXJuIHJlc3VsdC5jYW5QYXJzZSAmJiByZXN1bHQuaGludDtcbiAgfVxuXG4gIGFuYWx5emUoX2ZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcpOiBQYXJzZUFuYWx5c2lzPEFyYkpzb25PYmplY3Q+IHtcbiAgICBjb25zdCBkaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljcygpO1xuICAgIGlmICghY29udGVudHMuaW5jbHVkZXMoJ1wiQEBsb2NhbGVcIicpKSB7XG4gICAgICByZXR1cm4ge2NhblBhcnNlOiBmYWxzZSwgZGlhZ25vc3RpY3N9O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gV2UgY2FuIHBhcnNlIHRoaXMgZmlsZSBpZiBpdCBpcyB2YWxpZCBKU09OIGFuZCBjb250YWlucyB0aGUgYFwiQEBsb2NhbGVcImAgcHJvcGVydHkuXG4gICAgICByZXR1cm4ge2NhblBhcnNlOiB0cnVlLCBkaWFnbm9zdGljcywgaGludDogdGhpcy50cnlQYXJzZUFyYkZvcm1hdChjb250ZW50cyl9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgZGlhZ25vc3RpY3Mud2FybignRmlsZSBpcyBub3QgdmFsaWQgSlNPTi4nKTtcbiAgICAgIHJldHVybiB7Y2FuUGFyc2U6IGZhbHNlLCBkaWFnbm9zdGljc307XG4gICAgfVxuICB9XG5cbiAgcGFyc2UoX2ZpbGVQYXRoOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIGFyYjogQXJiSnNvbk9iamVjdCA9IHRoaXMudHJ5UGFyc2VBcmJGb3JtYXQoY29udGVudHMpKTpcbiAgICAgIFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBidW5kbGU6IFBhcnNlZFRyYW5zbGF0aW9uQnVuZGxlID0ge1xuICAgICAgbG9jYWxlOiBhcmJbJ0BAbG9jYWxlJ10sXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgZGlhZ25vc3RpY3M6IG5ldyBEaWFnbm9zdGljcygpXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgbWVzc2FnZUlkIG9mIE9iamVjdC5rZXlzKGFyYikpIHtcbiAgICAgIGlmIChtZXNzYWdlSWQuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgIC8vIFNraXAgbWV0YWRhdGEga2V5c1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRhcmdldE1lc3NhZ2UgPSBhcmJbbWVzc2FnZUlkXSBhcyBzdHJpbmc7XG4gICAgICBidW5kbGUudHJhbnNsYXRpb25zW21lc3NhZ2VJZF0gPSDJtXBhcnNlVHJhbnNsYXRpb24odGFyZ2V0TWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBidW5kbGU7XG4gIH1cblxuICBwcml2YXRlIHRyeVBhcnNlQXJiRm9ybWF0KGNvbnRlbnRzOiBzdHJpbmcpOiBBcmJKc29uT2JqZWN0IHtcbiAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShjb250ZW50cykgYXMgQXJiSnNvbk9iamVjdDtcbiAgICBpZiAodHlwZW9mIGpzb25bJ0BAbG9jYWxlJ10gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgQEBsb2NhbGUgcHJvcGVydHkuJyk7XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG59XG4iXX0=