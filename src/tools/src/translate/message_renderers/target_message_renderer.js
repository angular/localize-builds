(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/message_renderers/target_message_renderer", ["require", "exports", "@angular/localize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var localize_1 = require("@angular/localize");
    /**
     * A message renderer that outputs `ɵParsedTranslation` objects.
     */
    var TargetMessageRenderer = /** @class */ (function () {
        function TargetMessageRenderer() {
            this.current = { messageParts: [], placeholderNames: [], text: '' };
            this.icuDepth = 0;
        }
        Object.defineProperty(TargetMessageRenderer.prototype, "message", {
            get: function () {
                var _a = this.current, messageParts = _a.messageParts, placeholderNames = _a.placeholderNames;
                return localize_1.ɵmakeParsedTranslation(messageParts, placeholderNames);
            },
            enumerable: true,
            configurable: true
        });
        TargetMessageRenderer.prototype.startRender = function () { };
        TargetMessageRenderer.prototype.endRender = function () { this.storeMessagePart(); };
        TargetMessageRenderer.prototype.text = function (text) { this.current.text += text; };
        TargetMessageRenderer.prototype.placeholder = function (name, body) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startPlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.closePlaceholder = function (name) { this.renderPlaceholder(name); };
        TargetMessageRenderer.prototype.startContainer = function () { };
        TargetMessageRenderer.prototype.closeContainer = function () { };
        TargetMessageRenderer.prototype.startIcu = function () {
            this.icuDepth++;
            this.text('{');
        };
        TargetMessageRenderer.prototype.endIcu = function () {
            this.icuDepth--;
            this.text('}');
        };
        TargetMessageRenderer.prototype.renderPlaceholder = function (name) {
            if (this.icuDepth > 0) {
                this.text("{" + name + "}");
            }
            else {
                this.storeMessagePart();
                this.current.placeholderNames.push(name);
            }
        };
        TargetMessageRenderer.prototype.storeMessagePart = function () {
            this.current.messageParts.push(this.current.text);
            this.current.text = '';
        };
        return TargetMessageRenderer;
    }());
    exports.TargetMessageRenderer = TargetMessageRenderer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X21lc3NhZ2VfcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9tZXNzYWdlX3JlbmRlcmVycy90YXJnZXRfbWVzc2FnZV9yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUE2RTtJQUc3RTs7T0FFRztJQUNIO1FBQUE7WUFDVSxZQUFPLEdBQWdCLEVBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO1lBQzFFLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFrQ3ZCLENBQUM7UUFoQ0Msc0JBQUksMENBQU87aUJBQVg7Z0JBQ1EsSUFBQSxpQkFBK0MsRUFBOUMsOEJBQVksRUFBRSxzQ0FBZ0MsQ0FBQztnQkFDdEQsT0FBTyxpQ0FBc0IsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNoRSxDQUFDOzs7V0FBQTtRQUNELDJDQUFXLEdBQVgsY0FBcUIsQ0FBQztRQUN0Qix5Q0FBUyxHQUFULGNBQW9CLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QyxvQ0FBSSxHQUFKLFVBQUssSUFBWSxJQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkQsMkNBQVcsR0FBWCxVQUFZLElBQVksRUFBRSxJQUFzQixJQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekYsZ0RBQWdCLEdBQWhCLFVBQWlCLElBQVksSUFBVSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLGdEQUFnQixHQUFoQixVQUFpQixJQUFZLElBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSw4Q0FBYyxHQUFkLGNBQXdCLENBQUM7UUFDekIsOENBQWMsR0FBZCxjQUF3QixDQUFDO1FBQ3pCLHdDQUFRLEdBQVI7WUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBQ0Qsc0NBQU0sR0FBTjtZQUNFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFDTyxpREFBaUIsR0FBekIsVUFBMEIsSUFBWTtZQUNwQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUksSUFBSSxNQUFHLENBQUMsQ0FBQzthQUN4QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUM7UUFDSCxDQUFDO1FBQ08sZ0RBQWdCLEdBQXhCO1lBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFDSCw0QkFBQztJQUFELENBQUMsQUFwQ0QsSUFvQ0M7SUFwQ1ksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHvJtVBhcnNlZFRyYW5zbGF0aW9uLCDJtW1ha2VQYXJzZWRUcmFuc2xhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvbG9jYWxpemUnO1xuaW1wb3J0IHtNZXNzYWdlUmVuZGVyZXJ9IGZyb20gJy4vbWVzc2FnZV9yZW5kZXJlcic7XG5cbi8qKlxuICogQSBtZXNzYWdlIHJlbmRlcmVyIHRoYXQgb3V0cHV0cyBgybVQYXJzZWRUcmFuc2xhdGlvbmAgb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhcmdldE1lc3NhZ2VSZW5kZXJlciBpbXBsZW1lbnRzIE1lc3NhZ2VSZW5kZXJlcjzJtVBhcnNlZFRyYW5zbGF0aW9uPiB7XG4gIHByaXZhdGUgY3VycmVudDogTWVzc2FnZUluZm8gPSB7bWVzc2FnZVBhcnRzOiBbXSwgcGxhY2Vob2xkZXJOYW1lczogW10sIHRleHQ6ICcnfTtcbiAgcHJpdmF0ZSBpY3VEZXB0aCA9IDA7XG5cbiAgZ2V0IG1lc3NhZ2UoKTogybVQYXJzZWRUcmFuc2xhdGlvbiB7XG4gICAgY29uc3Qge21lc3NhZ2VQYXJ0cywgcGxhY2Vob2xkZXJOYW1lc30gPSB0aGlzLmN1cnJlbnQ7XG4gICAgcmV0dXJuIMm1bWFrZVBhcnNlZFRyYW5zbGF0aW9uKG1lc3NhZ2VQYXJ0cywgcGxhY2Vob2xkZXJOYW1lcyk7XG4gIH1cbiAgc3RhcnRSZW5kZXIoKTogdm9pZCB7fVxuICBlbmRSZW5kZXIoKTogdm9pZCB7IHRoaXMuc3RvcmVNZXNzYWdlUGFydCgpOyB9XG4gIHRleHQodGV4dDogc3RyaW5nKTogdm9pZCB7IHRoaXMuY3VycmVudC50ZXh0ICs9IHRleHQ7IH1cbiAgcGxhY2Vob2xkZXIobmFtZTogc3RyaW5nLCBib2R5OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZCB7IHRoaXMucmVuZGVyUGxhY2Vob2xkZXIobmFtZSk7IH1cbiAgc3RhcnRQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpOiB2b2lkIHsgdGhpcy5yZW5kZXJQbGFjZWhvbGRlcihuYW1lKTsgfVxuICBjbG9zZVBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHZvaWQgeyB0aGlzLnJlbmRlclBsYWNlaG9sZGVyKG5hbWUpOyB9XG4gIHN0YXJ0Q29udGFpbmVyKCk6IHZvaWQge31cbiAgY2xvc2VDb250YWluZXIoKTogdm9pZCB7fVxuICBzdGFydEljdSgpOiB2b2lkIHtcbiAgICB0aGlzLmljdURlcHRoKys7XG4gICAgdGhpcy50ZXh0KCd7Jyk7XG4gIH1cbiAgZW5kSWN1KCk6IHZvaWQge1xuICAgIHRoaXMuaWN1RGVwdGgtLTtcbiAgICB0aGlzLnRleHQoJ30nKTtcbiAgfVxuICBwcml2YXRlIHJlbmRlclBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmljdURlcHRoID4gMCkge1xuICAgICAgdGhpcy50ZXh0KGB7JHtuYW1lfX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZU1lc3NhZ2VQYXJ0KCk7XG4gICAgICB0aGlzLmN1cnJlbnQucGxhY2Vob2xkZXJOYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIHN0b3JlTWVzc2FnZVBhcnQoKSB7XG4gICAgdGhpcy5jdXJyZW50Lm1lc3NhZ2VQYXJ0cy5wdXNoKHRoaXMuY3VycmVudC50ZXh0KTtcbiAgICB0aGlzLmN1cnJlbnQudGV4dCA9ICcnO1xuICB9XG59XG5cbmludGVyZmFjZSBNZXNzYWdlSW5mbyB7XG4gIG1lc3NhZ2VQYXJ0czogc3RyaW5nW107XG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdO1xuICB0ZXh0OiBzdHJpbmc7XG59Il19