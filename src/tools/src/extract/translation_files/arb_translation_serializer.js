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
    var ArbTranslationSerializer = /** @class */ (function () {
        function ArbTranslationSerializer(sourceLocale, basePath, fs) {
            this.sourceLocale = sourceLocale;
            this.basePath = basePath;
            this.fs = fs;
        }
        ArbTranslationSerializer.prototype.serialize = function (messages) {
            var e_1, _a;
            var messageGroups = (0, utils_1.consolidateMessages)(messages, function (message) { return getMessageId(message); });
            var output = "{\n  \"@@locale\": " + JSON.stringify(this.sourceLocale);
            try {
                for (var messageGroups_1 = (0, tslib_1.__values)(messageGroups), messageGroups_1_1 = messageGroups_1.next(); !messageGroups_1_1.done; messageGroups_1_1 = messageGroups_1.next()) {
                    var duplicateMessages = messageGroups_1_1.value;
                    var message = duplicateMessages[0];
                    var id = getMessageId(message);
                    output += this.serializeMessage(id, message);
                    output += this.serializeMeta(id, message.description, message.meaning, duplicateMessages.filter(utils_1.hasLocation).map(function (m) { return m.location; }));
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
        ArbTranslationSerializer.prototype.serializeMeta = function (id, description, meaning, locations) {
            var meta = [];
            if (description) {
                meta.push("\n    \"description\": " + JSON.stringify(description));
            }
            if (meaning) {
                meta.push("\n    \"x-meaning\": " + JSON.stringify(meaning));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLHlGQUF5RDtJQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBQ0g7UUFDRSxrQ0FDWSxZQUFvQixFQUFVLFFBQXdCLEVBQ3RELEVBQW9CO1lBRHBCLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFDdEQsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFBRyxDQUFDO1FBRXBDLDRDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxhQUFhLEdBQUcsSUFBQSwyQkFBbUIsRUFBQyxRQUFRLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztZQUV0RixJQUFJLE1BQU0sR0FBRyx3QkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFHLENBQUM7O2dCQUVyRSxLQUFnQyxJQUFBLGtCQUFBLHNCQUFBLGFBQWEsQ0FBQSw0Q0FBQSx1RUFBRTtvQkFBMUMsSUFBTSxpQkFBaUIsMEJBQUE7b0JBQzFCLElBQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM3QyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FDeEIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFDeEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLG1CQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFWLENBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pFOzs7Ozs7Ozs7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDO1lBRWhCLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFTyxtREFBZ0IsR0FBeEIsVUFBeUIsRUFBVSxFQUFFLE9BQXVCO1lBQzFELE9BQU8sVUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxVQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRyxDQUFDO1FBQ3ZFLENBQUM7UUFFTyxnREFBYSxHQUFyQixVQUNJLEVBQVUsRUFBRSxXQUE2QixFQUFFLE9BQXlCLEVBQ3BFLFNBQTRCO1lBQzlCLElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztZQUUxQixJQUFJLFdBQVcsRUFBRTtnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUF3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7YUFDbEU7WUFFRCxJQUFJLE9BQU8sRUFBRTtnQkFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBRyxDQUFDLENBQUM7YUFDNUQ7WUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLFdBQVcsR0FBRywwQkFBd0IsQ0FBQztnQkFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3pDLFdBQVcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5RTtnQkFDRCxXQUFXLElBQUksU0FBUyxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3hCO1lBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RixDQUFDO1FBRU8sb0RBQWlCLEdBQXpCLFVBQTBCLEVBQW1DO2dCQUFsQyxJQUFJLFVBQUEsRUFBRSxLQUFLLFdBQUEsRUFBRSxHQUFHLFNBQUE7WUFDekMsT0FBTztnQkFDTCxTQUFTO2dCQUNULHVCQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBRztnQkFDM0Usc0NBQStCLEtBQUssQ0FBQyxJQUFJLDBCQUFpQixLQUFLLENBQUMsTUFBTSxVQUFNO2dCQUM1RSxvQ0FBNkIsR0FBRyxDQUFDLElBQUksMEJBQWlCLEdBQUcsQ0FBQyxNQUFNLFNBQUs7Z0JBQ3JFLFNBQVM7YUFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLENBQUM7UUFDSCwrQkFBQztJQUFELENBQUMsQUE5REQsSUE4REM7SUE5RFksNERBQXdCO0lBZ0VyQyxTQUFTLFlBQVksQ0FBQyxPQUF1QjtRQUMzQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBQYXRoTWFuaXB1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb21waWxlci1jbGkvc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7ybVQYXJzZWRNZXNzYWdlLCDJtVNvdXJjZUxvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9sb2NhbGl6ZSc7XG5pbXBvcnQge1RyYW5zbGF0aW9uU2VyaWFsaXplcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9zZXJpYWxpemVyJztcbmltcG9ydCB7Y29uc29saWRhdGVNZXNzYWdlcywgaGFzTG9jYXRpb259IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEEgdHJhbnNsYXRpb24gc2VyaWFsaXplciB0aGF0IGNhbiByZW5kZXIgSlNPTiBmb3JtYXR0ZWQgYXMgYW4gQXBwbGljYXRpb24gUmVzb3VyY2UgQnVuZGxlIChBUkIpLlxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2FwcC1yZXNvdXJjZS1idW5kbGUvd2lraS9BcHBsaWNhdGlvblJlc291cmNlQnVuZGxlU3BlY2lmaWNhdGlvblxuICpcbiAqIGBgYFxuICoge1xuICogICBcIkBAbG9jYWxlXCI6IFwiZW4tVVNcIixcbiAqICAgXCJtZXNzYWdlLWlkXCI6IFwiVGFyZ2V0IG1lc3NhZ2Ugc3RyaW5nXCIsXG4gKiAgIFwiQG1lc3NhZ2UtaWRcIjoge1xuICogICAgIFwidHlwZVwiOiBcInRleHRcIixcbiAqICAgICBcImRlc2NyaXB0aW9uXCI6IFwiU29tZSBkZXNjcmlwdGlvbiB0ZXh0XCIsXG4gKiAgICAgXCJ4LWxvY2F0aW9uc1wiOiBbXG4gKiAgICAgICB7XG4gKiAgICAgICAgIFwic3RhcnRcIjoge1wibGluZVwiOiAyMywgXCJjb2x1bW5cIjogMTQ1fSxcbiAqICAgICAgICAgXCJlbmRcIjoge1wibGluZVwiOiAyNCwgXCJjb2x1bW5cIjogNTN9LFxuICogICAgICAgICBcImZpbGVcIjogXCJzb21lL2ZpbGUudHNcIlxuICogICAgICAgfSxcbiAqICAgICAgIC4uLlxuICogICAgIF1cbiAqICAgfSxcbiAqICAgLi4uXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEFyYlRyYW5zbGF0aW9uU2VyaWFsaXplciBpbXBsZW1lbnRzIFRyYW5zbGF0aW9uU2VyaWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBzb3VyY2VMb2NhbGU6IHN0cmluZywgcHJpdmF0ZSBiYXNlUGF0aDogQWJzb2x1dGVGc1BhdGgsXG4gICAgICBwcml2YXRlIGZzOiBQYXRoTWFuaXB1bGF0aW9uKSB7fVxuXG4gIHNlcmlhbGl6ZShtZXNzYWdlczogybVQYXJzZWRNZXNzYWdlW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2VHcm91cHMgPSBjb25zb2xpZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBtZXNzYWdlID0+IGdldE1lc3NhZ2VJZChtZXNzYWdlKSk7XG5cbiAgICBsZXQgb3V0cHV0ID0gYHtcXG4gIFwiQEBsb2NhbGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLnNvdXJjZUxvY2FsZSl9YDtcblxuICAgIGZvciAoY29uc3QgZHVwbGljYXRlTWVzc2FnZXMgb2YgbWVzc2FnZUdyb3Vwcykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGR1cGxpY2F0ZU1lc3NhZ2VzWzBdO1xuICAgICAgY29uc3QgaWQgPSBnZXRNZXNzYWdlSWQobWVzc2FnZSk7XG4gICAgICBvdXRwdXQgKz0gdGhpcy5zZXJpYWxpemVNZXNzYWdlKGlkLCBtZXNzYWdlKTtcbiAgICAgIG91dHB1dCArPSB0aGlzLnNlcmlhbGl6ZU1ldGEoXG4gICAgICAgICAgaWQsIG1lc3NhZ2UuZGVzY3JpcHRpb24sIG1lc3NhZ2UubWVhbmluZyxcbiAgICAgICAgICBkdXBsaWNhdGVNZXNzYWdlcy5maWx0ZXIoaGFzTG9jYXRpb24pLm1hcChtID0+IG0ubG9jYXRpb24pKTtcbiAgICB9XG5cbiAgICBvdXRwdXQgKz0gJ1xcbn0nO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWVzc2FnZShpZDogc3RyaW5nLCBtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiBgLFxcbiAgJHtKU09OLnN0cmluZ2lmeShpZCl9OiAke0pTT04uc3RyaW5naWZ5KG1lc3NhZ2UudGV4dCl9YDtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTWV0YShcbiAgICAgIGlkOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmd8dW5kZWZpbmVkLCBtZWFuaW5nOiBzdHJpbmd8dW5kZWZpbmVkLFxuICAgICAgbG9jYXRpb25zOiDJtVNvdXJjZUxvY2F0aW9uW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IG1ldGE6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIG1ldGEucHVzaChgXFxuICAgIFwiZGVzY3JpcHRpb25cIjogJHtKU09OLnN0cmluZ2lmeShkZXNjcmlwdGlvbil9YCk7XG4gICAgfVxuXG4gICAgaWYgKG1lYW5pbmcpIHtcbiAgICAgIG1ldGEucHVzaChgXFxuICAgIFwieC1tZWFuaW5nXCI6ICR7SlNPTi5zdHJpbmdpZnkobWVhbmluZyl9YCk7XG4gICAgfVxuXG4gICAgaWYgKGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbG9jYXRpb25TdHIgPSBgXFxuICAgIFwieC1sb2NhdGlvbnNcIjogW2A7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsb2NhdGlvblN0ciArPSAoaSA+IDAgPyAnLFxcbicgOiAnXFxuJykgKyB0aGlzLnNlcmlhbGl6ZUxvY2F0aW9uKGxvY2F0aW9uc1tpXSk7XG4gICAgICB9XG4gICAgICBsb2NhdGlvblN0ciArPSAnXFxuICAgIF0nO1xuICAgICAgbWV0YS5wdXNoKGxvY2F0aW9uU3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0YS5sZW5ndGggPiAwID8gYCxcXG4gICR7SlNPTi5zdHJpbmdpZnkoJ0AnICsgaWQpfTogeyR7bWV0YS5qb2luKCcsJyl9XFxuICB9YCA6ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVMb2NhdGlvbih7ZmlsZSwgc3RhcnQsIGVuZH06IMm1U291cmNlTG9jYXRpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiBbXG4gICAgICBgICAgICAge2AsXG4gICAgICBgICAgICAgICBcImZpbGVcIjogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmZzLnJlbGF0aXZlKHRoaXMuYmFzZVBhdGgsIGZpbGUpKX0sYCxcbiAgICAgIGAgICAgICAgIFwic3RhcnRcIjogeyBcImxpbmVcIjogXCIke3N0YXJ0LmxpbmV9XCIsIFwiY29sdW1uXCI6IFwiJHtzdGFydC5jb2x1bW59XCIgfSxgLFxuICAgICAgYCAgICAgICAgXCJlbmRcIjogeyBcImxpbmVcIjogXCIke2VuZC5saW5lfVwiLCBcImNvbHVtblwiOiBcIiR7ZW5kLmNvbHVtbn1cIiB9YCxcbiAgICAgIGAgICAgICB9YCxcbiAgICBdLmpvaW4oJ1xcbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2VJZChtZXNzYWdlOiDJtVBhcnNlZE1lc3NhZ2UpOiBzdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZS5jdXN0b21JZCB8fCBtZXNzYWdlLmlkO1xufVxuIl19