(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/serialize_translation_message", ["require", "exports", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer", "@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeTranslationMessage = void 0;
    var message_serializer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_serializer");
    var target_message_renderer_1 = require("@angular/localize/src/tools/src/translate/translation_files/message_serialization/target_message_renderer");
    var translation_utils_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/translation_utils");
    /**
     * Serialize the given `element` into a parsed translation using the given `serializer`.
     */
    function serializeTranslationMessage(element, config) {
        var _a = (0, translation_utils_1.parseInnerRange)(element), rootNodes = _a.rootNodes, parseErrors = _a.errors;
        try {
            var serializer = new message_serializer_1.MessageSerializer(new target_message_renderer_1.TargetMessageRenderer(), config);
            var translation = serializer.serialize(rootNodes);
            return { translation: translation, parseErrors: parseErrors, serializeErrors: [] };
        }
        catch (e) {
            return { translation: null, parseErrors: parseErrors, serializeErrors: [e] };
        }
    }
    exports.serializeTranslationMessage = serializeTranslationMessage;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplX3RyYW5zbGF0aW9uX21lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3NlcmlhbGl6ZV90cmFuc2xhdGlvbl9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVVBLDJJQUF1RztJQUN2RyxxSkFBdUY7SUFFdkYsdUlBQW9EO0lBRXBEOztPQUVHO0lBQ0gsU0FBZ0IsMkJBQTJCLENBQUMsT0FBZ0IsRUFBRSxNQUErQjtRQUtyRixJQUFBLEtBQW1DLElBQUEsbUNBQWUsRUFBQyxPQUFPLENBQUMsRUFBMUQsU0FBUyxlQUFBLEVBQVUsV0FBVyxZQUE0QixDQUFDO1FBQ2xFLElBQUk7WUFDRixJQUFNLFVBQVUsR0FBRyxJQUFJLHNDQUFpQixDQUFDLElBQUksK0NBQXFCLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RSxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sRUFBQyxXQUFXLGFBQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFDLENBQUM7U0FDeEQ7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsYUFBQSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7U0FDL0Q7SUFDSCxDQUFDO0lBYkQsa0VBYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7TWVzc2FnZVNlcmlhbGl6ZXIsIE1lc3NhZ2VTZXJpYWxpemVyQ29uZmlnfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge3BhcnNlSW5uZXJSYW5nZX0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgZWxlbWVudGAgaW50byBhIHBhcnNlZCB0cmFuc2xhdGlvbiB1c2luZyB0aGUgZ2l2ZW4gYHNlcmlhbGl6ZXJgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlKGVsZW1lbnQ6IEVsZW1lbnQsIGNvbmZpZzogTWVzc2FnZVNlcmlhbGl6ZXJDb25maWcpOiB7XG4gIHRyYW5zbGF0aW9uOiDJtVBhcnNlZFRyYW5zbGF0aW9ufG51bGwsXG4gIHBhcnNlRXJyb3JzOiBQYXJzZUVycm9yW10sXG4gIHNlcmlhbGl6ZUVycm9yczogUGFyc2VFcnJvcltdXG59IHtcbiAgY29uc3Qge3Jvb3ROb2RlcywgZXJyb3JzOiBwYXJzZUVycm9yc30gPSBwYXJzZUlubmVyUmFuZ2UoZWxlbWVudCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBNZXNzYWdlU2VyaWFsaXplcihuZXcgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyKCksIGNvbmZpZyk7XG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShyb290Tm9kZXMpO1xuICAgIHJldHVybiB7dHJhbnNsYXRpb24sIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnM6IFtdfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7dHJhbnNsYXRpb246IG51bGwsIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnM6IFtlXX07XG4gIH1cbn1cbiJdfQ==