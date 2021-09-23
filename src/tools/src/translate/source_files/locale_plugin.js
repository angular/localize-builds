(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/locale_plugin", ["require", "exports", "@babel/types", "@angular/localize/src/tools/src/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.makeLocalePlugin = void 0;
    var types_1 = require("@babel/types");
    var source_file_utils_1 = require("@angular/localize/src/tools/src/source_file_utils");
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
    function makeLocalePlugin(locale, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.localizeName, localizeName = _c === void 0 ? '$localize' : _c;
        return {
            visitor: {
                MemberExpression: function (expression) {
                    var obj = expression.get('object');
                    if (!(0, source_file_utils_1.isLocalize)(obj, localizeName)) {
                        return;
                    }
                    var property = expression.get('property');
                    if (!property.isIdentifier({ name: 'locale' })) {
                        return;
                    }
                    if (expression.parentPath.isAssignmentExpression() &&
                        expression.parentPath.get('left') === expression) {
                        return;
                    }
                    // Check for the `$localize.locale` being guarded by a check on the existence of
                    // `$localize`.
                    var parent = expression.parentPath;
                    if (parent.isLogicalExpression({ operator: '&&' }) && parent.get('right') === expression) {
                        var left = parent.get('left');
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
                    expression.replaceWith((0, types_1.stringLiteral)(locale));
                }
            }
        };
    }
    exports.makeLocalePlugin = makeLocalePlugin;
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
        var left = expression.get('left');
        var right = expression.get('right');
        return (left.isUnaryExpression({ operator: 'typeof' }) &&
            (0, source_file_utils_1.isLocalize)(left.get('argument'), localizeName) &&
            right.isStringLiteral({ value: 'undefined' })) ||
            (right.isUnaryExpression({ operator: 'typeof' }) &&
                (0, source_file_utils_1.isLocalize)(right.get('argument'), localizeName) &&
                left.isStringLiteral({ value: 'undefined' }));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3NvdXJjZV9maWxlcy9sb2NhbGVfcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLHNDQUE2RDtJQUU3RCx1RkFBMkU7SUFFM0U7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsU0FBZ0IsZ0JBQWdCLENBQzVCLE1BQWMsRUFBRSxFQUF5RDtZQUF6RCxxQkFBdUQsRUFBRSxLQUFBLEVBQXhELG9CQUEwQixFQUExQixZQUFZLG1CQUFHLFdBQVcsS0FBQTtRQUM3QyxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLGdCQUFnQixFQUFoQixVQUFpQixVQUFzQztvQkFDckQsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLElBQUEsOEJBQVUsRUFBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUU7d0JBQ2xDLE9BQU87cUJBQ1I7b0JBQ0QsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQWEsQ0FBQztvQkFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRTt3QkFDNUMsT0FBTztxQkFDUjtvQkFDRCxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUU7d0JBQzlDLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsRUFBRTt3QkFDcEQsT0FBTztxQkFDUjtvQkFDRCxnRkFBZ0Y7b0JBQ2hGLGVBQWU7b0JBQ2YsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztvQkFDckMsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTt3QkFDdEYsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDaEMsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUN2QyxzRUFBc0U7NEJBQ3RFLHFCQUFxQjs0QkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzt5QkFDaEM7NkJBQU0sSUFDSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7NEJBQzFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUNwRCxzREFBc0Q7NEJBQ3RELG9GQUFvRjs0QkFDcEYsb0JBQW9COzRCQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDcEM7cUJBQ0Y7b0JBQ0QseURBQXlEO29CQUN6RCxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUEscUJBQWEsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQXhDRCw0Q0F3Q0M7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxTQUFTLGVBQWUsQ0FBQyxVQUFvQixFQUFFLFlBQW9CO1FBQ2pFLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUU7WUFDaEMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUM5RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7WUFDNUMsSUFBQSw4QkFBVSxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxDQUFDO1lBQzlDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztnQkFDN0MsSUFBQSw4QkFBVSxFQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge05vZGVQYXRoLCBQbHVnaW5PYmp9IGZyb20gJ0BiYWJlbC9jb3JlJztcbmltcG9ydCB7TWVtYmVyRXhwcmVzc2lvbiwgc3RyaW5nTGl0ZXJhbH0gZnJvbSAnQGJhYmVsL3R5cGVzJztcblxuaW1wb3J0IHtpc0xvY2FsaXplLCBUcmFuc2xhdGVQbHVnaW5PcHRpb25zfSBmcm9tICcuLi8uLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbi8qKlxuICogVGhpcyBCYWJlbCBwbHVnaW4gd2lsbCByZXBsYWNlIHRoZSBmb2xsb3dpbmcgY29kZSBmb3JtcyB3aXRoIGEgc3RyaW5nIGxpdGVyYWwgY29udGFpbmluZyB0aGVcbiAqIGdpdmVuIGBsb2NhbGVgLlxuICpcbiAqICogYCRsb2NhbGl6ZS5sb2NhbGVgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtPiBgXCJsb2NhbGVcImBcbiAqICogYHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZWAgICAgICAgIC0+IGBcImxvY2FsZVwiYFxuICogKiBgeHh4ICYmIHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZWAgLT4gYFwieHh4ICYmIGxvY2FsZVwiYFxuICogKiBgJGxvY2FsaXplLmxvY2FsZSB8fCBkZWZhdWx0YCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0+IGBcImxvY2FsZVwiIHx8IGRlZmF1bHRgXG4gKlxuICogQHBhcmFtIGxvY2FsZSBUaGUgbmFtZSBvZiB0aGUgbG9jYWxlIHRvIGlubGluZSBpbnRvIHRoZSBjb2RlLlxuICogQHBhcmFtIG9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIGluY2x1ZGluZyB0aGUgbmFtZSBvZiB0aGUgYCRsb2NhbGl6ZWAgZnVuY3Rpb24uXG4gKiBAcHVibGljQXBpIHVzZWQgYnkgQ0xJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTG9jYWxlUGx1Z2luKFxuICAgIGxvY2FsZTogc3RyaW5nLCB7bG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30pOiBQbHVnaW5PYmoge1xuICByZXR1cm4ge1xuICAgIHZpc2l0b3I6IHtcbiAgICAgIE1lbWJlckV4cHJlc3Npb24oZXhwcmVzc2lvbjogTm9kZVBhdGg8TWVtYmVyRXhwcmVzc2lvbj4pIHtcbiAgICAgICAgY29uc3Qgb2JqID0gZXhwcmVzc2lvbi5nZXQoJ29iamVjdCcpO1xuICAgICAgICBpZiAoIWlzTG9jYWxpemUob2JqLCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gZXhwcmVzc2lvbi5nZXQoJ3Byb3BlcnR5JykgYXMgTm9kZVBhdGg7XG4gICAgICAgIGlmICghcHJvcGVydHkuaXNJZGVudGlmaWVyKHtuYW1lOiAnbG9jYWxlJ30pKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHByZXNzaW9uLnBhcmVudFBhdGguaXNBc3NpZ25tZW50RXhwcmVzc2lvbigpICYmXG4gICAgICAgICAgICBleHByZXNzaW9uLnBhcmVudFBhdGguZ2V0KCdsZWZ0JykgPT09IGV4cHJlc3Npb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHRoZSBgJGxvY2FsaXplLmxvY2FsZWAgYmVpbmcgZ3VhcmRlZCBieSBhIGNoZWNrIG9uIHRoZSBleGlzdGVuY2Ugb2ZcbiAgICAgICAgLy8gYCRsb2NhbGl6ZWAuXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGV4cHJlc3Npb24ucGFyZW50UGF0aDtcbiAgICAgICAgaWYgKHBhcmVudC5pc0xvZ2ljYWxFeHByZXNzaW9uKHtvcGVyYXRvcjogJyYmJ30pICYmIHBhcmVudC5nZXQoJ3JpZ2h0JykgPT09IGV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBsZWZ0ID0gcGFyZW50LmdldCgnbGVmdCcpO1xuICAgICAgICAgIGlmIChpc0xvY2FsaXplR3VhcmQobGVmdCwgbG9jYWxpemVOYW1lKSkge1xuICAgICAgICAgICAgLy8gUmVwbGFjZSBgdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkbG9jYWxpemUubG9jYWxlYCB3aXRoXG4gICAgICAgICAgICAvLyBgJGxvY2FsaXplLmxvY2FsZWBcbiAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlV2l0aChleHByZXNzaW9uKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICBsZWZ0LmlzTG9naWNhbEV4cHJlc3Npb24oe29wZXJhdG9yOiAnJiYnfSkgJiZcbiAgICAgICAgICAgICAgaXNMb2NhbGl6ZUd1YXJkKGxlZnQuZ2V0KCdyaWdodCcpLCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgYCRsb2NhbGl6ZWAgaXMgcGFydCBvZiBhIHByZWNlZGluZyBsb2dpY2FsIEFORC5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgWFhYICYmIHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCIgJiYgJGxvY2FsaXplLmxvY2FsZWAgd2l0aCBgWFhYICYmXG4gICAgICAgICAgICAvLyAkbG9jYWxpemUubG9jYWxlYFxuICAgICAgICAgICAgbGVmdC5yZXBsYWNlV2l0aChsZWZ0LmdldCgnbGVmdCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYCRsb2NhbGl6ZS5sb2NhbGVgIHdpdGggdGhlIHN0cmluZyBsaXRlcmFsXG4gICAgICAgIGV4cHJlc3Npb24ucmVwbGFjZVdpdGgoc3RyaW5nTGl0ZXJhbChsb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBleHByZXNzaW9uIG9uZSBvZjpcbiAqICogYHR5cGVvZiAkbG9jYWxpemUgIT09IFwidW5kZWZpbmVkXCJgXG4gKiAqIGBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgJGxvY2FsaXplYFxuICogKiBgdHlwZW9mICRsb2NhbGl6ZSAhPSBcInVuZGVmaW5lZFwiYFxuICogKiBgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgJGxvY2FsaXplYFxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uIHRoZSBleHByZXNzaW9uIHRvIGNoZWNrXG4gKiBAcGFyYW0gbG9jYWxpemVOYW1lIHRoZSBuYW1lIG9mIHRoZSBgJGxvY2FsaXplYCBzeW1ib2xcbiAqL1xuZnVuY3Rpb24gaXNMb2NhbGl6ZUd1YXJkKGV4cHJlc3Npb246IE5vZGVQYXRoLCBsb2NhbGl6ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoIWV4cHJlc3Npb24uaXNCaW5hcnlFeHByZXNzaW9uKCkgfHxcbiAgICAgICEoZXhwcmVzc2lvbi5ub2RlLm9wZXJhdG9yID09PSAnIT09JyB8fCBleHByZXNzaW9uLm5vZGUub3BlcmF0b3IgPT09ICchPScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGxlZnQgPSBleHByZXNzaW9uLmdldCgnbGVmdCcpO1xuICBjb25zdCByaWdodCA9IGV4cHJlc3Npb24uZ2V0KCdyaWdodCcpO1xuXG4gIHJldHVybiAobGVmdC5pc1VuYXJ5RXhwcmVzc2lvbih7b3BlcmF0b3I6ICd0eXBlb2YnfSkgJiZcbiAgICAgICAgICBpc0xvY2FsaXplKGxlZnQuZ2V0KCdhcmd1bWVudCcpLCBsb2NhbGl6ZU5hbWUpICYmXG4gICAgICAgICAgcmlnaHQuaXNTdHJpbmdMaXRlcmFsKHt2YWx1ZTogJ3VuZGVmaW5lZCd9KSkgfHxcbiAgICAgIChyaWdodC5pc1VuYXJ5RXhwcmVzc2lvbih7b3BlcmF0b3I6ICd0eXBlb2YnfSkgJiZcbiAgICAgICBpc0xvY2FsaXplKHJpZ2h0LmdldCgnYXJndW1lbnQnKSwgbG9jYWxpemVOYW1lKSAmJlxuICAgICAgIGxlZnQuaXNTdHJpbmdMaXRlcmFsKHt2YWx1ZTogJ3VuZGVmaW5lZCd9KSk7XG59XG4iXX0=