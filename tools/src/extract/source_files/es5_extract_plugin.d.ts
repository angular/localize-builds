/// <reference types="@angular/compiler-cli/private/babel" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedMessage } from '@angular/localize';
import { PluginObj } from '@babel/core';
export declare function makeEs5ExtractPlugin(fs: PathManipulation, messages: ɵParsedMessage[], localizeName?: string): PluginObj;
