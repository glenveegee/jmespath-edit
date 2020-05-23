import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { JmespathPreview } from './jmespath-preview';

describe('jmespath-preview', () => {
  // let rootInst: JmespathPreview;
  let rootEl: HTMLJmespathPreviewElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [JmespathPreview],
      html: '<jmespath-preview></jmespath-preview>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLJmespathPreviewElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new JmespathPreview()).toBeTruthy();
    });
  });

  describe('render', () => {
    it('renders default datasource and query', () => {
      expect((rootEl.querySelector('.expression div input') as HTMLInputElement).value).toEqualText(`locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}`)
      expect((rootEl.querySelector('.results .input div textarea') as HTMLTextAreaElement)).toEqualLightHtml(`<textarea value=\"{
  &quot;locations&quot;: [
    {
      &quot;name&quot;: &quot;Seattle&quot;,
      &quot;state&quot;: &quot;WA&quot;
    },
    {
      &quot;name&quot;: &quot;New York&quot;,
      &quot;state&quot;: &quot;NY&quot;
    },
    {
      &quot;name&quot;: &quot;Bellevue&quot;,
      &quot;state&quot;: &quot;WA&quot;
    },
    {
      &quot;name&quot;: &quot;Olympia&quot;,
      &quot;state&quot;: &quot;WA&quot;
    }
  ]
}\"></textarea>`)
      expect((rootEl.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(`{
  "WashingtonCities": "Bellevue, Olympia, Seattle"
}`)
    });
  });
});
