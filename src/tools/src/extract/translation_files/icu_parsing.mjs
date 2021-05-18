/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Split the given `text` into an array of "static strings" and ICU "placeholder names".
 *
 * This is required because ICU expressions in `$localize` tagged messages may contain "dynamic"
 * piece (e.g. interpolations or element markers). These markers need to be translated to
 * placeholders in extracted translation files. So we must parse ICUs to identify them and separate
 * them out so that the translation serializers can render them appropriately.
 *
 * An example of an ICU with interpolations:
 *
 * ```
 * {VAR_PLURAL, plural, one {{INTERPOLATION}} other {{INTERPOLATION_1} post}}
 * ```
 *
 * In this ICU, `INTERPOLATION` and `INTERPOLATION_1` are actually placeholders that will be
 * replaced with dynamic content at runtime.
 *
 * Such placeholders are identifiable as text wrapped in curly braces, within an ICU case
 * expression.
 *
 * To complicate matters, it is possible for ICUs to be nested indefinitely within each other. In
 * such cases, the nested ICU expression appears enclosed in a set of curly braces in the same way
 * as a placeholder. The nested ICU expressions can be differentiated from placeholders as they
 * contain a comma `,`, which separates the ICU value from the ICU type.
 *
 * Furthermore, nested ICUs can have placeholders of their own, which need to be extracted.
 *
 * An example of a nested ICU containing its own placeholders:
 *
 * ```
 * {VAR_SELECT_1, select,
 *   invoice {Invoice for {INTERPOLATION}}
 *   payment {{VAR_SELECT, select,
 *     processor {Payment gateway}
 *     other {{INTERPOLATION_1}}
 *   }}
 * ```
 *
 * @param text Text to be broken.
 * @returns an array of strings, where
 *  - even values are static strings (e.g. 0, 2, 4, etc)
 *  - odd values are placeholder names (e.g. 1, 3, 5, etc)
 */
export function extractIcuPlaceholders(text) {
    const state = new StateStack();
    const pieces = new IcuPieces();
    const braces = /[{}]/g;
    let lastPos = 0;
    let match;
    while (match = braces.exec(text)) {
        if (match[0] == '{') {
            state.enterBlock();
        }
        else {
            // We must have hit a `}`
            state.leaveBlock();
        }
        if (state.getCurrent() === 'placeholder') {
            const name = tryParsePlaceholder(text, braces.lastIndex);
            if (name) {
                // We found a placeholder so store it in the pieces;
                // store the current static text (minus the opening curly brace);
                // skip the closing brace and leave the placeholder block.
                pieces.addText(text.substring(lastPos, braces.lastIndex - 1));
                pieces.addPlaceholder(name);
                braces.lastIndex += name.length + 1;
                state.leaveBlock();
            }
            else {
                // This is not a placeholder, so it must be a nested ICU;
                // store the current static text (including the opening curly brace).
                pieces.addText(text.substring(lastPos, braces.lastIndex));
                state.nestedIcu();
            }
        }
        else {
            pieces.addText(text.substring(lastPos, braces.lastIndex));
        }
        lastPos = braces.lastIndex;
    }
    // Capture the last piece of text after the ICUs (if any).
    pieces.addText(text.substring(lastPos));
    return pieces.toArray();
}
/**
 * A helper class to store the pieces ("static text" or "placeholder name") in an ICU.
 */
class IcuPieces {
    constructor() {
        this.pieces = [''];
    }
    /**
     * Add the given `text` to the current "static text" piece.
     *
     * Sequential calls to `addText()` will append to the current text piece.
     */
    addText(text) {
        this.pieces[this.pieces.length - 1] += text;
    }
    /**
     * Add the given placeholder `name` to the stored pieces.
     */
    addPlaceholder(name) {
        this.pieces.push(name);
        this.pieces.push('');
    }
    /**
     * Return the stored pieces as an array of strings.
     *
     * Even values are static strings (e.g. 0, 2, 4, etc)
     * Odd values are placeholder names (e.g. 1, 3, 5, etc)
     */
    toArray() {
        return this.pieces;
    }
}
/**
 * A helper class to track the current state of parsing the strings for ICU placeholders.
 *
 * State changes happen when we enter or leave a curly brace block.
 * Since ICUs can be nested the state is stored as a stack.
 */
