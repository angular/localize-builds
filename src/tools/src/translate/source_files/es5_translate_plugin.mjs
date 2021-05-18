/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { buildCodeFrameError, buildLocalizeReplacement, isBabelParseError, isLocalize, translate, unwrapMessagePartsFromLocalizeCall, unwrapSubstitutionsFromLocalizeCall } from '../../source_file_utils';
/**
 * Create a Babel plugin that can be used to do compile-time translation of `$localize` tagged
 * messages.
 *
 * @publicApi used by CLI
 */
export function makeEs5TranslatePlugin(diagnostics, translations, { missingTranslation = 'error', localizeName = '$localize' } = {}, fs = getFileSystem()) {
    return {
        visitor: {
            CallExpression(callPath) {
                try {
                    const calleePath = callPath.get('callee');
                    if (isLocalize(calleePath, localizeName)) {
                        const [messageParts] = unwrapMessagePartsFromLocalizeCall(callPath, fs);
                        const [expressions] = unwrapSubstitutionsFromLocalizeCall(callPath, fs);
                        const translated = translate(diagnostics, translations, messageParts, expressions, missingTranslation);
                        callPath.replaceWith(buildLocalizeReplacement(translated[0], translated[1]));
                    }
                }
                catch (e) {
                    if (isBabelParseError(e)) {
                        diagnostics.error(buildCodeFrameError(fs, callPath, e));
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXM1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGFBQWEsRUFBbUIsTUFBTSw2Q0FBNkMsQ0FBQztBQU01RixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBMEIsa0NBQWtDLEVBQUUsbUNBQW1DLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUVqTzs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FDbEMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUFDLGtCQUFrQixHQUFHLE9BQU8sRUFBRSxZQUFZLEdBQUcsV0FBVyxLQUE0QixFQUFFLEVBQ3ZGLEtBQXVCLGFBQWEsRUFBRTtJQUN4QyxPQUFPO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsY0FBYyxDQUFDLFFBQWtDO2dCQUMvQyxJQUFJO29CQUNGLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzFDLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFBRTt3QkFDeEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLGtDQUFrQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDeEUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLG1DQUFtQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDeEUsTUFBTSxVQUFVLEdBQ1osU0FBUyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO3dCQUN4RixRQUFRLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM5RTtpQkFDRjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN4QixXQUFXLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDekQ7eUJBQU07d0JBQ0wsTUFBTSxDQUFDLENBQUM7cUJBQ1Q7aUJBQ0Y7WUFDSCxDQUFDO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtnZXRGaWxlU3lzdGVtLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtOb2RlUGF0aCwgUGx1Z2luT2JqfSBmcm9tICdAYmFiZWwvY29yZSc7XG5pbXBvcnQge0NhbGxFeHByZXNzaW9ufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge2J1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucywgdW53cmFwTWVzc2FnZVBhcnRzRnJvbUxvY2FsaXplQ2FsbCwgdW53cmFwU3Vic3RpdHV0aW9uc0Zyb21Mb2NhbGl6ZUNhbGx9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuLyoqXG4gKiBDcmVhdGUgYSBCYWJlbCBwbHVnaW4gdGhhdCBjYW4gYmUgdXNlZCB0byBkbyBjb21waWxlLXRpbWUgdHJhbnNsYXRpb24gb2YgYCRsb2NhbGl6ZWAgdGFnZ2VkXG4gKiBtZXNzYWdlcy5cbiAqXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXM1VHJhbnNsYXRlUGx1Z2luKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICB7bWlzc2luZ1RyYW5zbGF0aW9uID0gJ2Vycm9yJywgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30sXG4gICAgZnM6IFBhdGhNYW5pcHVsYXRpb24gPSBnZXRGaWxlU3lzdGVtKCkpOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIENhbGxFeHByZXNzaW9uKGNhbGxQYXRoOiBOb2RlUGF0aDxDYWxsRXhwcmVzc2lvbj4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjYWxsZWVQYXRoID0gY2FsbFBhdGguZ2V0KCdjYWxsZWUnKTtcbiAgICAgICAgICBpZiAoaXNMb2NhbGl6ZShjYWxsZWVQYXRoLCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBbbWVzc2FnZVBhcnRzXSA9IHVud3JhcE1lc3NhZ2VQYXJ0c0Zyb21Mb2NhbGl6ZUNhbGwoY2FsbFBhdGgsIGZzKTtcbiAgICAgICAgICAgIGNvbnN0IFtleHByZXNzaW9uc10gPSB1bndyYXBTdWJzdGl0dXRpb25zRnJvbUxvY2FsaXplQ2FsbChjYWxsUGF0aCwgZnMpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlZCA9XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgZXhwcmVzc2lvbnMsIG1pc3NpbmdUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICBjYWxsUGF0aC5yZXBsYWNlV2l0aChidWlsZExvY2FsaXplUmVwbGFjZW1lbnQodHJhbnNsYXRlZFswXSwgdHJhbnNsYXRlZFsxXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc0JhYmVsUGFyc2VFcnJvcihlKSkge1xuICAgICAgICAgICAgZGlhZ25vc3RpY3MuZXJyb3IoYnVpbGRDb2RlRnJhbWVFcnJvcihmcywgY2FsbFBhdGgsIGUpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=