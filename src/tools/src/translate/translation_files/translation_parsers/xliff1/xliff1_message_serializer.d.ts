/// <amd-module name="@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1/xliff1_message_serializer" />
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, Expansion, ExpansionCase, Node, Text } from '@angular/compiler';
import { MessageRenderer } from '../../../message_renderers/message_renderer';
import { BaseVisitor } from '../base_visitor';
export declare class Xliff1MessageSerializer<T> extends BaseVisitor {
    private renderer;
    constructor(renderer: MessageRenderer<T>);
    serialize(nodes: Node[]): T;
    visitElement(element: Element): void;
    visitText(text: Text): void;
    visitExpansion(expansion: Expansion): void;
    visitExpansionCase(expansionCase: ExpansionCase): void;
    visitPlaceholder(name: string, body: string | undefined): void;
}
