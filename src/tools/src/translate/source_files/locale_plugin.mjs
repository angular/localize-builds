import { stringLiteral } from '@babel/types';
import { isLocalize } from '../../source_file_utils';
/**
 * This Babel plugin will replace the following code forms with a string literal containing the
 * given `locale`.
 *
 * * `$localize.locale`                                            -> `"locale"`
 * * `typeof $localize !== "undefined" && $localize.locale`        -> `"locale"`
 * * `xxx && typeof $localize !== "undefined" && $localize.locale` -> `"xxx && locale"`
 * * `$localize.locale || default`                                 -> `"locale" || default`
 *
 * @param locale The name of the locale to inline into the code.
 * @param options Additional options including the name of the `$localize` function.
 * @publicApi used by CLI
 */
export function makeLocalePlugin(locale, { localizeName = '$localize' } = {}) {
    return {
        visitor: {
            MemberExpression(expression) {
                const obj = expression.get('object');
                if (!isLocalize(obj, localizeName)) {
                    return;
                }
                const property = expression.get('property');
                if (!property.isIdentifier({ name: 'locale' })) {
                    return;
                }
                if (expression.parentPath.isAssignmentExpression() &&
                    expression.parentPath.get('left') === expression) {
                    return;
                }
                // Check for the `$localize.locale` being guarded by a check on the existence of
                // `$localize`.
                const parent = expression.parentPath;
                if (parent.isLogicalExpression({ operator: '&&' }) && parent.get('right') === expression) {
                    const left = parent.get('left');
                    if (isLocalizeGuard(left, localizeName)) {
                        // Replace `typeof $localize !== "undefined" && $localize.locale` with
                        // `$localize.locale`
                        parent.replaceWith(expression);
                    }
                    else if (left.isLogicalExpression({ operator: '&&' }) &&
                        isLocalizeGuard(left.get('right'), localizeName)) {
                        // The `$localize` is part of a preceding logical AND.
                        // Replace XXX && typeof $localize !== "undefined" && $localize.locale` with `XXX &&
                        // $localize.locale`
                        left.replaceWith(left.get('left'));
                    }
                }
                // Replace the `$localize.locale` with the string literal
                expression.replaceWith(stringLiteral(locale));
            }
        }
    };
}
/**
 * Returns true if the expression one of:
 * * `typeof $localize !== "undefined"`
 * * `"undefined" !== typeof $localize`
 * * `typeof $localize != "undefined"`
 * * `"undefined" != typeof $localize`
 *
 * @param expression the expression to check
 * @param localizeName the name of the `$localize` symbol
 */
