import { MessageSerializer } from '../message_serialization/message_serializer';
import { TargetMessageRenderer } from '../message_serialization/target_message_renderer';
import { parseInnerRange } from './translation_utils';
/**
 * Serialize the given `element` into a parsed translation using the given `serializer`.
 */
export function serializeTranslationMessage(element, config) {
    const { rootNodes, errors: parseErrors } = parseInnerRange(element);
    try {
        const serializer = new MessageSerializer(new TargetMessageRenderer(), config);
        const translation = serializer.serialize(rootNodes);
        return { translation, parseErrors, serializeErrors: [] };
    }
    catch (e) {
        return { translation: null, parseErrors, serializeErrors: [e] };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplX3RyYW5zbGF0aW9uX21lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3NlcmlhbGl6ZV90cmFuc2xhdGlvbl9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLE9BQU8sRUFBQyxpQkFBaUIsRUFBMEIsTUFBTSw2Q0FBNkMsQ0FBQztBQUN2RyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUV2RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFcEQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsT0FBZ0IsRUFBRSxNQUErQjtJQUszRixNQUFNLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEUsSUFBSTtRQUNGLE1BQU0sVUFBVSxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEQsT0FBTyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBQyxDQUFDO0tBQ3hEO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztLQUMvRDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RWxlbWVudCwgUGFyc2VFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5cbmltcG9ydCB7TWVzc2FnZVNlcmlhbGl6ZXIsIE1lc3NhZ2VTZXJpYWxpemVyQ29uZmlnfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vbWVzc2FnZV9zZXJpYWxpemVyJztcbmltcG9ydCB7VGFyZ2V0TWVzc2FnZVJlbmRlcmVyfSBmcm9tICcuLi9tZXNzYWdlX3NlcmlhbGl6YXRpb24vdGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXInO1xuXG5pbXBvcnQge3BhcnNlSW5uZXJSYW5nZX0gZnJvbSAnLi90cmFuc2xhdGlvbl91dGlscyc7XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgZWxlbWVudGAgaW50byBhIHBhcnNlZCB0cmFuc2xhdGlvbiB1c2luZyB0aGUgZ2l2ZW4gYHNlcmlhbGl6ZXJgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplVHJhbnNsYXRpb25NZXNzYWdlKGVsZW1lbnQ6IEVsZW1lbnQsIGNvbmZpZzogTWVzc2FnZVNlcmlhbGl6ZXJDb25maWcpOiB7XG4gIHRyYW5zbGF0aW9uOiDJtVBhcnNlZFRyYW5zbGF0aW9ufG51bGwsXG4gIHBhcnNlRXJyb3JzOiBQYXJzZUVycm9yW10sXG4gIHNlcmlhbGl6ZUVycm9yczogUGFyc2VFcnJvcltdXG59IHtcbiAgY29uc3Qge3Jvb3ROb2RlcywgZXJyb3JzOiBwYXJzZUVycm9yc30gPSBwYXJzZUlubmVyUmFuZ2UoZWxlbWVudCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBNZXNzYWdlU2VyaWFsaXplcihuZXcgVGFyZ2V0TWVzc2FnZVJlbmRlcmVyKCksIGNvbmZpZyk7XG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSBzZXJpYWxpemVyLnNlcmlhbGl6ZShyb290Tm9kZXMpO1xuICAgIHJldHVybiB7dHJhbnNsYXRpb24sIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnM6IFtdfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7dHJhbnNsYXRpb246IG51bGwsIHBhcnNlRXJyb3JzLCBzZXJpYWxpemVFcnJvcnM6IFtlXX07XG4gIH1cbn1cbiJdfQ==