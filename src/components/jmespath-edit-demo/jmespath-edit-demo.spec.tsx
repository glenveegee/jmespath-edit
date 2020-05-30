import { newSpecPage } from '@stencil/core/testing';
import { JmespathEditDemo } from './jmespath-edit-demo';

describe('jmespath-edit-demo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JmespathEditDemo],
      html: `<jmespath-edit-demo></jmespath-edit-demo>`,
    });
    expect(page.root).toEqualHtml(`
    <jmespath-edit-demo>
      <div class="toolbar">
        <span class="using">
          USING LIBRARY:
          <a href="https://www.npmjs.com/package/@metrichor/jmespath-plus" target="_blank">
            @metrichor/jmespath-plus
          </a>
        </span>
        <div class="custom-select" style="width: 200px;">
          <select>
            <option value="0">
              Select JMESPath library:
            </option>
            <option selected="" value="@metrichor/jmespath-plus">
              @metrichor/jmespath-plus
            </option>
            <option value="jmespath">
              jmespath
            </option>
          </select>
        </div>
      </div>
      <jmespath-edit expression="locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}" library="@metrichor/jmespath-plus"></jmespath-edit>
    </jmespath-edit-demo>
    `);
  });
});
