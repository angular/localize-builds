/**
 * A translation serializer that generates the mapping file for the legacy message ID migration.
 * The file is used by the `localize-migrate` script to migrate existing translation files from
 * the legacy message IDs to the canonical ones.
 */
export class LegacyMessageIdMigrationSerializer {
    constructor(_diagnostics) {
        this._diagnostics = _diagnostics;
    }
    serialize(messages) {
        let hasMessages = false;
        const mapping = messages.reduce((output, message) => {
            if (shouldMigrate(message)) {
                for (const legacyId of message.legacyIds) {
                    if (output.hasOwnProperty(legacyId)) {
                        this._diagnostics.warn(`Detected duplicate legacy ID ${legacyId}.`);
                    }
                    output[legacyId] = message.id;
                    hasMessages = true;
                }
            }
            return output;
        }, {});
        if (!hasMessages) {
            this._diagnostics.warn('Could not find any legacy message IDs in source files while generating ' +
                'the legacy message migration file.');
        }
        return JSON.stringify(mapping, null, 2);
    }
}
/** Returns true if a message needs to be migrated. */
function shouldMigrate(message) {
    return !message.customId && !!message.legacyIds && message.legacyIds.length > 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5X21lc3NhZ2VfaWRfbWlncmF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvbGVnYWN5X21lc3NhZ2VfaWRfbWlncmF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUE7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxrQ0FBa0M7SUFDN0MsWUFBb0IsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBRyxDQUFDO0lBRWpELFNBQVMsQ0FBQyxRQUF5QjtRQUNqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNsRCxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDMUIsS0FBSyxNQUFNLFFBQVEsSUFBSSxPQUFPLENBQUMsU0FBVSxFQUFFO29CQUN6QyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO3FCQUNyRTtvQkFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztvQkFDOUIsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDcEI7YUFDRjtZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsRUFBRSxFQUE0QixDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDbEIseUVBQXlFO2dCQUN6RSxvQ0FBb0MsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGO0FBRUQsc0RBQXNEO0FBQ3RELFNBQVMsYUFBYSxDQUFDLE9BQXNCO0lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNsRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkTWVzc2FnZSBhcyBQYXJzZWRNZXNzYWdlfSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcblxuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGdlbmVyYXRlcyB0aGUgbWFwcGluZyBmaWxlIGZvciB0aGUgbGVnYWN5IG1lc3NhZ2UgSUQgbWlncmF0aW9uLlxuICogVGhlIGZpbGUgaXMgdXNlZCBieSB0aGUgYGxvY2FsaXplLW1pZ3JhdGVgIHNjcmlwdCB0byBtaWdyYXRlIGV4aXN0aW5nIHRyYW5zbGF0aW9uIGZpbGVzIGZyb21cbiAqIHRoZSBsZWdhY3kgbWVzc2FnZSBJRHMgdG8gdGhlIGNhbm9uaWNhbCBvbmVzLlxuICovXG5leHBvcnQgY2xhc3MgTGVnYWN5TWVzc2FnZUlkTWlncmF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpYWdub3N0aWNzOiBEaWFnbm9zdGljcykge31cblxuICBzZXJpYWxpemUobWVzc2FnZXM6IFBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgbGV0IGhhc01lc3NhZ2VzID0gZmFsc2U7XG4gICAgY29uc3QgbWFwcGluZyA9IG1lc3NhZ2VzLnJlZHVjZSgob3V0cHV0LCBtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoc2hvdWxkTWlncmF0ZShtZXNzYWdlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGxlZ2FjeUlkIG9mIG1lc3NhZ2UubGVnYWN5SWRzISkge1xuICAgICAgICAgIGlmIChvdXRwdXQuaGFzT3duUHJvcGVydHkobGVnYWN5SWQpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy53YXJuKGBEZXRlY3RlZCBkdXBsaWNhdGUgbGVnYWN5IElEICR7bGVnYWN5SWR9LmApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG91dHB1dFtsZWdhY3lJZF0gPSBtZXNzYWdlLmlkO1xuICAgICAgICAgIGhhc01lc3NhZ2VzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTtcblxuICAgIGlmICghaGFzTWVzc2FnZXMpIHtcbiAgICAgIHRoaXMuX2RpYWdub3N0aWNzLndhcm4oXG4gICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIGFueSBsZWdhY3kgbWVzc2FnZSBJRHMgaW4gc291cmNlIGZpbGVzIHdoaWxlIGdlbmVyYXRpbmcgJyArXG4gICAgICAgICAgJ3RoZSBsZWdhY3kgbWVzc2FnZSBtaWdyYXRpb24gZmlsZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWFwcGluZywgbnVsbCwgMik7XG4gIH1cbn1cblxuLyoqIFJldHVybnMgdHJ1ZSBpZiBhIG1lc3NhZ2UgbmVlZHMgdG8gYmUgbWlncmF0ZWQuICovXG5mdW5jdGlvbiBzaG91bGRNaWdyYXRlKG1lc3NhZ2U6IFBhcnNlZE1lc3NhZ2UpOiBib29sZWFuIHtcbiAgcmV0dXJuICFtZXNzYWdlLmN1c3RvbUlkICYmICEhbWVzc2FnZS5sZWdhY3lJZHMgJiYgbWVzc2FnZS5sZWdhY3lJZHMubGVuZ3RoID4gMDtcbn1cbiJdfQ==