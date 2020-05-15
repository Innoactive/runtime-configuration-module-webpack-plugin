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
      moduleName: 'another-module-name.js'
    })
  ]
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
import config from 'runtime-config'

console.log(config.MY_SERVICE_URL)
```

**bundle.js**

When building and `MY_SERVICE_URL` is set as an environment variable like

```sh
export MY_SERVICE_URL=https://example.org/api
```

```js
console.log(config.MY_SERVICE_URL)
// --> will output https://example.org/api
console.log(SECOND_PARAMETER)
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

## License

[Apache 2.0](./LICENSE)

## Acknowledgements

- [Virtual Module Webpack Plugin]

[tests]: https://dev.azure.com/webpack-contrib/runtime-configuration-module-plugin/_apis/build/status/webpack-contrib.runtime-configuration-module-plugin?branchName=master
[tests-url]: https://dev.azure.com/runtime-configuration-module-plugin/_build/latest?definitionId=2&branchName=master
[envsubst]: https://linux.die.net/man/1/envsubst
[sed]: https://www.gnu.org/software/sed/manual/sed.html
[Virtual Module Webpack Plugin]: https://github.com/rmarscher/virtual-module-webpack-plugin
