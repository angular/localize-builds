(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/extract/translation_files/arb_translation_serializer", ["require", "exports", "tslib", "@angular/localize/src/tools/src/extract/translation_files/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArbTranslationSerializer = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@angular/localize/src/tools/src/extract/translation_files/utils");
    /**
     * A translation serializer that can render JSON formatted as an Application Resource Bundle (ARB).
     *
     * See https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification
     *
     * ```
     * {
     *   "@@locale": "en-US",
     *   "message-id": "Target message string",
     *   "@message-id": {
     *     "type": "text",
     *     "description": "Some description text",
     *     "x-locations": [
     *       {
     *         "start": {"line": 23, "column": 145},
     *         "end": {"line": 24, "column": 53},
     *         "file": "some/file.ts"
     *       },
     *       ...
     *     ]
     *   },
     *   ...
     * }
     * ```
     */
    /**
     * This is a semi-public bespoke serialization format that is used for testing and sometimes as a
     * format for storing translations that will be inlined at runtime.
     *
     * @see ArbTranslationParser
     */
    var ArbTranslationSerializer = /** @class */ (function () {
        function ArbTranslationSerializer(sourceLocale, basePath, fs) {
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.fs = fs;
        }
        ArbTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var messageGroups = utils_1.consolidateMessages(messages, function (message) { return getMessageId(message); });
            var output = "{\n  \"@@locale\": " + JSON.stringify(this.sourceLocale);
            try {
                for (var messageGroups_1 = tslib_1.__values(messageGroups), messageGroups_1_1 = messageGroups_1.next(); !messageGroups_1_1.done; messageGroups_1_1 = messageGroups_1.next()) {
                    var duplicateMessages = messageGroups_1_1.value;
                    var message = duplicateMessages[0];
                    var id = getMessageId(message);
                    output += this.serializeMessage(id, message);
                    output += this.serializeMeta(id, message.description, duplicateMessages.filter(utils_1.hasLocation).map(function (m) { return m.location; }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messageGroups_1_1 && !messageGroups_1_1.done && (_a = messageGroups_1.return)) _a.call(messageGroups_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            output += '\n}';
            return output;
        };
        ArbTranslationSerializer.prototype.serializeMessage = function (id, message) {
            return ",\n  " + JSON.stringify(id) + ": " + JSON.stringify(message.text);
        };
        ArbTranslationSerializer.prototype.serializeMeta = function (id, description, locations) {
            var meta = [];
            if (description) {
                meta.push("\n    \"description\": " + JSON.stringify(description));
            }
            if (locations.length > 0) {
                var locationStr = "\n    \"x-locations\": [";
                for (var i = 0; i < locations.length; i++) {
                    locationStr += (i > 0 ? ',\n' : '\n') + this.serializeLocation(locations[i]);
                }
                locationStr += '\n    ]';
                meta.push(locationStr);
            }
            return meta.length > 0 ? ",\n  " + JSON.stringify('@' + id) + ": {" + meta.join(',') + "\n  }" : '';
        };
        ArbTranslationSerializer.prototype.serializeLocation = function (_a) {
            var file = _a.file, start = _a.start, end = _a.end;
            return [
                "      {",
                "        \"file\": " + JSON.stringify(this.fs.relative(this.basePath, file)) + ",",
                "        \"start\": { \"line\": \"" + start.line + "\", \"column\": \"" + start.column + "\" },",
                "        \"end\": { \"line\": \"" + end.line + "\", \"column\": \"" + end.column + "\" }",
                "      }",
            ].join('\n');
        };
        return ArbTranslationSerializer;
    }());
    exports.ArbTranslationSerializer = ArbTranslationSerializer;
    function getMessageId(message) {
        return message.customId || message.id;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVdBLHlGQUF5RDtJQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBRUg7Ozs7O09BS0c7SUFDSDtRQUNFLGtDQUNZLFlBQW9CLEVBQVUsUUFBd0IsRUFBVSxFQUFjO1lBQTlFLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQUcsQ0FBQztRQUU5Riw0Q0FBUyxHQUFULFVBQVUsUUFBMEI7O1lBQ2xDLElBQU0sYUFBYSxHQUFHLDJCQUFtQixDQUFDLFFBQVEsRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1lBRXRGLElBQUksTUFBTSxHQUFHLHdCQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUcsQ0FBQzs7Z0JBRXJFLEtBQWdDLElBQUEsa0JBQUEsaUJBQUEsYUFBYSxDQUFBLDRDQUFBLHVFQUFFO29CQUExQyxJQUFNLGlCQUFpQiwwQkFBQTtvQkFDMUIsSUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLElBQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakMsTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUN4QixFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsbUJBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLEVBQVYsQ0FBVSxDQUFDLENBQUMsQ0FBQztpQkFDMUY7Ozs7Ozs7OztZQUVELE1BQU0sSUFBSSxLQUFLLENBQUM7WUFFaEIsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVPLG1EQUFnQixHQUF4QixVQUF5QixFQUFVLEVBQUUsT0FBdUI7WUFDMUQsT0FBTyxVQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFVBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFHLENBQUM7UUFDdkUsQ0FBQztRQUVPLGdEQUFhLEdBQXJCLFVBQXNCLEVBQVUsRUFBRSxXQUE2QixFQUFFLFNBQTRCO1lBRTNGLElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztZQUUxQixJQUFJLFdBQVcsRUFBRTtnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUF3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7YUFDbEU7WUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLFdBQVcsR0FBRywwQkFBd0IsQ0FBQztnQkFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3pDLFdBQVcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5RTtnQkFDRCxXQUFXLElBQUksU0FBUyxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3hCO1lBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RixDQUFDO1FBRU8sb0RBQWlCLEdBQXpCLFVBQTBCLEVBQW1DO2dCQUFsQyxJQUFJLFVBQUEsRUFBRSxLQUFLLFdBQUEsRUFBRSxHQUFHLFNBQUE7WUFDekMsT0FBTztnQkFDTCxTQUFTO2dCQUNULHVCQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBRztnQkFDM0Usc0NBQStCLEtBQUssQ0FBQyxJQUFJLDBCQUFpQixLQUFLLENBQUMsTUFBTSxVQUFNO2dCQUM1RSxvQ0FBNkIsR0FBRyxDQUFDLElBQUksMEJBQWlCLEdBQUcsQ0FBQyxNQUFNLFNBQUs7Z0JBQ3JFLFNBQVM7YUFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLENBQUM7UUFDSCwrQkFBQztJQUFELENBQUMsQUF2REQsSUF1REM7SUF2RFksNERBQXdCO0lBeURyQyxTQUFTLFlBQVksQ0FBQyxPQUF1QjtRQUMzQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBGaWxlU3lzdGVtfSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge0FyYkpzb25PYmplY3QsIEFyYkxvY2F0aW9uLCBBcmJNZXRhZGF0YX0gZnJvbSAnLi4vLi4vdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL3RyYW5zbGF0aW9uX3BhcnNlcnMvYXJiX3RyYW5zbGF0aW9uX3BhcnNlcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7Y29uc29saWRhdGVNZXNzYWdlcywgaGFzTG9jYXRpb259IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiByZW5kZXIgSlNPTiBmb3JtYXR0ZWQgYXMgYW4gQXBwbGljYXRpb24gUmVzb3VyY2UgQnVuZGxlIChBUkIpLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2FwcC1yZXNvdXJjZS1idW5kbGUvd2lraS9BcHBsaWNhdGlvblJlc291cmNlQnVuZGxlU3BlY2lmaWNhdGlvblxuICpcbiAqIGBgYFxuICoge1xuICogICBcIkBAbG9jYWxlXCI6IFwiZW4tVVNcIixcbiAqICAgXCJtZXNzYWdlLWlkXCI6IFwiVGFyZ2V0IG1lc3NhZ2Ugc3RyaW5nXCIsXG4gKiAgIFwiQG1lc3NhZ2UtaWRcIjoge1xuICogICAgIFwidHlwZVwiOiBcInRleHRcIixcbiAqICAgICBcImRlc2NyaXB0aW9uXCI6IFwiU29tZSBkZXNjcmlwdGlvbiB0ZXh0XCIsXG4gKiAgICAgXCJ4LWxvY2F0aW9uc1wiOiBbXG4gKiAgICAgICB7XG4gKiAgICAgICAgIFwic3RhcnRcIjoge1wibGluZVwiOiAyMywgXCJjb2x1bW5cIjogMTQ1fSxcbiAqICAgICAgICAgXCJlbmRcIjoge1wibGluZVwiOiAyNCwgXCJjb2x1bW5cIjogNTN9LFxuICogICAgICAgICBcImZpbGVcIjogXCJzb21lL2ZpbGUudHNcIlxuICogICAgICAgfSxcbiAqICAgICAgIC4uLlxuICogICAgIF1cbiAqICAgfSxcbiAqICAgLi4uXG4gKiB9XG4gKiBgYGBcbiAqL1xuXG4vKipcbiAqIFRoaXMgaXMgYSBzZW1pLXB1YmxpYyBiZXNwb2tlIHNlcmlhbGl6YXRpb24gZm9ybWF0IHRoYXQgaXMgdXNlZCBmb3IgdGVzdGluZyBhbmQgc29tZXRpbWVzIGFzIGFcbiAqIGZvcm1hdCBmb3Igc3RvcmluZyB0cmFuc2xhdGlvbnMgdGhhdCB3aWxsIGJlIGlubGluZWQgYXQgcnVudGltZS5cbiAqXG4gKiBAc2VlIEFyYlRyYW5zbGF0aW9uUGFyc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBBcmJUcmFuc2xhdGlvblNlcmlhbGl6ZXIgaW1wbGVtZW50cyBUcmFuc2xhdGlvblNlcmlhbGl6ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc291cmNlTG9jYWxlOiBzdHJpbmcsIHByaXZhdGUgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRoLCBwcml2YXRlIGZzOiBGaWxlU3lzdGVtKSB7fVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2VHcm91cHMgPSBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IGdldE1lc3NhZ2VJZChtZXNzYWdlKSk7XG5cbiAgICBsZXQgb3V0cHV0ID0gYHtcXG4gIFwiQEBsb2NhbGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnNvdXJjZUxvY2FsZSl9YDtcblxuICAgIGZvciAoY29uc3QgZHVwbGljYXRlTWVzc2FnZXMgb2YgbWVzc2FnZUdyb3Vwcykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGR1cGxpY2F0ZU1lc3NhZ2VzWzBdO1xuICAgICAgY29uc3QgaWQgPSBnZXRNZXNzYWdlSWQobWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gdGhpcy5zZXJpYWxpemVNZXNzYWdlKGlkLCBtZXNzYWdlKTtcbiAgICAgIG91dHB1dCArPSB0aGlzLnNlcmlhbGl6ZU1ldGEoXG4gICAgICAgICAgaWQsIG1lc3NhZ2UuZGVzY3JpcHRpb24sIGR1cGxpY2F0ZU1lc3NhZ2VzLmZpbHRlcihoYXNMb2NhdGlvbikubWFwKG0gPT4gbS5sb2NhdGlvbikpO1xuICAgIH1cblxuICAgIG91dHB1dCArPSAnXFxufSc7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXNzYWdlKGlkOiBzdHJpbmcsIG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAsXFxuICAke0pTT04uc3RyaW5naWZ5KGlkKX06ICR7SlNPTi5zdHJpbmdpZnkobWVzc2FnZS50ZXh0KX1gO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVNZXRhKGlkOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmd8dW5kZWZpbmVkLCBsb2NhdGlvbnM6IMm1U291cmNlTG9jYXRpb25bXSk6XG4gICAgICBzdHJpbmcge1xuICAgIGNvbnN0IG1ldGE6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIG1ldGEucHVzaChgXFxuICAgIFwiZGVzY3JpcHRpb25cIjogJHtKU09OLnN0cmluZ2lmeShkZXNjcmlwdGlvbil9YCk7XG4gICAgfVxuXG4gICAgaWYgKGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbG9jYXRpb25TdHIgPSBgXFxuICAgIFwieC1sb2NhdGlvbnNcIjogW2A7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsb2NhdGlvblN0ciArPSAoaSA+IDAgPyAnLFxcbicgOiAnXFxuJykgKyB0aGlzLnNlcmlhbGl6ZUxvY2F0aW9uKGxvY2F0aW9uc1tpXSk7XG4gICAgICB9XG4gICAgICBsb2NhdGlvblN0ciArPSAnXFxuICAgIF0nO1xuICAgICAgbWV0YS5wdXNoKGxvY2F0aW9uU3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0YS5sZW5ndGggPiAwID8gYCxcXG4gICR7SlNPTi5zdHJpbmdpZnkoJ0AnICsgaWQpfTogeyR7bWV0YS5qb2luKCcsJyl9XFxuICB9YCA6ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVMb2NhdGlvbih7ZmlsZSwgc3RhcnQsIGVuZH06IMm1U291cmNlTG9jYXRpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiBbXG4gICAgICBgICAgICAge2AsXG4gICAgICBgICAgICAgICBcImZpbGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpKX0sYCxcbiAgICAgIGAgICAgICAgIFwic3RhcnRcIjogeyBcImxpbmVcIjogXCIke3N0YXJ0LmxpbmV9XCIsIFwiY29sdW1uXCI6IFwiJHtzdGFydC5jb2x1bW59XCIgfSxgLFxuICAgICAgYCAgICAgICAgXCJlbmRcIjogeyBcImxpbmVcIjogXCIke2VuZC5saW5lfVwiLCBcImNvbHVtblwiOiBcIiR7ZW5kLmNvbHVtbn1cIiB9YCxcbiAgICAgIGAgICAgICB9YCxcbiAgICBdLmpvaW4oJ1xcbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2VJZChtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fCBtZXNzYWdlLmlkO1xufVxuIl19