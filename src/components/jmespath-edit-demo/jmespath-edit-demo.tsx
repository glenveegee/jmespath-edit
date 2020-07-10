import { Component, Host, h, State } from '@stencil/core';

const DEFAULT_EXPRESSION = "locations[?state == 'WA'].[name, state]._fromPairs(@)"
const DEFAULT_SOURCE = {"locations": [{"name": "Seattle", "state": "WA"},{"name": "New York", "state": "NY"},{"name": "Bellevue", "state": "WA"},{"name": "Olympia", "state": "WA"}]}

const REGISTRY_URL = 'https://www.npmjs.com';

@Component({
  styleUrl: 'jmespath-edit-demo.scss',
  tag: 'jmespath-edit-demo',
})
export class JmespathEditDemo {
  @State() library = '@metrichor/jmespath-plus';
  @State() expression = DEFAULT_EXPRESSION;

  setLibrary = (e: any) => {
    const library = e.target.value;
    this.library = library
    switch (library) {
      case '@metrichor/jmespath':
      case 'jmespath':
        this.expression = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}"
        break;
      case '@metrichor/jmespath-plus':
        this.expression = DEFAULT_EXPRESSION
        break;
      case 'jmespath-plus':
        this.expression = "locations[?state == 'WA'].[name, state].{root: $, by_city: fromPairs(@)}"
        break;
      default:
        break;
    }
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
              <option value="@metrichor/jmespath">@metrichor/jmespath</option>
              <option value="jmespath-plus">jmespath-plus</option>
              <option value="jmespath">jmespath</option>
            </select>
          </div>
        </div>
        <jmespath-edit-compare
          expression={this.expression}
          json={DEFAULT_SOURCE}
          library={this.library}
        />
      </Host>
    );
  }

}
