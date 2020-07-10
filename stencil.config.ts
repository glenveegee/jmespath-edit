import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'jmespath-edit',
  taskQueue: 'async',
  bundles: [
    { components: ['jmespath-edit'] },
    { components: ['jmespath-edit-demo', 'jmespath-edit-compare'] },
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      baseUrl: 'https://glenveegee.github.io/jmespath-edit/',
      prerenderConfig: './prerender.config.ts',
    }
  ],
  plugins: [
    sass()
  ]
};