class StateStack {
    constructor() {
        this.stack = [];
    }
    /**
     * Update the state upon entering a block.
     *
     * The new state is computed from the current state and added to the stack.
     */
    enterBlock() {
        const current = this.getCurrent();
        switch (current) {
            case 'icu':
                this.stack.push('case');
                break;
            case 'case':
                this.stack.push('placeholder');
                break;
            case 'placeholder':
                this.stack.push('case');
                break;
            default:
                this.stack.push('icu');
                break;
        }
    }
    /**
     * Update the state upon leaving a block.
     *
     * The previous state is popped off the stack.
     */
    leaveBlock() {
        return this.stack.pop();
    }
    /**
     * Update the state upon arriving at a nested ICU.
     *
     * In this case, the current state of "placeholder" is incorrect, so this is popped off and the
     * correct "icu" state is stored.
     */
    nestedIcu() {
        const current = this.stack.pop();
        assert(current === 'placeholder', 'A nested ICU must replace a placeholder but got ' + current);
        this.stack.push('icu');
    }
    /**
     * Get the current (most recent) state from the stack.
     */
    getCurrent() {
        return this.stack[this.stack.length - 1];
    }
}
/**
 * Attempt to parse a simple placeholder name from a curly braced block.
 *
 * If the block contains a comma `,` then it cannot be a placeholder - and is probably a nest ICU
 * instead.
 *
 * @param text the whole string that is being parsed.
 * @param start the index of the character in the `text` string where this placeholder may start.
 * @returns the placeholder name or `null` if it is not a placeholder.
 */
