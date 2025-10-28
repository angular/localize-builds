/**
 * @license Angular v21.0.0-next.9+sha-4f21ea7
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import { parseMessage, BLOCK_MARKER } from './_localize-chunk.mjs';
export { $localize as ɵ$localize, computeMsgId as ɵcomputeMsgId, findEndOfBlock as ɵfindEndOfBlock, parseMetadata as ɵparseMetadata, splitBlock as ɵsplitBlock } from './_localize-chunk.mjs';

class MissingTranslationError extends Error {
  parsedMessage;
  type = 'MissingTranslationError';
  constructor(parsedMessage) {
    super(`No translation found for ${describeMessage(parsedMessage)}.`);
    this.parsedMessage = parsedMessage;
  }
}
function isMissingTranslationError(e) {
  return e.type === 'MissingTranslationError';
}
function translate$1(translations, messageParts, substitutions) {
  const message = parseMessage(messageParts, substitutions);
  let translation = translations[message.id];
  if (message.legacyIds !== undefined) {
    for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
      translation = translations[message.legacyIds[i]];
    }
  }
  if (translation === undefined) {
    throw new MissingTranslationError(message);
  }
  return [translation.messageParts, translation.placeholderNames.map(placeholder => {
    if (message.substitutions.hasOwnProperty(placeholder)) {
      return message.substitutions[placeholder];
    } else {
      throw new Error(`There is a placeholder name mismatch with the translation provided for the message ${describeMessage(message)}.\n` + `The translation contains a placeholder with name ${placeholder}, which does not exist in the message.`);
    }
  })];
}
function parseTranslation(messageString) {
  const parts = messageString.split(/{\$([^}]*)}/);
  const messageParts = [parts[0]];
  const placeholderNames = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    placeholderNames.push(parts[i]);
    messageParts.push(`${parts[i + 1]}`);
  }
  const rawMessageParts = messageParts.map(part => part.charAt(0) === BLOCK_MARKER ? '\\' + part : part);
  return {
    text: messageString,
    messageParts: makeTemplateObject(messageParts, rawMessageParts),
    placeholderNames
  };
}
function makeParsedTranslation(messageParts, placeholderNames = []) {
  let messageString = messageParts[0];
  for (let i = 0; i < placeholderNames.length; i++) {
    messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
  }
  return {
    text: messageString,
    messageParts: makeTemplateObject(messageParts, messageParts),
    placeholderNames
  };
}
function makeTemplateObject(cooked, raw) {
  Object.defineProperty(cooked, 'raw', {
    value: raw
  });
  return cooked;
}
function describeMessage(message) {
  const meaningString = message.meaning && ` - "${message.meaning}"`;
  const legacy = message.legacyIds && message.legacyIds.length > 0 ? ` [${message.legacyIds.map(l => `"${l}"`).join(', ')}]` : '';
  return `"${message.id}"${legacy} ("${message.text}"${meaningString})`;
}

function loadTranslations(translations) {
  if (!$localize.translate) {
    $localize.translate = translate;
  }
  if (!$localize.TRANSLATIONS) {
    $localize.TRANSLATIONS = {};
  }
  Object.keys(translations).forEach(key => {
    $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
  });
}
function clearTranslations() {
  $localize.translate = undefined;
  $localize.TRANSLATIONS = {};
}
function translate(messageParts, substitutions) {
  try {
    return translate$1($localize.TRANSLATIONS, messageParts, substitutions);
  } catch (e) {
    console.warn(e.message);
    return [messageParts, substitutions];
  }
}

export { clearTranslations, loadTranslations, MissingTranslationError as ɵMissingTranslationError, isMissingTranslationError as ɵisMissingTranslationError, makeParsedTranslation as ɵmakeParsedTranslation, makeTemplateObject as ɵmakeTemplateObject, parseMessage as ɵparseMessage, parseTranslation as ɵparseTranslation, translate$1 as ɵtranslate };
//# sourceMappingURL=localize.mjs.map
