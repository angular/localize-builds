/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export class XmlFile {
    constructor() {
        this.output = '<?xml version="1.0" encoding="UTF-8" ?>\n';
        this.indent = '';
        this.elements = [];
        this.preservingWhitespace = false;
    }
    toString() {
        return this.output;
    }
    startTag(name, attributes = {}, { selfClosing = false, preserveWhitespace } = {}) {
        if (!this.preservingWhitespace) {
            this.output += this.indent;
        }
        this.output += `<${name}`;
        for (const [attrName, attrValue] of Object.entries(attributes)) {
            if (attrValue) {
                this.output += ` ${attrName}="${escapeXml(attrValue)}"`;
            }
        }
        if (selfClosing) {
            this.output += '/>';
        }
        else {
            this.output += '>';
            this.elements.push(name);
            this.incIndent();
        }
        if (preserveWhitespace !== undefined) {
            this.preservingWhitespace = preserveWhitespace;
        }
        if (!this.preservingWhitespace) {
            this.output += `\n`;
        }
        return this;
    }
    endTag(name, { preserveWhitespace } = {}) {
        const expectedTag = this.elements.pop();
        if (expectedTag !== name) {
            throw new Error(`Unexpected closing tag: "${name}", expected: "${expectedTag}"`);
        }
        this.decIndent();
        if (!this.preservingWhitespace) {
            this.output += this.indent;
        }
        this.output += `</${name}>`;
        if (preserveWhitespace !== undefined) {
            this.preservingWhitespace = preserveWhitespace;
        }
        if (!this.preservingWhitespace) {
            this.output += `\n`;
        }
        return this;
    }
    text(str) {
        this.output += escapeXml(str);
        return this;
    }
    rawText(str) {
        this.output += str;
        return this;
    }
    incIndent() {
        this.indent = this.indent + '  ';
    }
    decIndent() {
        this.indent = this.indent.slice(0, -2);
    }
}
const _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
function escapeXml(text) {
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX2ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMveG1sX2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBT0gsTUFBTSxPQUFPLE9BQU87SUFBcEI7UUFDVSxXQUFNLEdBQUcsMkNBQTJDLENBQUM7UUFDckQsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLGFBQVEsR0FBYSxFQUFFLENBQUM7UUFDeEIseUJBQW9CLEdBQUcsS0FBSyxDQUFDO0lBMkV2QyxDQUFDO0lBMUVDLFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELFFBQVEsQ0FDSixJQUFZLEVBQUUsYUFBK0MsRUFBRSxFQUMvRCxFQUFDLFdBQVcsR0FBRyxLQUFLLEVBQUUsa0JBQWtCLEtBQWEsRUFBRTtRQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUUxQixLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM5RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO2FBQ3pEO1NBQ0Y7UUFFRCxJQUFJLFdBQVcsRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFFRCxJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUNwQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUM7U0FDaEQ7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVksRUFBRSxFQUFDLGtCQUFrQixLQUFhLEVBQUU7UUFDckQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN4QyxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsSUFBSSxpQkFBaUIsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUNsRjtRQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUM1QjtRQUNELElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQztRQUU1QixJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtZQUNwQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUM7U0FDaEQ7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVc7UUFDZCxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBVztRQUNqQixJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxTQUFTO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBQ08sU0FBUztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBRUQsTUFBTSxjQUFjLEdBQXVCO0lBQ3pDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUNmLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztJQUNoQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7SUFDaEIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQ2QsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0NBQ2YsQ0FBQztBQUVGLFNBQVMsU0FBUyxDQUFDLElBQVk7SUFDN0IsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUN4QixDQUFDLElBQVksRUFBRSxLQUF1QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmludGVyZmFjZSBPcHRpb25zIHtcbiAgc2VsZkNsb3Npbmc/OiBib29sZWFuO1xuICBwcmVzZXJ2ZVdoaXRlc3BhY2U/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgWG1sRmlsZSB7XG4gIHByaXZhdGUgb3V0cHV0ID0gJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgPz5cXG4nO1xuICBwcml2YXRlIGluZGVudCA9ICcnO1xuICBwcml2YXRlIGVsZW1lbnRzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHByZXNlcnZpbmdXaGl0ZXNwYWNlID0gZmFsc2U7XG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm91dHB1dDtcbiAgfVxuXG4gIHN0YXJ0VGFnKFxuICAgICAgbmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8dW5kZWZpbmVkPiA9IHt9LFxuICAgICAge3NlbGZDbG9zaW5nID0gZmFsc2UsIHByZXNlcnZlV2hpdGVzcGFjZX06IE9wdGlvbnMgPSB7fSk6IHRoaXMge1xuICAgIGlmICghdGhpcy5wcmVzZXJ2aW5nV2hpdGVzcGFjZSkge1xuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5pbmRlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXQgKz0gYDwke25hbWV9YDtcblxuICAgIGZvciAoY29uc3QgW2F0dHJOYW1lLCBhdHRyVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgIHRoaXMub3V0cHV0ICs9IGAgJHthdHRyTmFtZX09XCIke2VzY2FwZVhtbChhdHRyVmFsdWUpfVwiYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZkNsb3NpbmcpIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9ICcvPic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9ICc+JztcbiAgICAgIHRoaXMuZWxlbWVudHMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuaW5jSW5kZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHByZXNlcnZlV2hpdGVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnByZXNlcnZpbmdXaGl0ZXNwYWNlID0gcHJlc2VydmVXaGl0ZXNwYWNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucHJlc2VydmluZ1doaXRlc3BhY2UpIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9IGBcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVuZFRhZyhuYW1lOiBzdHJpbmcsIHtwcmVzZXJ2ZVdoaXRlc3BhY2V9OiBPcHRpb25zID0ge30pOiB0aGlzIHtcbiAgICBjb25zdCBleHBlY3RlZFRhZyA9IHRoaXMuZWxlbWVudHMucG9wKCk7XG4gICAgaWYgKGV4cGVjdGVkVGFnICE9PSBuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgY2xvc2luZyB0YWc6IFwiJHtuYW1lfVwiLCBleHBlY3RlZDogXCIke2V4cGVjdGVkVGFnfVwiYCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWNJbmRlbnQoKTtcblxuICAgIGlmICghdGhpcy5wcmVzZXJ2aW5nV2hpdGVzcGFjZSkge1xuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5pbmRlbnQ7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0ICs9IGA8LyR7bmFtZX0+YDtcblxuICAgIGlmIChwcmVzZXJ2ZVdoaXRlc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5wcmVzZXJ2aW5nV2hpdGVzcGFjZSA9IHByZXNlcnZlV2hpdGVzcGFjZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnByZXNlcnZpbmdXaGl0ZXNwYWNlKSB7XG4gICAgICB0aGlzLm91dHB1dCArPSBgXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0ZXh0KHN0cjogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5vdXRwdXQgKz0gZXNjYXBlWG1sKHN0cik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByYXdUZXh0KHN0cjogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5vdXRwdXQgKz0gc3RyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBpbmNJbmRlbnQoKSB7XG4gICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudCArICcgICc7XG4gIH1cbiAgcHJpdmF0ZSBkZWNJbmRlbnQoKSB7XG4gICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudC5zbGljZSgwLCAtMik7XG4gIH1cbn1cblxuY29uc3QgX0VTQ0FQRURfQ0hBUlM6IFtSZWdFeHAsIHN0cmluZ11bXSA9IFtcbiAgWy8mL2csICcmYW1wOyddLFxuICBbL1wiL2csICcmcXVvdDsnXSxcbiAgWy8nL2csICcmYXBvczsnXSxcbiAgWy88L2csICcmbHQ7J10sXG4gIFsvPi9nLCAnJmd0OyddLFxuXTtcblxuZnVuY3Rpb24gZXNjYXBlWG1sKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBfRVNDQVBFRF9DSEFSUy5yZWR1Y2UoXG4gICAgICAodGV4dDogc3RyaW5nLCBlbnRyeTogW1JlZ0V4cCwgc3RyaW5nXSkgPT4gdGV4dC5yZXBsYWNlKGVudHJ5WzBdLCBlbnRyeVsxXSksIHRleHQpO1xufSJdfQ==