function tryParsePlaceholder(text, start) {
    for (let i = start; i < text.length; i++) {
        if (text[i] === ',') {
            break;
        }
        if (text[i] === '}') {
            return text.substring(start, i);
        }
    }
    return null;
}
function assert(test, message) {
    if (!test) {
        throw new Error('Assertion failure: ' + message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWN1X3BhcnNpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvaWN1X3BhcnNpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxJQUFZO0lBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7SUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUMvQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFFdkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksS0FBNEIsQ0FBQztJQUNqQyxPQUFPLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUNuQixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEI7YUFBTTtZQUNMLHlCQUF5QjtZQUN6QixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEI7UUFFRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxhQUFhLEVBQUU7WUFDeEMsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RCxJQUFJLElBQUksRUFBRTtnQkFDUixvREFBb0Q7Z0JBQ3BELGlFQUFpRTtnQkFDakUsMERBQTBEO2dCQUMxRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEdB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QUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBR0Q7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxJQUFZLEVBQUUsS0FBYTtJQUN0RCxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDbkIsTUFBTTtTQUNQO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDakM7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLElBQWEsRUFBRSxPQUFlO0lBQzVDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIFNwbGl0IHRoZSBnaXZlbiBgdGV4dGAgaW50byBhbiBhcnJheSBvZiBcInN0YXRpYyBzdHJpbmdzXCIgYW5kIElDVSBcInBsYWNlaG9sZGVyIG5hbWVzXCIuXG4gKlxuICogVGhpcyBpcyByZXF1aXJlZCBiZWNhdXNlIElDVSBleHByZXNzaW9ucyBpbiBgJGxvY2FsaXplYCB0YWdnZWQgbWVzc2FnZXMgbWF5IGNvbnRhaW4gXCJkeW5hbWljXCJcbiAqIHBpZWNlIChlLmcuIGludGVycG9sYXRpb25zIG9yIGVsZW1lbnQgbWFya2VycykuIFRoZXNlIG1hcmtlcnMgbmVlZCB0byBiZSB0cmFuc2xhdGVkIHRvXG4gKiBwbGFjZWhvbGRlcnMgaW4gZXh0cmFjdGVkIHRyYW5zbGF0aW9uIGZpbGVzLiBTbyB3ZSBtdXN0IHBhcnNlIElDVXMgdG8gaWRlbnRpZnkgdGhlbSBhbmQgc2VwYXJhdGVcbiAqIHRoZW0gb3V0IHNvIHRoYXQgdGhlIHRyYW5zbGF0aW9uIHNlcmlhbGl6ZXJzIGNhbiByZW5kZXIgdGhlbSBhcHByb3ByaWF0ZWx5LlxuICpcbiAqIEFuIGV4YW1wbGUgb2YgYW4gSUNVIHdpdGggaW50ZXJwb2xhdGlvbnM6XG4gKlxuICogYGBgXG4gKiB7VkFSX1BMVVJBTCwgcGx1cmFsLCBvbmUge3tJTlRFUlBPTEFUSU9OfX0gb3RoZXIge3tJTlRFUlBPTEFUSU9OXzF9IHBvc3R9fVxuICogYGBgXG4gKlxuICogSW4gdGhpcyBJQ1UsIGBJTlRFUlBPTEFUSU9OYCBhbmQgYElOVEVSUE9MQVRJT05fMWAgYXJlIGFjdHVhbGx5IHBsYWNlaG9sZGVycyB0aGF0IHdpbGwgYmVcbiAqIHJlcGxhY2VkIHdpdGggZHluYW1pYyBjb250ZW50IGF0IHJ1bnRpbWUuXG4gKlxuICogU3VjaCBwbGFjZWhvbGRlcnMgYXJlIGlkZW50aWZpYWJsZSBhcyB0ZXh0IHdyYXBwZWQgaW4gY3VybHkgYnJhY2VzLCB3aXRoaW4gYW4gSUNVIGNhc2VcbiAqIGV4cHJlc3Npb24uXG4gKlxuICogVG8gY29tcGxpY2F0ZSBtYXR0ZXJzLCBpdCBpcyBwb3NzaWJsZSBmb3IgSUNVcyB0byBiZSBuZXN0ZWQgaW5kZWZpbml0ZWx5IHdpdGhpbiBlYWNoIG90aGVyLiBJblxuICogc3VjaCBjYXNlcywgdGhlIG5lc3RlZCBJQ1UgZXhwcmVzc2lvbiBhcHBlYXJzIGVuY2xvc2VkIGluIGEgc2V0IG9mIGN1cmx5IGJyYWNlcyBpbiB0aGUgc2FtZSB3YXlcbiAqIGFzIGEgcGxhY2Vob2xkZXIuIFRoZSBuZXN0ZWQgSUNVIGV4cHJlc3Npb25zIGNhbiBiZSBkaWZmZXJlbnRpYXRlZCBmcm9tIHBsYWNlaG9sZGVycyBhcyB0aGV5XG4gKiBjb250YWluIGEgY29tbWEgYCxgLCB3aGljaCBzZXBhcmF0ZXMgdGhlIElDVSB2YWx1ZSBmcm9tIHRoZSBJQ1UgdHlwZS5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgbmVzdGVkIElDVXMgY2FuIGhhdmUgcGxhY2Vob2xkZXJzIG9mIHRoZWlyIG93biwgd2hpY2ggbmVlZCB0byBiZSBleHRyYWN0ZWQuXG4gKlxuICogQW4gZXhhbXBsZSBvZiBhIG5lc3RlZCBJQ1UgY29udGFpbmluZyBpdHMgb3duIHBsYWNlaG9sZGVyczpcbiAqXG4gKiBgYGBcbiAqIHtWQVJfU0VMRUNUXzEsIHNlbGVjdCxcbiAqICAgaW52b2ljZSB7SW52b2ljZSBmb3Ige0lOVEVSUE9MQVRJT059fVxuICogICBwYXltZW50IHt7VkFSX1NFTEVDVCwgc2VsZWN0LFxuICogICAgIHByb2Nlc3NvciB7UGF5bWVudCBnYXRld2F5fVxuICogICAgIG90aGVyIHt7SU5URVJQT0xBVElPTl8xfX1cbiAqICAgfX1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB0ZXh0IFRleHQgdG8gYmUgYnJva2VuLlxuICogQHJldHVybnMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgd2hlcmVcbiAqICAtIGV2ZW4gdmFsdWVzIGFyZSBzdGF0aWMgc3RyaW5ncyAoZS5nLiAwLCAyLCA0LCBldGMpXG4gKiAgLSBvZGQgdmFsdWVzIGFyZSBwbGFjZWhvbGRlciBuYW1lcyAoZS5nLiAxLCAzLCA1LCBldGMpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0SWN1UGxhY2Vob2xkZXJzKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3Qgc3RhdGUgPSBuZXcgU3RhdGVTdGFjaygpO1xuICBjb25zdCBwaWVjZXMgPSBuZXcgSWN1UGllY2VzKCk7XG4gIGNvbnN0IGJyYWNlcyA9IC9be31dL2c7XG5cbiAgbGV0IGxhc3RQb3MgPSAwO1xuICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXl8bnVsbDtcbiAgd2hpbGUgKG1hdGNoID0gYnJhY2VzLmV4ZWModGV4dCkpIHtcbiAgICBpZiAobWF0Y2hbMF0gPT0gJ3snKSB7XG4gICAgICBzdGF0ZS5lbnRlckJsb2NrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIG11c3QgaGF2ZSBoaXQgYSBgfWBcbiAgICAgIHN0YXRlLmxlYXZlQmxvY2soKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuZ2V0Q3VycmVudCgpID09PSAncGxhY2Vob2xkZXInKSB7XG4gICAgICBjb25zdCBuYW1lID0gdHJ5UGFyc2VQbGFjZWhvbGRlcih0ZXh0LCBicmFjZXMubGFzdEluZGV4KTtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIC8vIFdlIGZvdW5kIGEgcGxhY2Vob2xkZXIgc28gc3RvcmUgaXQgaW4gdGhlIHBpZWNlcztcbiAgICAgICAgLy8gc3RvcmUgdGhlIGN1cnJlbnQgc3RhdGljIHRleHQgKG1pbnVzIHRoZSBvcGVuaW5nIGN1cmx5IGJyYWNlKTtcbiAgICAgICAgLy8gc2tpcCB0aGUgY2xvc2luZyBicmFjZSBhbmQgbGVhdmUgdGhlIHBsYWNlaG9sZGVyIGJsb2NrLlxuICAgICAgICBwaWVjZXMuYWRkVGV4dCh0ZXh0LnN1YnN0cmluZyhsYXN0UG9zLCBicmFjZXMubGFzdEluZGV4IC0gMSkpO1xuICAgICAgICBwaWVjZXMuYWRkUGxhY2Vob2xkZXIobmFtZSk7XG4gICAgICAgIGJyYWNlcy5sYXN0SW5kZXggKz0gbmFtZS5sZW5ndGggKyAxO1xuICAgICAgICBzdGF0ZS5sZWF2ZUJsb2NrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIG5vdCBhIHBsYWNlaG9sZGVyLCBzbyBpdCBtdXN0IGJlIGEgbmVzdGVkIElDVTtcbiAgICAgICAgLy8gc3RvcmUgdGhlIGN1cnJlbnQgc3RhdGljIHRleHQgKGluY2x1ZGluZyB0aGUgb3BlbmluZyBjdXJseSBicmFjZSkuXG4gICAgICAgIHBpZWNlcy5hZGRUZXh0KHRleHQuc3Vic3RyaW5nKGxhc3RQb3MsIGJyYWNlcy5sYXN0SW5kZXgpKTtcbiAgICAgICAgc3RhdGUubmVzdGVkSWN1KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBpZWNlcy5hZGRUZXh0KHRleHQuc3Vic3RyaW5nKGxhc3RQb3MsIGJyYWNlcy5sYXN0SW5kZXgpKTtcbiAgICB9XG4gICAgbGFzdFBvcyA9IGJyYWNlcy5sYXN0SW5kZXg7XG4gIH1cblxuICAvLyBDYXB0dXJlIHRoZSBsYXN0IHBpZWNlIG9mIHRleHQgYWZ0ZXIgdGhlIElDVXMgKGlmIGFueSkuXG4gIHBpZWNlcy5hZGRUZXh0KHRleHQuc3Vic3RyaW5nKGxhc3RQb3MpKTtcbiAgcmV0dXJuIHBpZWNlcy50b0FycmF5KCk7XG59XG5cbi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gc3RvcmUgdGhlIHBpZWNlcyAoXCJzdGF0aWMgdGV4dFwiIG9yIFwicGxhY2Vob2xkZXIgbmFtZVwiKSBpbiBhbiBJQ1UuXG4gKi9cbmNsYXNzIEljdVBpZWNlcyB7XG4gIHByaXZhdGUgcGllY2VzOiBzdHJpbmdbXSA9IFsnJ107XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gYHRleHRgIHRvIHRoZSBjdXJyZW50IFwic3RhdGljIHRleHRcIiBwaWVjZS5cbiAgICpcbiAgICogU2VxdWVudGlhbCBjYWxscyB0byBgYWRkVGV4dCgpYCB3aWxsIGFwcGVuZCB0byB0aGUgY3VycmVudCB0ZXh0IHBpZWNlLlxuICAgKi9cbiAgYWRkVGV4dCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnBpZWNlc1t0aGlzLnBpZWNlcy5sZW5ndGggLSAxXSArPSB0ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gcGxhY2Vob2xkZXIgYG5hbWVgIHRvIHRoZSBzdG9yZWQgcGllY2VzLlxuICAgKi9cbiAgYWRkUGxhY2Vob2xkZXIobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5waWVjZXMucHVzaChuYW1lKTtcbiAgICB0aGlzLnBpZWNlcy5wdXNoKCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN0b3JlZCBwaWVjZXMgYXMgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAgICpcbiAgICogRXZlbiB2YWx1ZXMgYXJlIHN0YXRpYyBzdHJpbmdzIChlLmcuIDAsIDIsIDQsIGV0YylcbiAgICogT2RkIHZhbHVlcyBhcmUgcGxhY2Vob2xkZXIgbmFtZXMgKGUuZy4gMSwgMywgNSwgZXRjKVxuICAgKi9cbiAgdG9BcnJheSgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMucGllY2VzO1xuICB9XG59XG5cbi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gdHJhY2sgdGhlIGN1cnJlbnQgc3RhdGUgb2YgcGFyc2luZyB0aGUgc3RyaW5ncyBmb3IgSUNVIHBsYWNlaG9sZGVycy5cbiAqXG4gKiBTdGF0ZSBjaGFuZ2VzIGhhcHBlbiB3aGVuIHdlIGVudGVyIG9yIGxlYXZlIGEgY3VybHkgYnJhY2UgYmxvY2suXG4gKiBTaW5jZSBJQ1VzIGNhbiBiZSBuZXN0ZWQgdGhlIHN0YXRlIGlzIHN0b3JlZCBhcyBhIHN0YWNrLlxuICovXG5jbGFzcyBTdGF0ZVN0YWNrIHtcbiAgcHJpdmF0ZSBzdGFjazogUGFyc2VyU3RhdGVbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHN0YXRlIHVwb24gZW50ZXJpbmcgYSBibG9jay5cbiAgICpcbiAgICogVGhlIG5ldyBzdGF0ZSBpcyBjb21wdXRlZCBmcm9tIHRoZSBjdXJyZW50IHN0YXRlIGFuZCBhZGRlZCB0byB0aGUgc3RhY2suXG4gICAqL1xuICBlbnRlckJsb2NrKCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmdldEN1cnJlbnQoKTtcbiAgICBzd2l0Y2ggKGN1cnJlbnQpIHtcbiAgICAgIGNhc2UgJ2ljdSc6XG4gICAgICAgIHRoaXMuc3RhY2sucHVzaCgnY2FzZScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nhc2UnOlxuICAgICAgICB0aGlzLnN0YWNrLnB1c2goJ3BsYWNlaG9sZGVyJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGxhY2Vob2xkZXInOlxuICAgICAgICB0aGlzLnN0YWNrLnB1c2goJ2Nhc2UnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnN0YWNrLnB1c2goJ2ljdScpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBzdGF0ZSB1cG9uIGxlYXZpbmcgYSBibG9jay5cbiAgICpcbiAgICogVGhlIHByZXZpb3VzIHN0YXRlIGlzIHBvcHBlZCBvZmYgdGhlIHN0YWNrLlxuICAgKi9cbiAgbGVhdmVCbG9jaygpOiBQYXJzZXJTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBzdGF0ZSB1cG9uIGFycml2aW5nIGF0IGEgbmVzdGVkIElDVS5cbiAgICpcbiAgICogSW4gdGhpcyBjYXNlLCB0aGUgY3VycmVudCBzdGF0ZSBvZiBcInBsYWNlaG9sZGVyXCIgaXMgaW5jb3JyZWN0LCBzbyB0aGlzIGlzIHBvcHBlZCBvZmYgYW5kIHRoZVxuICAgKiBjb3JyZWN0IFwiaWN1XCIgc3RhdGUgaXMgc3RvcmVkLlxuICAgKi9cbiAgbmVzdGVkSWN1KCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnN0YWNrLnBvcCgpO1xuICAgIGFzc2VydChjdXJyZW50ID09PSAncGxhY2Vob2xkZXInLCAnQSBuZXN0ZWQgSUNVIG11c3QgcmVwbGFjZSBhIHBsYWNlaG9sZGVyIGJ1dCBnb3QgJyArIGN1cnJlbnQpO1xuICAgIHRoaXMuc3RhY2sucHVzaCgnaWN1Jyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IChtb3N0IHJlY2VudCkgc3RhdGUgZnJvbSB0aGUgc3RhY2suXG4gICAqL1xuICBnZXRDdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cbn1cbnR5cGUgUGFyc2VyU3RhdGUgPSAnaWN1J3wnY2FzZSd8J3BsYWNlaG9sZGVyJ3x1bmRlZmluZWQ7XG5cbi8qKlxuICogQXR0ZW1wdCB0byBwYXJzZSBhIHNpbXBsZSBwbGFjZWhvbGRlciBuYW1lIGZyb20gYSBjdXJseSBicmFjZWQgYmxvY2suXG4gKlxuICogSWYgdGhlIGJsb2NrIGNvbnRhaW5zIGEgY29tbWEgYCxgIHRoZW4gaXQgY2Fubm90IGJlIGEgcGxhY2Vob2xkZXIgLSBhbmQgaXMgcHJvYmFibHkgYSBuZXN0IElDVVxuICogaW5zdGVhZC5cbiAqXG4gKiBAcGFyYW0gdGV4dCB0aGUgd2hvbGUgc3RyaW5nIHRoYXQgaXMgYmVpbmcgcGFyc2VkLlxuICogQHBhcmFtIHN0YXJ0IHRoZSBpbmRleCBvZiB0aGUgY2hhcmFjdGVyIGluIHRoZSBgdGV4dGAgc3RyaW5nIHdoZXJlIHRoaXMgcGxhY2Vob2xkZXIgbWF5IHN0YXJ0LlxuICogQHJldHVybnMgdGhlIHBsYWNlaG9sZGVyIG5hbWUgb3IgYG51bGxgIGlmIGl0IGlzIG5vdCBhIHBsYWNlaG9sZGVyLlxuICovXG5mdW5jdGlvbiB0cnlQYXJzZVBsYWNlaG9sZGVyKHRleHQ6IHN0cmluZywgc3RhcnQ6IG51bWJlcik6IHN0cmluZ3xudWxsIHtcbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0ZXh0W2ldID09PSAnLCcpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAodGV4dFtpXSA9PT0gJ30nKSB7XG4gICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0KHRlc3Q6IGJvb2xlYW4sIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIXRlc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2VydGlvbiBmYWlsdXJlOiAnICsgbWVzc2FnZSk7XG4gIH1cbn1cbiJdfQ==