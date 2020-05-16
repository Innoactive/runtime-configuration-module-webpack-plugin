module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: '10.13.0' }, useBuiltIns: 'usage', corejs: 3 },
    ],
  ],
  plugins: ['add-module-exports'],
  env: {
    production: {
      // do not transpile the utils as they will be injected as a virtual module and are subject to subsequent transpilation steps
      // of the webpack pipeline that calls this plugin
      ignore: ['src/blueprints/*.js'],
    },
  },
};
