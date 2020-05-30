import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { JmespathEdit } from './jmespath-edit';

describe('jmespath-edit', () => {
  // let rootInst: JmespathEdit;
  let rootEl: HTMLJmespathEditElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [JmespathEdit],
      html: '<jmespath-edit></jmespath-edit>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLJmespathEditElement;
  });

  describe('sanity', () => {
    it('builds', () => {
      expect(new JmespathEdit()).toBeTruthy();
    });
  });

  describe('render', () => {
    it('renders default datasource and query', () => {
      expect((rootEl.querySelector('.expression div input') as HTMLInputElement).value).toEqualText(`locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}`)
//       expect((rootEl.querySelector('.results .input div textarea') as HTMLTextAreaElement)).toEqualLightHtml(`<textarea value=\"{
//   &quot;locations&quot;: [
//     {
//       &quot;name&quot;: &quot;Seattle&quot;,
//       &quot;state&quot;: &quot;WA&quot;
//     },
//     {
//       &quot;name&quot;: &quot;New York&quot;,
//       &quot;state&quot;: &quot;NY&quot;
//     },
//     {
//       &quot;name&quot;: &quot;Bellevue&quot;,
//       &quot;state&quot;: &quot;WA&quot;
//     },
//     {
//       &quot;name&quot;: &quot;Olympia&quot;,
//       &quot;state&quot;: &quot;WA&quot;
//     }
//   ]
// }\"></textarea>`)
//       expect((rootEl.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(`{
//   "WashingtonCities": "Bellevue, Olympia, Seattle"
// }`)
    });
  });
});
