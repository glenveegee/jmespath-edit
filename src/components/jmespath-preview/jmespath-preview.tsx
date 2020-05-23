import { Component, ComponentInterface, State, Host, h } from '@stencil/core';

import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {query} from '../../utils/jmespath.worker';

const DEFAULT_EXPRESSION = `locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}`
const DEFAULT_SOURCE = {
  "locations": [
    {"name": "Seattle", "state": "WA"},
    {"name": "New York", "state": "NY"},
    {"name": "Bellevue", "state": "WA"},
    {"name": "Olympia", "state": "WA"}
  ]
}

@Component({
    tag: 'jmespath-preview',
    styleUrl: 'jmespath-preview.scss',
})
export class JmespathPreview implements ComponentInterface {

  expression$ = new BehaviorSubject<string>(DEFAULT_EXPRESSION);
  source$ = new BehaviorSubject<any>(DEFAULT_SOURCE);
  query$ = combineLatest([this.expression$, this.source$]);

  listener!: Subscription;

  @State() output = '';

  runQuery = async ([expression, source]) => {
    console.info('RUN:QUERY', expression, source)
    if (!expression || !source) return
    try {
      const result = await query(expression, source);
      this.output = JSON.stringify(result, null, 2)
    } catch (error) {
      this.output = error.message
    }
  }

  componentWillLoad() {
    this.listener = this.query$.subscribe(this.runQuery)
  }

  componentDidUnload() {
    this.listener.unsubscribe()
  }

  setSource = (e) => {
    const source = e.target.value;
    if (!source) return;
    try {
      this.source$.next(JSON.parse(source))
    } catch (error) {
      console.error(error)
    }
  }

  setExpression = (e) => {
    const expression = e.target.value;
    if (expression) {
      this.expression$.next(expression)
    }
  }

  render() {
    return (
      <Host>
        <section class="expression">
          <h2>EXPRESSION</h2>
          <div>
            <input type="text" value={DEFAULT_EXPRESSION}
            onInput={this.setExpression}
            />
          </div>
        </section>
        <div class="results">
          <section class="input">
            <h2>SOURCE DATA</h2>
            <div>
              <textarea value={JSON.stringify(DEFAULT_SOURCE, null, 2)} onInput={this.setSource} />
            </div>
          </section>
          <section class="output">
            <h2>OUTPUT</h2>
            <div>
              <pre>{this.output}</pre>
            </div>
          </section>
        </div>
      </Host>
    );
  }
}
