import { PrerenderConfig } from '@stencil/core';

export const config: PrerenderConfig = {
  hydrateOptions(url) {
    return {
      prettyHtml: true,
      url: "https://github.com/glenveegee/jmespath-edit",
      title: "JMESPath expression editor",
      maxHydrateCount: 0,
    };
  }
};
