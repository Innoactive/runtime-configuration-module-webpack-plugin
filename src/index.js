import { readFileSync } from 'fs';
import { join } from 'path';

import VirtualModulePlugin from 'virtual-module-webpack-plugin';
import validateOptions from 'schema-utils';

import schema from './options.json';
import { getDefaultValuesForConfigurationParameters } from './utils';

export default class RuntimeConfigurationModulePlugin {
  constructor(options) {
    validateOptions(schema, options, {
      name: 'Runtime Configuration Module Plugin',
    });

    this.options = options;
  }

  apply(compiler) {
    const { parameters, moduleName } = this.options;

    // convert parameterNames into an object looking like
    // eslint-disable-next-line no-irregular-whitespace
    // { KEY: process.env.KEY || "$KEY" }
    const config = getDefaultValuesForConfigurationParameters(parameters);

    // read in the major parts of the runtime configuration module
    // (helper functions that ensure no variable placeholders remain once
    // the configuration module has been imported)
    const runtimeConfigurationModuleUtilsStr = readFileSync(
      join(__dirname, 'blueprints/runtime-config.js'),
      'utf8'
    );

    const runtimeConfigurationModule = `
    // exports the removePlaceholders function used below
    ${runtimeConfigurationModuleUtilsStr}

    export default removePlaceholders(${JSON.stringify(config)});
    `;

    // use the virtual module plugin to inject the virtual, runtime configuration module
    new VirtualModulePlugin({
      moduleName,
      contents: runtimeConfigurationModule,
    }).apply(compiler);
  }
}
