/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ɵParsedTranslation } from '../../../../../index';
import { MessageRenderer } from './message_renderer';
/**
 * A message renderer that outputs `ɵParsedTranslation` objects.
 */
export declare class TargetMessageRenderer implements MessageRenderer<ɵParsedTranslation> {
    private current;
    private icuDepth;
    get message(): ɵParsedTranslation;
    startRender(): void;
    endRender(): void;
    text(text: string): void;
    placeholder(name: string, body: string | undefined): void;
    startPlaceholder(name: string): void;
    closePlaceholder(name: string): void;
    startContainer(): void;
    closeContainer(): void;
    startIcu(): void;
    endIcu(): void;
    private normalizePlaceholderName;
    private renderPlaceholder;
    private storeMessagePart;
}
