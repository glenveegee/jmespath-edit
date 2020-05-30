import { Component, Host, h, State } from '@stencil/core';

const DEFAULT_EXPRESSION = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}"
const DEFAULT_SOURCE = {"locations": [{"name": "Seattle", "state": "WA"},{"name": "New York", "state": "NY"},{"name": "Bellevue", "state": "WA"},{"name": "Olympia", "state": "WA"}]}

const REGISTRY_URL = 'https://www.npmjs.com';

@Component({
  styleUrl: 'jmespath-edit-demo.scss',
  tag: 'jmespath-edit-demo',
})
export class JmespathEditDemo {
  @State() library = '@metrichor/jmespath-plus';

  setLibrary = (e: any) => {
    this.library = e.target.value
  }

  render() {
    return (
      <Host>
        <div class='toolbar'>
          <span class="using">USING LIBRARY: <a href={`${REGISTRY_URL}/package/${this.library}`} target="_blank">{this.library}</a></span>
          <div class="custom-select" style={{width: '200px'}}>
            <select onChange={this.setLibrary}>
              <option value="0">Select JMESPath library:</option>
              <option selected value="@metrichor/jmespath-plus">@metrichor/jmespath-plus</option>
              <option value="jmespath">jmespath</option>
            </select>
          </div>
        </div>
        <jmespath-edit
          expression={DEFAULT_EXPRESSION}
          json={DEFAULT_SOURCE}
          library={this.library}
        />
      </Host>
    );
  }

}
