/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const __globalThis = typeof globalThis !== 'undefined' && globalThis;
const __window = typeof window !== 'undefined' && window;
const __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
const __global = typeof global !== 'undefined' && global;
// Always use __globalThis if available; this is the spec-defined global variable across all
// environments.
// Then fallback to __global first; in Node tests both __global and __window may be defined.
export const _global = __globalThis || __global || __window || __self;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL2xvY2FsaXplL3NyYy9nbG9iYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBU0gsTUFBTSxZQUFZLEdBQUcsT0FBTyxVQUFVLEtBQUssV0FBVyxJQUFJLFVBQVUsQ0FBQztBQUNyRSxNQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBQ3pELE1BQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFdBQVc7SUFDbEYsSUFBSSxZQUFZLGlCQUFpQixJQUFJLElBQUksQ0FBQztBQUM5QyxNQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBQ3pELDRGQUE0RjtBQUM1RixnQkFBZ0I7QUFDaEIsNEZBQTRGO0FBQzVGLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBUSxZQUFZLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBjb2RlIHRvIGFjY2VzcyB0aGUgZ2xvYmFsIG9iamVjdCBpcyBtb3N0bHkgY29waWVkIGZyb20gYHBhY2thZ2VzL2NvcmUvc3JjL3V0aWwvZ2xvYmFsLnRzYFxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIHZhciBXb3JrZXJHbG9iYWxTY29wZTogYW55O1xufVxuXG5jb25zdCBfX2dsb2JhbFRoaXMgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcztcbmNvbnN0IF9fd2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93O1xuY29uc3QgX19zZWxmID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUgJiYgc2VsZjtcbmNvbnN0IF9fZ2xvYmFsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsO1xuLy8gQWx3YXlzIHVzZSBfX2dsb2JhbFRoaXMgaWYgYXZhaWxhYmxlOyB0aGlzIGlzIHRoZSBzcGVjLWRlZmluZWQgZ2xvYmFsIHZhcmlhYmxlIGFjcm9zcyBhbGxcbi8vIGVudmlyb25tZW50cy5cbi8vIFRoZW4gZmFsbGJhY2sgdG8gX19nbG9iYWwgZmlyc3Q7IGluIE5vZGUgdGVzdHMgYm90aCBfX2dsb2JhbCBhbmQgX193aW5kb3cgbWF5IGJlIGRlZmluZWQuXG5leHBvcnQgY29uc3QgX2dsb2JhbDogYW55ID0gX19nbG9iYWxUaGlzIHx8IF9fZ2xvYmFsIHx8IF9fd2luZG93IHx8IF9fc2VsZjtcbiJdfQ==