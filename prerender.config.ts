import { PrerenderConfig } from '@stencil/core';

export const config: PrerenderConfig = {
  hydrateOptions(url) {
    return {
      prettyHtml: true,
      url: "https://github.com/glenveegee/jmespath-tester",
      title: "JMESPath expression tester",
      maxHydrateCount: 0,
    };
  }
};
