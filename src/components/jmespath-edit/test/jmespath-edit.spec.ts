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
      expect(rootEl).toEqualHtml(`<jmespath-edit>
      <mock:shadow-root>
        <section class=\"expression\" part=\"expression\">
          <h2>
            EXPRESSION
          </h2>
          <div>
            <input type=\"text\" value=\"\">
          </div>
        </section>
        <div class=\"results\" part=\"results\">
          <section class=\"input\" part=\"results-input\">
            <h2>
              SOURCE DATA
            </h2>
            <div>
              <textarea value=\"\"></textarea>
            </div>
          </section>
          <section class=\"output\" part=\"results-output\">
            <h2>
              OUTPUT
            </h2>
            <div>
              <pre></pre>
            </div>
          </section>
        </div>
      </mock:shadow-root>
    </jmespath-edit>`)
    });

    it('renders default datasource and query', async () => {
      rootEl.expression = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}";
      rootEl.json = {"locations": [{"name": "Seattle", "state": "WA"},{"name": "New York", "state": "NY"},{"name": "Bellevue", "state": "WA"},{"name": "Olympia", "state": "WA"}]};
      await page.waitForChanges();

      expect((rootEl.shadowRoot.querySelector('.expression div input') as HTMLInputElement).value).toEqualText(`locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}`)
      expect((rootEl.shadowRoot.querySelector('.results .output div pre') as HTMLPreElement)).toEqualText(`
{
  \"WashingtonCities\": \"Bellevue, Olympia, Seattle\"
}`)
    });
  });
});
