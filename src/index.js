import { readFileSync } from 'fs';
import { join } from 'path';

import VirtualModulePlugin from 'virtual-module-webpack-plugin';
import validateOptions from 'schema-utils';

import schema from './options.json';

/**
 * Given a parameter's name, returns either the value of an environment variable
 * with the same name or a string placeholder with the parameter's name
 * @param {string} parameterName the name of the parameter
 */
export const getDefaultValueForParameter = (parameterName) =>
  parameterName in process.env
    ? process.env[parameterName]
    : `\${${parameterName}}`;

/**
 * Iterates over the given Array of Configuration Parameter (names) and returns a dictionary
 * containing a key for each configuration parameter with the actual value of an environment
 * variable (if set) or a placeholder value of the form "${VARNAME}" alternatively
 * @param {Array} configurationParameters
 */
const getDefaultValuesForConfigurationParameters = (
  configurationParameters = []
) => {
  return Object.fromEntries(
    new Map(
      // map each configuration parameter to an array with:
      // first element being the parameter itself
      // second element being the value of an environment variable with the
      // parameter's name or a placeholder with the parameter's name
      configurationParameters.map((parameter) => [parameter, ,])
    )
  );
};

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
      join(__dirname, 'utils.js'),
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
