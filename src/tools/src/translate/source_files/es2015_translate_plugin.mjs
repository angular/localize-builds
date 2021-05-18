/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { buildCodeFrameError, buildLocalizeReplacement, isBabelParseError, isLocalize, translate, unwrapMessagePartsFromTemplateLiteral } from '../../source_file_utils';
/**
 * Create a Babel plugin that can be used to do compile-time translation of `$localize` tagged
 * messages.
 *
 * @publicApi used by CLI
 */
export function makeEs2015TranslatePlugin(diagnostics, translations, { missingTranslation = 'error', localizeName = '$localize' } = {}, fs = getFileSystem()) {
    return {
        visitor: {
            TaggedTemplateExpression(path) {
                try {
                    const tag = path.get('tag');
                    if (isLocalize(tag, localizeName)) {
                        const [messageParts] = unwrapMessagePartsFromTemplateLiteral(path.get('quasi').get('quasis'), fs);
                        const translated = translate(diagnostics, translations, messageParts, path.node.quasi.expressions, missingTranslation);
                        path.replaceWith(buildLocalizeReplacement(translated[0], translated[1]));
                    }
                }
                catch (e) {
                    if (isBabelParseError(e)) {
                        // If we get a BabelParseError here then something went wrong with Babel itself
                        // since there must be something wrong with the structure of the AST generated
                        // by Babel parsing a TaggedTemplateExpression.
                        throw buildCodeFrameError(fs, path, e);
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGFBQWEsRUFBbUIsTUFBTSw2Q0FBNkMsQ0FBQztBQU01RixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBMEIscUNBQXFDLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUUvTDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSx5QkFBeUIsQ0FDckMsV0FBd0IsRUFBRSxZQUFnRCxFQUMxRSxFQUFDLGtCQUFrQixHQUFHLE9BQU8sRUFBRSxZQUFZLEdBQUcsV0FBVyxLQUE0QixFQUFFLEVBQ3ZGLEtBQXVCLGFBQWEsRUFBRTtJQUN4QyxPQUFPO1FBQ0wsT0FBTyxFQUFFO1lBQ1Asd0JBQXdCLENBQUMsSUFBd0M7Z0JBQy9ELElBQUk7b0JBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFO3dCQUNqQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQ2hCLHFDQUFxQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMvRSxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQ3hCLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFDcEUsa0JBQWtCLENBQUMsQ0FBQzt3QkFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDMUU7aUJBQ0Y7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDeEIsK0VBQStFO3dCQUMvRSw4RUFBOEU7d0JBQzlFLCtDQUErQzt3QkFDL0MsTUFBTSxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUN4Qzt5QkFBTTt3QkFDTCxNQUFNLENBQUMsQ0FBQztxQkFDVDtpQkFDRjtZQUNILENBQUM7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dldEZpbGVTeXN0ZW0sIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7VGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9ufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge2J1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgVHJhbnNsYXRlUGx1Z2luT3B0aW9ucywgdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbH0gZnJvbSAnLi4vLi4vc291cmNlX2ZpbGVfdXRpbHMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIEJhYmVsIHBsdWdpbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGRvIGNvbXBpbGUtdGltZSB0cmFuc2xhdGlvbiBvZiBgJGxvY2FsaXplYCB0YWdnZWRcbiAqIG1lc3NhZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VFczIwMTVUcmFuc2xhdGVQbHVnaW4oXG4gICAgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIMm1UGFyc2VkVHJhbnNsYXRpb24+LFxuICAgIHttaXNzaW5nVHJhbnNsYXRpb24gPSAnZXJyb3InLCBsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSxcbiAgICBmczogUGF0aE1hbmlwdWxhdGlvbiA9IGdldEZpbGVTeXN0ZW0oKSk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKHBhdGg6IE5vZGVQYXRoPFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbj4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB0YWcgPSBwYXRoLmdldCgndGFnJyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemUodGFnLCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBbbWVzc2FnZVBhcnRzXSA9XG4gICAgICAgICAgICAgICAgdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbChwYXRoLmdldCgncXVhc2knKS5nZXQoJ3F1YXNpcycpLCBmcyk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVkID0gdHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgIGRpYWdub3N0aWNzLCB0cmFuc2xhdGlvbnMsIG1lc3NhZ2VQYXJ0cywgcGF0aC5ub2RlLnF1YXNpLmV4cHJlc3Npb25zLFxuICAgICAgICAgICAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICBwYXRoLnJlcGxhY2VXaXRoKGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCh0cmFuc2xhdGVkWzBdLCB0cmFuc2xhdGVkWzFdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGlzQmFiZWxQYXJzZUVycm9yKGUpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBnZXQgYSBCYWJlbFBhcnNlRXJyb3IgaGVyZSB0aGVuIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggQmFiZWwgaXRzZWxmXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGVyZSBtdXN0IGJlIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIEFTVCBnZW5lcmF0ZWRcbiAgICAgICAgICAgIC8vIGJ5IEJhYmVsIHBhcnNpbmcgYSBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24uXG4gICAgICAgICAgICB0aHJvdyBidWlsZENvZGVGcmFtZUVycm9yKGZzLCBwYXRoLCBlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=