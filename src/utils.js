
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
export const getDefaultValuesForConfigurationParameters = (
  configurationParameters = []
) => {
  return Object.fromEntries(
    new Map(
      // map each configuration parameter to an array with:
      // first element being the parameter itself
      // second element being the value of an environment variable with the
      // parameter's name or a placeholder with the parameter's name
      configurationParameters.map((parameter) => [
        parameter,
        getDefaultValueForParameter(parameter),
      ])
    )
  );
};
