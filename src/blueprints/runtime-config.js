// regex checking for environment variable subsitutions \${VARNAME} or $VARNAME
const environmentVariablePlaceholderRegex = /^\$(\{[A-Z0-9_]+\}|[A-Z0-9_]+)$/;

/**
 * Whether or not the given string is a variable placeholder like \${VARNAME} or $VARNAME
 * @param {string} value
 */
export const isPlaceholderValue = (value) =>
  environmentVariablePlaceholderRegex.test(value);

/**
 * Sanitizes the given configuration object by traversing it recursively and making sure
 * it does not contain any placeholder values like $VARNAME or \${VARNAME}. If any
 * placeholders are found, they are replaced by \`undefined\`
 * @param {object} dict
 */
export const removePlaceholders = (dict) => {
  // Object.fromEntries constructs an objects from an array of key, value pairs
  return Object.fromEntries(
    // Object.entries decomposes a dict into an array of key, value pairs
    Object.entries(dict).map(([key, value]) => {
      // if the value is an object itself again, recurse!
      if (value && typeof value === 'object') {
        return [key, removePlaceholders(value)];
      }
      // check each value to not be a placeholder
      if (isPlaceholderValue(value)) {
        // eslint-disable-next-line no-undefined
        return [key, undefined];
      }
      return [key, value];
    })
  );
};