function isLocalizeGuard(expression, localizeName) {
    if (!expression.isBinaryExpression() ||
        !(expression.node.operator === '!==' || expression.node.operator === '!=')) {
        return false;
    }
    const left = expression.get('left');
    const right = expression.get('right');
    return (left.isUnaryExpression({ operator: 'typeof' }) &&
        isLocalize(left.get('argument'), localizeName) &&
        right.isStringLiteral({ value: 'undefined' })) ||
        (right.isUnaryExpression({ operator: 'typeof' }) &&
            isLocalize(right.get('argument'), localizeName) &&
            left.isStringLiteral({ value: 'undefined' }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9sb2NhbGVfcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBbUIsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTdELE9BQU8sRUFBQyxVQUFVLEVBQXlCLE1BQU0seUJBQXlCLENBQUM7QUFFM0U7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUM1QixNQUFjLEVBQUUsRUFBQyxZQUFZLEdBQUcsV0FBVyxLQUE0QixFQUFFO0lBQzNFLE9BQU87UUFDTCxPQUFPLEVBQUU7WUFDUCxnQkFBZ0IsQ0FBQyxVQUFzQztnQkFDckQsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUU7b0JBQ2xDLE9BQU87aUJBQ1I7Z0JBQ0QsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQWEsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRTtvQkFDNUMsT0FBTztpQkFDUjtnQkFDRCxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUU7b0JBQzlDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsRUFBRTtvQkFDcEQsT0FBTztpQkFDUjtnQkFDRCxnRkFBZ0Y7Z0JBQ2hGLGVBQWU7Z0JBQ2YsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztnQkFDckMsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTtvQkFDdEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFO3dCQUN2QyxzRUFBc0U7d0JBQ3RFLHFCQUFxQjt3QkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDaEM7eUJBQU0sSUFDSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7d0JBQzFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksQ0FBQyxFQUFFO3dCQUNwRCxzREFBc0Q7d0JBQ3RELG9GQUFvRjt3QkFDcEYsb0JBQW9CO3dCQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDcEM7aUJBQ0Y7Z0JBQ0QseURBQXlEO2dCQUN6RCxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUM7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBUyxlQUFlLENBQUMsVUFBb0IsRUFBRSxZQUFvQjtJQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFO1FBQ2hDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDOUUsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV0QyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQzVDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksQ0FBQztRQUM5QyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7WUFDN0MsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxDQUFDO1lBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtNZW1iZXJFeHByZXNzaW9uLCBzdHJpbmdMaXRlcmFsfSBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5pbXBvcnQge2lzTG9jYWxpemUsIFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnN9IGZyb20gJy4uLy4uL3NvdXJjZV9maWxlX3V0aWxzJztcblxuLyoqXG4gKiBUaGlzIEJhYmVsIHBsdWdpbiB3aWxsIHJlcGxhY2UgdGhlIGZvbGxvd2luZyBjb2RlIGZvcm1zIHdpdGggYSBzdHJpbmcgbGl0ZXJhbCBjb250YWluaW5nIHRoZVxuICogZ2l2ZW4gYGxvY2FsZWAuXG4gKlxuICogKiBgJGxvY2FsaXplLmxvY2FsZWAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0+IGBcImxvY2FsZVwiYFxuICogKiBgdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkbG9jYWxpemUubG9jYWxlYCAgICAgICAgLT4gYFwibG9jYWxlXCJgXG4gKiAqIGB4eHggJiYgdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkbG9jYWxpemUubG9jYWxlYCAtPiBgXCJ4eHggJiYgbG9jYWxlXCJgXG4gKiAqIGAkbG9jYWxpemUubG9jYWxlIHx8IGRlZmF1bHRgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLT4gYFwibG9jYWxlXCIgfHwgZGVmYXVsdGBcbiAqXG4gKiBAcGFyYW0gbG9jYWxlIFRoZSBuYW1lIG9mIHRoZSBsb2NhbGUgdG8gaW5saW5lIGludG8gdGhlIGNvZGUuXG4gKiBAcGFyYW0gb3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMgaW5jbHVkaW5nIHRoZSBuYW1lIG9mIHRoZSBgJGxvY2FsaXplYCBmdW5jdGlvbi5cbiAqIEBwdWJsaWNBcGkgdXNlZCBieSBDTElcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMb2NhbGVQbHVnaW4oXG4gICAgbG9jYWxlOiBzdHJpbmcsIHtsb2NhbGl6ZU5hbWUgPSAnJGxvY2FsaXplJ306IFRyYW5zbGF0ZVBsdWdpbk9wdGlvbnMgPSB7fSk6IFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgTWVtYmVyRXhwcmVzc2lvbihleHByZXNzaW9uOiBOb2RlUGF0aDxNZW1iZXJFeHByZXNzaW9uPikge1xuICAgICAgICBjb25zdCBvYmogPSBleHByZXNzaW9uLmdldCgnb2JqZWN0Jyk7XG4gICAgICAgIGlmICghaXNMb2NhbGl6ZShvYmosIGxvY2FsaXplTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSBleHByZXNzaW9uLmdldCgncHJvcGVydHknKSBhcyBOb2RlUGF0aDtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0lkZW50aWZpZXIoe25hbWU6ICdsb2NhbGUnfSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4cHJlc3Npb24ucGFyZW50UGF0aC5pc0Fzc2lnbm1lbnRFeHByZXNzaW9uKCkgJiZcbiAgICAgICAgICAgIGV4cHJlc3Npb24ucGFyZW50UGF0aC5nZXQoJ2xlZnQnKSA9PT0gZXhwcmVzc2lvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3IgdGhlIGAkbG9jYWxpemUubG9jYWxlYCBiZWluZyBndWFyZGVkIGJ5IGEgY2hlY2sgb24gdGhlIGV4aXN0ZW5jZSBvZlxuICAgICAgICAvLyBgJGxvY2FsaXplYC5cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZXhwcmVzc2lvbi5wYXJlbnRQYXRoO1xuICAgICAgICBpZiAocGFyZW50LmlzTG9naWNhbEV4cHJlc3Npb24oe29wZXJhdG9yOiAnJiYnfSkgJiYgcGFyZW50LmdldCgncmlnaHQnKSA9PT0gZXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGxlZnQgPSBwYXJlbnQuZ2V0KCdsZWZ0Jyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemVHdWFyZChsZWZ0LCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIGB0eXBlb2YgJGxvY2FsaXplICE9PSBcInVuZGVmaW5lZFwiICYmICRsb2NhbGl6ZS5sb2NhbGVgIHdpdGhcbiAgICAgICAgICAgIC8vIGAkbG9jYWxpemUubG9jYWxlYFxuICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VXaXRoKGV4cHJlc3Npb24pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGxlZnQuaXNMb2dpY2FsRXhwcmVzc2lvbih7b3BlcmF0b3I6ICcmJid9KSAmJlxuICAgICAgICAgICAgICBpc0xvY2FsaXplR3VhcmQobGVmdC5nZXQoJ3JpZ2h0JyksIGxvY2FsaXplTmFtZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBgJGxvY2FsaXplYCBpcyBwYXJ0IG9mIGEgcHJlY2VkaW5nIGxvZ2ljYWwgQU5ELlxuICAgICAgICAgICAgLy8gUmVwbGFjZSBYWFggJiYgdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkbG9jYWxpemUubG9jYWxlYCB3aXRoIGBYWFggJiZcbiAgICAgICAgICAgIC8vICRsb2NhbGl6ZS5sb2NhbGVgXG4gICAgICAgICAgICBsZWZ0LnJlcGxhY2VXaXRoKGxlZnQuZ2V0KCdsZWZ0JykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBgJGxvY2FsaXplLmxvY2FsZWAgd2l0aCB0aGUgc3RyaW5nIGxpdGVyYWxcbiAgICAgICAgZXhwcmVzc2lvbi5yZXBsYWNlV2l0aChzdHJpbmdMaXRlcmFsKGxvY2FsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGV4cHJlc3Npb24gb25lIG9mOlxuICogKiBgdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcImBcbiAqICogYFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiAkbG9jYWxpemVgXG4gKiAqIGB0eXBlb2YgJGxvY2FsaXplICE9IFwidW5kZWZpbmVkXCJgXG4gKiAqIGBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiAkbG9jYWxpemVgXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gdGhlIGV4cHJlc3Npb24gdG8gY2hlY2tcbiAqIEBwYXJhbSBsb2NhbGl6ZU5hbWUgdGhlIG5hbWUgb2YgdGhlIGAkbG9jYWxpemVgIHN5bWJvbFxuICovXG5mdW5jdGlvbiBpc0xvY2FsaXplR3VhcmQoZXhwcmVzc2lvbjogTm9kZVBhdGgsIGxvY2FsaXplTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghZXhwcmVzc2lvbi5pc0JpbmFyeUV4cHJlc3Npb24oKSB8fFxuICAgICAgIShleHByZXNzaW9uLm5vZGUub3BlcmF0b3IgPT09ICchPT0nIHx8IGV4cHJlc3Npb24ubm9kZS5vcGVyYXRvciA9PT0gJyE9JykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgbGVmdCA9IGV4cHJlc3Npb24uZ2V0KCdsZWZ0Jyk7XG4gIGNvbnN0IHJpZ2h0ID0gZXhwcmVzc2lvbi5nZXQoJ3JpZ2h0Jyk7XG5cbiAgcmV0dXJuIChsZWZ0LmlzVW5hcnlFeHByZXNzaW9uKHtvcGVyYXRvcjogJ3R5cGVvZid9KSAmJlxuICAgICAgICAgIGlzTG9jYWxpemUobGVmdC5nZXQoJ2FyZ3VtZW50JyksIGxvY2FsaXplTmFtZSkgJiZcbiAgICAgICAgICByaWdodC5pc1N0cmluZ0xpdGVyYWwoe3ZhbHVlOiAndW5kZWZpbmVkJ30pKSB8fFxuICAgICAgKHJpZ2h0LmlzVW5hcnlFeHByZXNzaW9uKHtvcGVyYXRvcjogJ3R5cGVvZid9KSAmJlxuICAgICAgIGlzTG9jYWxpemUocmlnaHQuZ2V0KCdhcmd1bWVudCcpLCBsb2NhbGl6ZU5hbWUpICYmXG4gICAgICAgbGVmdC5pc1N0cmluZ0xpdGVyYWwoe3ZhbHVlOiAndW5kZWZpbmVkJ30pKTtcbn1cbiJdfQ==