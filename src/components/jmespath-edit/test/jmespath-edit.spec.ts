import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { JmespathEdit } from '../jmespath-edit';

describe('jmespath-edit', () => {
  let rootEl: HTMLJmespathEditElement;
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [JmespathEdit],
      html: '<jmespath-edit></jmespath-edit>',
    });
    rootEl = page.root as HTMLJmespathEditElement;
  });

  describe('render', () => {
    it('renders default datasource and query', () => {
      expect(rootEl).toMatchSnapshot();
    })

    it('renders default datasource and query', async () => {
      rootEl.expression = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}";
      rootEl.json = {"locations": [{"name": "Seattle", "state": "WA"},{"name": "New York", "state": "NY"},{"name": "Bellevue", "state": "WA"},{"name": "Olympia", "state": "WA"}]};
      await page.waitForChanges();

      expect((rootEl.shadowRoot.querySelector('.expression div input') as HTMLInputElement)).toMatchSnapshot()
      expect((rootEl.shadowRoot.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(`
{
  \"WashingtonCities\": \"Bellevue, Olympia, Seattle\"
}`)
    });
  });
});
