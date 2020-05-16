import { getDefaultValueForParameter } from '../src/index';

describe('getDefaultValueForParameter', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    // unset all environment variables for easier testing
    process.env = {};
  });

  afterEach(() => {
    // restore all environmnt variables
    process.env = ORIGINAL_ENV;
  });

  test('returns value of environment variable if set', () => {
    // Given an environment variable
    process.env.MY_PARAMETER = 'test';

    // When trying to get the default parameter for runtime configuration
    const defaultValue = getDefaultValueForParameter('MY_PARAMETER');

    // Then expect the value to be the value of the environment variable
    expect(defaultValue).toBe('test');
  });

  test("returns a placeholder w/ the parameter's name if environment variable not set", () => {
    // Given nothing
    // When trying to get the default parameter for runtime configuration
    const defaultValue = getDefaultValueForParameter('MY_PARAMETER');

    // Then expect the value to be the placeolder for this parameter
    // eslint-disable-next-line no-template-curly-in-string
    expect(defaultValue).toBe('${MY_PARAMETER}');
  });

  test('returns empty value if environment variable set to empty', () => {
    // Given an environment variable that is set to an empty string
    process.env.MY_PARAMETER = '';

    // When trying to get the default parameter for runtime configuration
    const defaultValue = getDefaultValueForParameter('MY_PARAMETER');

    // Then expect the value to be the value of the environment variable
    expect(defaultValue).toBe('');
  });

  test('returns undefined value if environment variable set to undefined', () => {
    // Given an environment variable that is set to undefined
    // eslint-disable-next-line no-undefined
    process.env.MY_PARAMETER = undefined;

    // When trying to get the default parameter for runtime configuration
    const defaultValue = getDefaultValueForParameter('MY_PARAMETER');

    // Then expect the value to be the value of the environment variable
    // eslint-disable-next-line no-undefined
    expect(defaultValue).toBe(undefined);
  });
});
