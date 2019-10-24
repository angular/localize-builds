/**
 * @license Angular v9.0.0-next.13+4.sha-5eb4641.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
 * License: MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/compiler')) :
    typeof define === 'function' && define.amd ? define('@angular/localize', ['exports', '@angular/compiler'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.localize = {}), global.ng.compiler));
}(this, function (exports, compiler) { 'use strict';

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * The character used to mark the start and end of a "block" in a `$localize` tagged string.
     * A block can indicate metadata about the message or specify a name of a placeholder for a
     * substitution expressions.
     *
     * For example:
     *
     * ```ts
     * $localize`Hello, ${title}:title:!`;
     * $localize`:meaning|description@@id:source message text`;
     * ```
     */
    var BLOCK_MARKER = ':';
    /**
     * The marker used to separate a message's "meaning" from its "description" in a metadata block.
     *
     * For example:
     *
     * ```ts
     * $localize `:correct|Indicates that the user got the answer correct: Right!`;
     * $localize `:movement|Button label for moving to the right: Right!`;
     * ```
     */
    var MEANING_SEPARATOR = '|';
    /**
     * The marker used to separate a message's custom "id" from its "description" in a metadata block.
     *
     * For example:
     *
     * ```ts
     * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
     * ```
     */
    var ID_SEPARATOR = '@@';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * Parse a `$localize` tagged string into a structure that can be used for translation.
     *
     * See `ParsedMessage` for an example.
     */
    function parseMessage(messageParts, expressions) {
        var substitutions = {};
        var metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
        var cleanedMessageParts = [metadata.text];
        var placeholderNames = [];
        var messageString = metadata.text;
        for (var i = 1; i < messageParts.length; i++) {
            var _a = splitBlock(messageParts[i], messageParts.raw[i]), messagePart = _a.text, _b = _a.block, placeholderName = _b === void 0 ? computePlaceholderName(i) : _b;
            messageString += "{$" + placeholderName + "}" + messagePart;
            if (expressions !== undefined) {
                substitutions[placeholderName] = expressions[i - 1];
            }
            placeholderNames.push(placeholderName);
            cleanedMessageParts.push(messagePart);
        }
        return {
            messageId: metadata.id || compiler.computeMsgId(messageString, metadata.meaning || ''),
            substitutions: substitutions,
            messageString: messageString,
            meaning: metadata.meaning || '',
            description: metadata.description || '',
            messageParts: cleanedMessageParts, placeholderNames: placeholderNames,
        };
    }
    /**
     * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
     *
     * If the message part has a metadata block this function will extract the `meaning`,
     * `description` and `id` (if provided) from the block. These metadata properties are serialized in
     * the string delimited by `|` and `@@` respectively.
     *
     * For example:
     *
     * ```ts
     * `:meaning|description@@id`
     * `:meaning|@@id`
     * `:meaning|description`
     * `description@@id`
     * `meaning|`
     * `description`
     * `@@id`
     * ```
     *
     * @param cooked The cooked version of the message part to parse.
     * @param raw The raw version of the message part to parse.
     * @returns A object containing any metadata that was parsed from the message part.
     */
    function parseMetadata(cooked, raw) {
        var _a = splitBlock(cooked, raw), text = _a.text, block = _a.block;
        if (block === undefined) {
            return { text: text, meaning: undefined, description: undefined, id: undefined };
        }
        else {
            var _b = __read(block.split(ID_SEPARATOR, 2), 2), meaningAndDesc = _b[0], id = _b[1];
            var _c = __read(meaningAndDesc.split(MEANING_SEPARATOR, 2), 2), meaning = _c[0], description = _c[1];
            if (description === undefined) {
                description = meaning;
                meaning = undefined;
            }
            if (description === '') {
                description = undefined;
            }
            return { text: text, meaning: meaning, description: description, id: id };
        }
    }
    /**
     * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
     * rest of the text of the message part.
     *
     * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
     * start and end of the block.
     *
     * If the block is in the first message part then it will be metadata about the whole message:
     * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
     * substitution: placeholder name.
     *
     * Since blocks are optional, it is possible that the content of a message block actually starts
     * with a block marker. In this case the marker must be escaped `\:`.
     *
     * ---
     *
     * If the template literal was synthesized and downleveled by TypeScript to ES5 then its
     * raw array will only contain empty strings. This is because the current TypeScript compiler uses
     * the original source code to find the raw text and in the case of synthesized AST nodes, there is
     * no source code to draw upon.
     *
     * The workaround in this function is to assume that the template literal did not contain an escaped
     * placeholder name, and fall back on checking the cooked array instead.
     * This is a limitation if compiling to ES5 in TypeScript but is not a problem if the TypeScript
     * output is ES2015 and the code is downlevelled by a separate tool as happens in the Angular CLI.
     *
     * @param cooked The cooked version of the message part to parse.
     * @param raw The raw version of the message part to parse.
     * @returns An object containing the `text` of the message part and the text of the `block`, if it
     * exists.
     * @throws an error if the `block` is unterminated
     */
    function splitBlock(cooked, raw) {
        raw = raw || cooked;
        if (raw.charAt(0) !== BLOCK_MARKER) {
            return { text: cooked };
        }
        else {
            var endOfBlock = findEndOfBlock(cooked, raw);
            return {
                block: cooked.substring(1, endOfBlock),
                text: cooked.substring(endOfBlock + 1),
            };
        }
    }
    function computePlaceholderName(index) {
        return index === 1 ? 'PH' : "PH_" + (index - 1);
    }
    /**
     * Find the end of a "marked block" indicated by the first non-escaped colon.
     *
     * @param cooked The cooked string (where escaped chars have been processed)
     * @param raw The raw string (where escape sequences are still in place)
     *
     * @returns the index of the end of block marker
     * @throws an error if the block is unterminated
     */
    function findEndOfBlock(cooked, raw) {
        /************************************************************************************************
        * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
        * (See that file for more explanation of why.)
        ************************************************************************************************/
        for (var cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
            if (raw[rawIndex] === '\\') {
                rawIndex++;
            }
            else if (cooked[cookedIndex] === BLOCK_MARKER) {
                return cookedIndex;
            }
        }
        throw new Error("Unterminated $localize metadata block in \"" + raw + "\".");
    }

    var MissingTranslationError = /** @class */ (function (_super) {
        __extends(MissingTranslationError, _super);
        function MissingTranslationError(parsedMessage) {
            var _this = _super.call(this, "No translation found for " + describeMessage(parsedMessage) + ".") || this;
            _this.parsedMessage = parsedMessage;
            _this.type = 'MissingTranslationError';
            return _this;
        }
        return MissingTranslationError;
    }(Error));
    function isMissingTranslationError(e) {
        return e.type === 'MissingTranslationError';
    }
    /**
     * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
     * `substitutions`) using the given `translations`.
     *
     * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
     * `ParsedTranslation`.
     *
     * If one is found then it is used to translate the message into a new set of `messageParts` and
     * `substitutions`.
     * The translation may reorder (or remove) substitutions as appropriate.
     *
     * If there is no translation with a matching message id then an error is thrown.
     * If a translation contains a placeholder that is not found in the message being translated then an
     * error is thrown.
     */
    function translate(translations, messageParts, substitutions) {
        var message = parseMessage(messageParts, substitutions);
        var translation = translations[message.messageId];
        if (translation === undefined) {
            throw new MissingTranslationError(message);
        }
        return [
            translation.messageParts, translation.placeholderNames.map(function (placeholder) {
                if (message.substitutions.hasOwnProperty(placeholder)) {
                    return message.substitutions[placeholder];
                }
                else {
                    throw new Error("No placeholder found with name " + placeholder + " in message " + describeMessage(message) + ".");
                }
            })
        ];
    }
    /**
     * Parse the `messageParts` and `placeholderNames` out of a target `message`.
     *
     * Used by `loadTranslations()` to convert target message strings into a structure that is more
     * appropriate for doing translation.
     *
     * @param message the message to be parsed.
     */
    function parseTranslation(message) {
        var parts = message.split(/{\$([^}]*)}/);
        var messageParts = [parts[0]];
        var placeholderNames = [];
        for (var i = 1; i < parts.length - 1; i += 2) {
            placeholderNames.push(parts[i]);
            messageParts.push("" + parts[i + 1]);
        }
        var rawMessageParts = messageParts.map(function (part) { return part.charAt(0) === BLOCK_MARKER ? '\\' + part : part; });
        return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames: placeholderNames };
    }
    /**
     * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
     *
     * @param messageParts The message parts to appear in the ParsedTranslation.
     * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
     */
    function makeParsedTranslation(messageParts, placeholderNames) {
        if (placeholderNames === void 0) { placeholderNames = []; }
        return { messageParts: makeTemplateObject(messageParts, messageParts), placeholderNames: placeholderNames };
    }
    /**
     * Create the specialized array that is passed to tagged-string tag functions.
     *
     * @param cooked The message parts with their escape codes processed.
     * @param raw The message parts with their escaped codes as-is.
     */
    function makeTemplateObject(cooked, raw) {
        Object.defineProperty(cooked, 'raw', { value: raw });
        return cooked;
    }
    function describeMessage(message) {
        var meaningString = message.meaning && " - \"" + message.meaning + "\"";
        return "\"" + message.messageId + "\" (\"" + message.messageString + "\"" + meaningString + ")";
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Load translations for `$localize`.
     *
     * The given `translations` are processed and added to a lookup based on their `MessageId`.
     * A new translation will overwrite a previous translation if it has the same `MessageId`.
     *
     * * If a message is generated by the Angular compiler from an `i18n` marker in a template, the
     *   `MessageId` is passed through to the `$localize` call as a custom `MessageId`. The `MessageId`
     *   will match what is extracted into translation files.
     *
     * * If the translation is from a call to `$localize` in application code, and no custom `MessageId`
     *   is provided, then the `MessageId` can be generated by passing the tagged string message-parts
     *   to the `parseMessage()` function (not currently public API).
     *
     * @publicApi
     *
     */
    function loadTranslations(translations) {
        // Ensure the translate function exists
        if (!$localize.translate) {
            $localize.translate = translate$1;
        }
        if (!$localize.TRANSLATIONS) {
            $localize.TRANSLATIONS = {};
        }
        Object.keys(translations).forEach(function (key) {
            $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
        });
    }
    /**
     * Remove all translations for `$localize`.
     *
     * @publicApi
     */
    function clearTranslations() {
        $localize.TRANSLATIONS = {};
    }
    /**
     * Translate the text of the given message, using the loaded translations.
     *
     * This function may reorder (or remove) substitutions as indicated in the matching translation.
     */
    function translate$1(messageParts, substitutions) {
        try {
            return translate($localize.TRANSLATIONS, messageParts, substitutions);
        }
        catch (e) {
            console.warn(e.message);
            return [messageParts, substitutions];
        }
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    exports.ɵcomputeMsgId = compiler.computeMsgId;
    exports.clearTranslations = clearTranslations;
    exports.loadTranslations = loadTranslations;
    exports.ɵMissingTranslationError = MissingTranslationError;
    exports.ɵfindEndOfBlock = findEndOfBlock;
    exports.ɵisMissingTranslationError = isMissingTranslationError;
    exports.ɵmakeParsedTranslation = makeParsedTranslation;
    exports.ɵmakeTemplateObject = makeTemplateObject;
    exports.ɵparseMessage = parseMessage;
    exports.ɵparseMetadata = parseMetadata;
    exports.ɵparseTranslation = parseTranslation;
    exports.ɵsplitBlock = splitBlock;
    exports.ɵtranslate = translate;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=localize.umd.js.map
