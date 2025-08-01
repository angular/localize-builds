"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/localize/schematics/ng-add/index.ts
var ng_add_exports = {};
__export(ng_add_exports, {
  default: () => ng_add_default
});
module.exports = __toCommonJS(ng_add_exports);
var import_schematics = require("@angular-devkit/schematics");
var import_utility = require("@schematics/angular/utility");
var import_dependencies = require("@schematics/angular/utility/dependencies");
var import_json_file = require("@schematics/angular/utility/json-file");
var localizeType = `@angular/localize`;
var localizePolyfill = "@angular/localize/init";
var localizeTripleSlashType = `/// <reference types="@angular/localize" />`;
function addPolyfillToConfig(projectName) {
  return (0, import_utility.updateWorkspace)((workspace) => {
    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new import_schematics.SchematicsException(`Invalid project name '${projectName}'.`);
    }
    const isLocalizePolyfill = (path) => path.startsWith("@angular/localize");
    for (const target of project.targets.values()) {
      switch (target.builder) {
        case import_utility.AngularBuilder.Karma:
        case import_utility.AngularBuilder.BuildKarma:
        case import_utility.AngularBuilder.Server:
        case import_utility.AngularBuilder.Browser:
        case import_utility.AngularBuilder.BrowserEsbuild:
        case import_utility.AngularBuilder.Application:
        case import_utility.AngularBuilder.BuildApplication:
          target.options ??= {};
          const value = target.options["polyfills"];
          if (typeof value === "string") {
            if (!isLocalizePolyfill(value)) {
              target.options["polyfills"] = [value, localizePolyfill];
            }
          } else if (Array.isArray(value)) {
            if (!value.some(isLocalizePolyfill)) {
              value.push(localizePolyfill);
            }
          } else {
            target.options["polyfills"] = [localizePolyfill];
          }
          break;
      }
    }
  });
}
function addTypeScriptConfigTypes(projectName) {
  return async (host) => {
    const workspace = await (0, import_utility.readWorkspace)(host);
    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new import_schematics.SchematicsException(`Invalid project name '${projectName}'.`);
    }
    const tsConfigFiles = /* @__PURE__ */ new Set();
    for (const target of project.targets.values()) {
      switch (target.builder) {
        case import_utility.AngularBuilder.Karma:
        case import_utility.AngularBuilder.Server:
        case import_utility.AngularBuilder.BrowserEsbuild:
        case import_utility.AngularBuilder.Browser:
        case import_utility.AngularBuilder.Application:
        case import_utility.AngularBuilder.BuildApplication:
          const value = target.options?.["tsConfig"];
          if (typeof value === "string") {
            tsConfigFiles.add(value);
          }
          break;
      }
      if (target.builder === import_utility.AngularBuilder.Browser || target.builder === import_utility.AngularBuilder.BrowserEsbuild) {
        const value = target.options?.["main"];
        if (typeof value === "string") {
          addTripleSlashType(host, value);
        }
      } else if (target.builder === import_utility.AngularBuilder.Application || target.builder === import_utility.AngularBuilder.BuildApplication) {
        const value = target.options?.["browser"];
        if (typeof value === "string") {
          addTripleSlashType(host, value);
        }
      }
    }
    const typesJsonPath = ["compilerOptions", "types"];
    for (const path of tsConfigFiles) {
      if (!host.exists(path)) {
        continue;
      }
      const json = new import_json_file.JSONFile(host, path);
      const types = json.get(typesJsonPath) ?? [];
      if (!Array.isArray(types)) {
        throw new import_schematics.SchematicsException(
          `TypeScript configuration file '${path}' has an invalid 'types' property. It must be an array.`
        );
      }
      const hasLocalizeType = types.some(
        (t) => t === localizeType || t === "@angular/localize/init"
      );
      if (hasLocalizeType) {
        continue;
      }
      json.modify(typesJsonPath, [...types, localizeType]);
    }
  };
}
function addTripleSlashType(host, path) {
  const content = host.readText(path);
  if (!content.includes(localizeTripleSlashType)) {
    host.overwrite(path, localizeTripleSlashType + "\n\n" + content);
  }
}
function moveToDependencies(host) {
  if (!host.exists("package.json")) {
    return;
  }
  (0, import_dependencies.removePackageJsonDependency)(host, "@angular/localize");
  return (0, import_utility.addDependency)("@angular/localize", `~20.2.0-next.3+sha-3e6e1c1`);
}
function ng_add_default(options) {
  const projectName = options.project;
  if (!projectName) {
    throw new import_schematics.SchematicsException('Option "project" is required.');
  }
  return (0, import_schematics.chain)([
    addTypeScriptConfigTypes(projectName),
    addPolyfillToConfig(projectName),
    // If `$localize` will be used at runtime then must install `@angular/localize`
    // into `dependencies`, rather than the default of `devDependencies`.
    options.useAtRuntime ? moveToDependencies : (0, import_schematics.noop)()
  ]);
}
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 *
 * @fileoverview Schematics for `ng add @angular/localize` schematic.
 */
//# sourceMappingURL=ng_add_bundle.cjs.map
