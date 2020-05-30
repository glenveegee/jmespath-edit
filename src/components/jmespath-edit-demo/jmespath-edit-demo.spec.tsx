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
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </jmespath-edit-demo>
    `);
  });
});
