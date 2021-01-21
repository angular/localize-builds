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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL2V4dHJhY3QvdHJhbnNsYXRpb25fZmlsZXMvYXJiX3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLHlGQUF5RDtJQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBQ0g7UUFDRSxrQ0FDWSxZQUFvQixFQUFVLFFBQXdCLEVBQ3RELEVBQW9CO1lBRHBCLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7WUFDdEQsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFBRyxDQUFDO1FBRXBDLDRDQUFTLEdBQVQsVUFBVSxRQUEwQjs7WUFDbEMsSUFBTSxhQUFhLEdBQUcsMkJBQW1CLENBQUMsUUFBUSxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7WUFFdEYsSUFBSSxNQUFNLEdBQUcsd0JBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBRyxDQUFDOztnQkFFckUsS0FBZ0MsSUFBQSxrQkFBQSxpQkFBQSxhQUFhLENBQUEsNENBQUEsdUVBQUU7b0JBQTFDLElBQU0saUJBQWlCLDBCQUFBO29CQUMxQixJQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQ3hCLEVBQUUsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxtQkFBVyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsRUFBVixDQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUMxRjs7Ozs7Ozs7O1lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUVoQixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRU8sbURBQWdCLEdBQXhCLFVBQXlCLEVBQVUsRUFBRSxPQUF1QjtZQUMxRCxPQUFPLFVBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUcsQ0FBQztRQUN2RSxDQUFDO1FBRU8sZ0RBQWEsR0FBckIsVUFBc0IsRUFBVSxFQUFFLFdBQTZCLEVBQUUsU0FBNEI7WUFFM0YsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO1lBRTFCLElBQUksV0FBVyxFQUFFO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFHLENBQUMsQ0FBQzthQUNsRTtZQUVELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksV0FBVyxHQUFHLDBCQUF3QixDQUFDO2dCQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFO2dCQUNELFdBQVcsSUFBSSxTQUFTLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDeEI7WUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVGLENBQUM7UUFFTyxvREFBaUIsR0FBekIsVUFBMEIsRUFBbUM7Z0JBQWxDLElBQUksVUFBQSxFQUFFLEtBQUssV0FBQSxFQUFFLEdBQUcsU0FBQTtZQUN6QyxPQUFPO2dCQUNMLFNBQVM7Z0JBQ1QsdUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFHO2dCQUMzRSxzQ0FBK0IsS0FBSyxDQUFDLElBQUksMEJBQWlCLEtBQUssQ0FBQyxNQUFNLFVBQU07Z0JBQzVFLG9DQUE2QixHQUFHLENBQUMsSUFBSSwwQkFBaUIsR0FBRyxDQUFDLE1BQU0sU0FBSztnQkFDckUsU0FBUzthQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2YsQ0FBQztRQUNILCtCQUFDO0lBQUQsQ0FBQyxBQXhERCxJQXdEQztJQXhEWSw0REFBd0I7SUEwRHJDLFNBQVMsWUFBWSxDQUFDLE9BQXVCO1FBQzNDLE9BQU8sT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFBhdGhNYW5pcHVsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHvJtVBhcnNlZE1lc3NhZ2UsIMm1U291cmNlTG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7VHJhbnNsYXRpb25TZXJpYWxpemVyfSBmcm9tICcuL3RyYW5zbGF0aW9uX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtjb25zb2xpZGF0ZU1lc3NhZ2VzLCBoYXNMb2NhdGlvbn0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQSB0cmFuc2xhdGlvbiBzZXJpYWxpemVyIHRoYXQgY2FuIHJlbmRlciBKU09OIGZvcm1hdHRlZCBhcyBhbiBBcHBsaWNhdGlvbiBSZXNvdXJjZSBCdW5kbGUgKEFSQikuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvYXBwLXJlc291cmNlLWJ1bmRsZS93aWtpL0FwcGxpY2F0aW9uUmVzb3VyY2VCdW5kbGVTcGVjaWZpY2F0aW9uXG4gKlxuICogYGBgXG4gKiB7XG4gKiAgIFwiQEBsb2NhbGVcIjogXCJlbi1VU1wiLFxuICogICBcIm1lc3NhZ2UtaWRcIjogXCJUYXJnZXQgbWVzc2FnZSBzdHJpbmdcIixcbiAqICAgXCJAbWVzc2FnZS1pZFwiOiB7XG4gKiAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICogICAgIFwiZGVzY3JpcHRpb25cIjogXCJTb21lIGRlc2NyaXB0aW9uIHRleHRcIixcbiAqICAgICBcIngtbG9jYXRpb25zXCI6IFtcbiAqICAgICAgIHtcbiAqICAgICAgICAgXCJzdGFydFwiOiB7XCJsaW5lXCI6IDIzLCBcImNvbHVtblwiOiAxNDV9LFxuICogICAgICAgICBcImVuZFwiOiB7XCJsaW5lXCI6IDI0LCBcImNvbHVtblwiOiA1M30sXG4gKiAgICAgICAgIFwiZmlsZVwiOiBcInNvbWUvZmlsZS50c1wiXG4gKiAgICAgICB9LFxuICogICAgICAgLi4uXG4gKiAgICAgXVxuICogICB9LFxuICogICAuLi5cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQXJiVHJhbnNsYXRpb25TZXJpYWxpemVyIGltcGxlbWVudHMgVHJhbnNsYXRpb25TZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNvdXJjZUxvY2FsZTogc3RyaW5nLCBwcml2YXRlIGJhc2VQYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHByaXZhdGUgZnM6IFBhdGhNYW5pcHVsYXRpb24pIHt9XG5cbiAgc2VyaWFsaXplKG1lc3NhZ2VzOiDJtVBhcnNlZE1lc3NhZ2VbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZUdyb3VwcyA9IGNvbnNvbGlkYXRlTWVzc2FnZXMobWVzc2FnZXMsIG1lc3NhZ2UgPT4gZ2V0TWVzc2FnZUlkKG1lc3NhZ2UpKTtcblxuICAgIGxldCBvdXRwdXQgPSBge1xcbiAgXCJAQGxvY2FsZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuc291cmNlTG9jYWxlKX1gO1xuXG4gICAgZm9yIChjb25zdCBkdXBsaWNhdGVNZXNzYWdlcyBvZiBtZXNzYWdlR3JvdXBzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZHVwbGljYXRlTWVzc2FnZXNbMF07XG4gICAgICBjb25zdCBpZCA9IGdldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIG91dHB1dCArPSB0aGlzLnNlcmlhbGl6ZU1lc3NhZ2UoaWQsIG1lc3NhZ2UpO1xuICAgICAgb3V0cHV0ICs9IHRoaXMuc2VyaWFsaXplTWV0YShcbiAgICAgICAgICBpZCwgbWVzc2FnZS5kZXNjcmlwdGlvbiwgZHVwbGljYXRlTWVzc2FnZXMuZmlsdGVyKGhhc0xvY2F0aW9uKS5tYXAobSA9PiBtLmxvY2F0aW9uKSk7XG4gICAgfVxuXG4gICAgb3V0cHV0ICs9ICdcXG59JztcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1lc3NhZ2UoaWQ6IHN0cmluZywgbWVzc2FnZTogybVQYXJzZWRNZXNzYWdlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCxcXG4gICR7SlNPTi5zdHJpbmdpZnkoaWQpfTogJHtKU09OLnN0cmluZ2lmeShtZXNzYWdlLnRleHQpfWA7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU1ldGEoaWQ6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZ3x1bmRlZmluZWQsIGxvY2F0aW9uczogybVTb3VyY2VMb2NhdGlvbltdKTpcbiAgICAgIHN0cmluZyB7XG4gICAgY29uc3QgbWV0YTogc3RyaW5nW10gPSBbXTtcblxuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgbWV0YS5wdXNoKGBcXG4gICAgXCJkZXNjcmlwdGlvblwiOiAke0pTT04uc3RyaW5naWZ5KGRlc2NyaXB0aW9uKX1gKTtcbiAgICB9XG5cbiAgICBpZiAobG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBsb2NhdGlvblN0ciA9IGBcXG4gICAgXCJ4LWxvY2F0aW9uc1wiOiBbYDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxvY2F0aW9uU3RyICs9IChpID4gMCA/ICcsXFxuJyA6ICdcXG4nKSArIHRoaXMuc2VyaWFsaXplTG9jYXRpb24obG9jYXRpb25zW2ldKTtcbiAgICAgIH1cbiAgICAgIGxvY2F0aW9uU3RyICs9ICdcXG4gICAgXSc7XG4gICAgICBtZXRhLnB1c2gobG9jYXRpb25TdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRhLmxlbmd0aCA+IDAgPyBgLFxcbiAgJHtKU09OLnN0cmluZ2lmeSgnQCcgKyBpZCl9OiB7JHttZXRhLmpvaW4oJywnKX1cXG4gIH1gIDogJyc7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZUxvY2F0aW9uKHtmaWxlLCBzdGFydCwgZW5kfTogybVTb3VyY2VMb2NhdGlvbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGAgICAgICB7YCxcbiAgICAgIGAgICAgICAgIFwiZmlsZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuZnMucmVsYXRpdmUodGhpcy5iYXNlUGF0aCwgZmlsZSkpfSxgLFxuICAgICAgYCAgICAgICAgXCJzdGFydFwiOiB7IFwibGluZVwiOiBcIiR7c3RhcnQubGluZX1cIiwgXCJjb2x1bW5cIjogXCIke3N0YXJ0LmNvbHVtbn1cIiB9LGAsXG4gICAgICBgICAgICAgICBcImVuZFwiOiB7IFwibGluZVwiOiBcIiR7ZW5kLmxpbmV9XCIsIFwiY29sdW1uXCI6IFwiJHtlbmQuY29sdW1ufVwiIH1gLFxuICAgICAgYCAgICAgIH1gLFxuICAgIF0uam9pbignXFxuJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TWVzc2FnZUlkKG1lc3NhZ2U6IMm1UGFyc2VkTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlLmN1c3RvbUlkIHx8IG1lc3NhZ2UuaWQ7XG59XG4iXX0=