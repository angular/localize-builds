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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// bazel-out/k8-fastbuild/bin/packages/localize/schematics/ng-add/index.mjs
var ng_add_exports = {};
__export(ng_add_exports, {
  default: () => ng_add_default
});
module.exports = __toCommonJS(ng_add_exports);
var import_schematics = require("@angular-devkit/schematics");
var import_tasks = require("@angular-devkit/schematics/tasks");
var import_dependencies = require("@schematics/angular/utility/dependencies");
var import_json_file = require("@schematics/angular/utility/json-file");
var import_workspace = require("@schematics/angular/utility/workspace");
var import_workspace_models = require("@schematics/angular/utility/workspace-models");
var localizeType = `@angular/localize`;
var localizeTripleSlashType = `/// <reference types="@angular/localize" />`;
function addTypeScriptConfigTypes(projectName) {
  return (host) => __async(this, null, function* () {
    var _a, _b, _c, _d;
    const workspace = yield (0, import_workspace.getWorkspace)(host);
    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new import_schematics.SchematicsException(`Invalid project name '${projectName}'.`);
    }
    const tsConfigFiles = /* @__PURE__ */ new Set();
    for (const target of project.targets.values()) {
      switch (target.builder) {
        case import_workspace_models.Builders.Karma:
        case import_workspace_models.Builders.Server:
        case import_workspace_models.Builders.Browser:
        case import_workspace_models.Builders.Application:
          const value = (_a = target.options) == null ? void 0 : _a["tsConfig"];
          if (typeof value === "string") {
            tsConfigFiles.add(value);
          }
          break;
      }
      if (target.builder === import_workspace_models.Builders.Browser) {
        const value = (_b = target.options) == null ? void 0 : _b["main"];
        if (typeof value === "string") {
          addTripleSlashType(host, value);
        }
      } else if (target.builder === import_workspace_models.Builders.Application) {
        const value = (_c = target.options) == null ? void 0 : _c["browser"];
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
      const types = (_d = json.get(typesJsonPath)) != null ? _d : [];
      if (!Array.isArray(types)) {
        throw new import_schematics.SchematicsException(`TypeScript configuration file '${path}' has an invalid 'types' property. It must be an array.`);
      }
      const hasLocalizeType = types.some((t) => t === localizeType || t === "@angular/localize/init");
      if (hasLocalizeType) {
        continue;
      }
      json.modify(typesJsonPath, [...types, localizeType]);
    }
  });
}
function addTripleSlashType(host, path) {
  const content = host.readText(path);
  if (!content.includes(localizeTripleSlashType)) {
    host.overwrite(path, localizeTripleSlashType + "\n\n" + content);
  }
}
function moveToDependencies(host, context) {
  if (!host.exists("package.json")) {
    return;
  }
  (0, import_dependencies.removePackageJsonDependency)(host, "@angular/localize");
  (0, import_dependencies.addPackageJsonDependency)(host, {
    name: "@angular/localize",
    type: import_dependencies.NodeDependencyType.Default,
    version: `~18.0.0-next.2+sha-22dd52f`
  });
  context.addTask(new import_tasks.NodePackageInstallTask());
}
function ng_add_default(options) {
  return () => {
    var _a;
    const projectName = (_a = options.name) != null ? _a : options.project;
    if (!projectName) {
      throw new import_schematics.SchematicsException('Option "project" is required.');
    }
    return (0, import_schematics.chain)([
      addTypeScriptConfigTypes(projectName),
      options.useAtRuntime ? moveToDependencies : (0, import_schematics.noop)()
    ]);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * @fileoverview Schematics for `ng add @angular/localize` schematic.
 */
//# sourceMappingURL=ng_add_bundle.js.map
