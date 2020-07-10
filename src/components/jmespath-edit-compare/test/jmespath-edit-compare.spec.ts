import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { JmespathEdit } from '../jmespath-edit-compare';

describe('jmespath-edit-compare', () => {
  // let rootInst: JmespathEdit;
  let rootEl: HTMLJmespathEditElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [JmespathEdit],
      html: '<jmespath-edit-compare></jmespath-edit-compare>',
    });
    // rootInst = page.rootInstance;
    rootEl = page.root as HTMLJmespathEditElement;
  });

  describe('render', () => {
    it('renders default datasource and query', () => {
      expect((rootEl.querySelector('.expression div input') as HTMLInputElement).value).toEqualText(``)
      expect((rootEl.querySelector('.results .input div textarea') as HTMLTextAreaElement)).toEqualLightHtml(`<textarea value=\"\"></textarea>`)
      expect((rootEl.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(``)
    });

    it('renders default datasource and query', async () => {
      rootEl.expression = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}";
      rootEl.json = {"locations": [{"name": "Seattle", "state": "WA"},{"name": "New York", "state": "NY"},{"name": "Bellevue", "state": "WA"},{"name": "Olympia", "state": "WA"}]};
      await page.waitForChanges();

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
      expect((rootEl.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(`
{
  \"WashingtonCities\": \"Bellevue, Olympia, Seattle\"
}`)
    });
  });
});
