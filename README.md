# Runtime Configuration (Module) Webpack Plugin

A webpack plugin injecting a runtime configuration module based on provided configuration parameters.

Can be used to ensure that a built app contains placeholder variables in
the built bundle which can be changed prior to runtime to allow for multi-environment configurations where the configuration parameters are
not yet known at build time.

## Getting Started

To begin, you'll need to install `runtime-configuration-module-webpack-plugin`:

```console
npm install runtime-configuration-module-webpack-plugin --save-dev
```

Also, make sure that you're using babel and are having a polyfill for `Object.fromEntries` and `Object.entries`, e.g. by using
[`@babel/preset-env` with the `useBuiltIns` option][babel-polyfill]:

**.babelrc.json**

```
{
  "presets": [
  [
    "@babel/preset-env",
    {
        "useBuiltIns": "usage",
        "corejs": 3
    }
  ]
]
```

Then add the plugin to your `webpack` config. For example:

**index.js**

```js
import config from 'runtime-config';
```

**webpack.config.js**

```js
module.exports = {
  plugins: [new RuntimeConfigurationModulePlugin(options)],
};
```

And run `webpack` via your preferred method.

## Options

### `moduleName`

Type: `string`
Default: `runtime-config.js`

The name of the module that will export the configuration parameters.

This name **must** end with `.js`.

### `parameters`

Type: `array`
Default: `[]`

List of configuration parameters that should be supported. By default,
values for these parameters are searched for as environment variables.

**webpack.config.js**

Configure the plugin by defining all parameters you wish to have configurable at runtime.

```js
module.exports = {
  plugins: [
    new RuntimeConfigurationModulePlugin({
      parameters: ['MY_SERVICE_URL', 'SECOND_PARAMETER'],
      moduleName: 'another-module-name.js',
    }),
  ],
};
```

## Examples

**webpack.config.js**

```js
import RuntimeConfigurationModulePlugin from 'runtime-configuration-module-webpack-plugin';

module.exports = {
  plugins: [
    new `RuntimeConfigurationModulePlugin`Plugin({
      parameters: ['MY_SERVICE_URL', 'SECOND_PARAMETER'],
    })
  ]
};
```

**index.js**

```js
import config from 'runtime-config';

console.log(config.MY_SERVICE_URL);
```

**bundle.js**

When building and `MY_SERVICE_URL` is set as an environment variable like

```sh
export MY_SERVICE_URL=https://example.org/api
```

```js
console.log(config.MY_SERVICE_URL);
// --> will output https://example.org/api
console.log(SECOND_PARAMETER);
// --> will be undefined as not set as an environment variable
```

`bundle.js` will contain a placeholder for `SECOND_PARAMETER` that looks
like this `${SECOND_PARAMETER}` and can be replaced with any regex tool
or [envsubst] or simple plain [sed] like the following:

```sh
export SECOND_PARAMETER="Hello World!"

# use indirect parameter expansion (providing variable name as string and still expanding it)
# use ; as delimiter for sed expression as / maybe contained in urls
sed -i -e "s;\${SECOND_PARAMETER};${!SECOND_PARAMETER};g" bundle.js

# --> will set config.SECOND_PARAMETER to "Hello World!"
```

## Usage in tests

Since the configuration module injected by this plugin will be virtual, it will not
actually exist on disk and will thus not work in code that is not running through
webpack, like e.g. tests. This is why you will need to mock the runtime configuration
module in your test as virtual.

E.g. when using [jest], mocking a virtual module can be done using the [third parameter
of the `jest.mock`][jest.mock] function, like:

```js
jest.mock(
  '../runtime-config',
  () => ({
    MY_SERVICE_URL: 'http://mocked.org',
    SECOND_PARAMETER: 'some test value',
  }),
  { virtual: true } // <-- this is the relevant third parameter
);
```

## License

[Apache 2.0](./LICENSE)

## Acknowledgements

- [Virtual Module Webpack Plugin]

[tests]: https://dev.azure.com/webpack-contrib/runtime-configuration-module-plugin/_apis/build/status/webpack-contrib.runtime-configuration-module-plugin?branchName=master
[tests-url]: https://dev.azure.com/runtime-configuration-module-plugin/_build/latest?definitionId=2&branchName=master
[envsubst]: https://linux.die.net/man/1/envsubst
[sed]: https://www.gnu.org/software/sed/manual/sed.html
[virtual module webpack plugin]: https://github.com/rmarscher/virtual-module-webpack-plugin
[babel-polyfill]: https://babeljs.io/docs/en/babel-preset-env#usebuiltins-usage
[jest.mock]: https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
