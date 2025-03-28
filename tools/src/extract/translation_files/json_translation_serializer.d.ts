/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ɵParsedMessage } from '../../../../index';
import { TranslationSerializer } from './translation_serializer';
/**
 * This is a semi-public bespoke serialization format that is used for testing and sometimes as a
 * format for storing translations that will be inlined at runtime.
 *
 * @see SimpleJsonTranslationParser
 */
export declare class SimpleJsonTranslationSerializer implements TranslationSerializer {
    private sourceLocale;
    constructor(sourceLocale: string);
    serialize(messages: ɵParsedMessage[]): string;
}
