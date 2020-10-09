import { Component, ComponentInterface, State, Host, h, Prop, Watch } from '@stencil/core';

import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {query as JMESPathQuery} from '../../utils/jmespath';
import {query as JMESPathPlusQuery} from '../../utils/jmespath-plus';
import {query as MetrichorJMESPathPlusQuery} from '../../utils/metrichor/jmespath-plus';
import {query as MetrichorJMESPathQuery} from '../../utils/metrichor/jmespath';
import { JSONValue } from '@metrichor/jmespath/dist/types';

@Component({
  styleUrl: 'jmespath-edit-compare.scss',
  tag: 'jmespath-edit-compare',
})
export class JmespathEdit implements ComponentInterface {

  library$ = new BehaviorSubject<string>('');
  expression$ = new BehaviorSubject<string>('');
  source$ = new BehaviorSubject<any>(null);
  query$ = combineLatest([this.expression$, this.source$, this.library$]);

  listener!: Subscription;
  @Prop() library = '@metrichor/jmespath-plus';

  @Prop() expression = '';
  @Prop() json: JSONValue = null;

  @State() output = '';
  @State() inputError = '';

  @Watch('library')
  updateLibraryHandler(newLibrary: string) {
    if (newLibrary) {
      this.library$.next(newLibrary)
    }
  }

  @Watch('expression')
  updateExpressionHandler(newExpression: string) {
    if (newExpression) {
      this.expression$.next(newExpression)
    }
  }

  @Watch('json')
  updateSourceHandler(newSource: JSONValue) {
    if (newSource) {
      this.source$.next(newSource)
    }
  }

  runLibrarySpecificQuery = async (expression: string, source: JSONValue, library: string): Promise<JSONValue> => {
    switch (library) {
      case 'jmespath':
        return JMESPathQuery(expression, source);
      case '@metrichor/jmespath-plus':
        return MetrichorJMESPathPlusQuery(expression, source)
      case '@metrichor/jmespath':
        return MetrichorJMESPathQuery(expression, source)
      case 'jmespath-plus':
        return JMESPathPlusQuery(expression, source)
      default:
        return JMESPathQuery(expression, source);
    }
  }

  runQuery = async ([expression, source, library]: [string, JSONValue, string]) => {
    if (!expression || !source) return
    try {
      const result = await this.runLibrarySpecificQuery(expression, source, library);
      this.output = JSON.stringify(result, null, 2)
    } catch (error) {
      this.output = error.message
    }
  }

  coerceJSON = (json: JSONValue): JSONValue => {
    if (!json) return json;
    if (typeof json === 'string') {
      try {
        return JSON.parse(json)
      } catch (error) {
        return json
      }
    }
    return json;
  }

  componentWillLoad() {
    this.listener = this.query$.subscribe(this.runQuery)
    this.expression$.next(this.expression);
    this.source$.next(this.coerceJSON(this.json));
    this.library$.next(this.library);
  }

  disconnectedCallback() {
    this.listener.unsubscribe()
  }

  setSource = (e: any) => {
    const source = e.target.value;
    if (!source) return;
    try {
      this.source$.next(JSON.parse(source))
      this.inputError = '';
    } catch (error) {
      console.error(error)
      this.inputError = error.message
    }
  }

  setExpression = (e: any) => {
    const expression = e.target.value;
    if (expression) {
      this.expression$.next(expression)
    }
  }

  render() {

    const currentExpression = this.expression$.getValue();
    const currentSource = this.source$.getValue();

    return (
      <Host>
        <section class="expression">
          <h2>EXPRESSION</h2>
          <div>
            <input type="text" value={currentExpression}
            onInput={this.setExpression}
            />
          </div>
        </section>
        <div class="results">
          <section class="input">
            <h2>SOURCE DATA</h2>
            <div>
              {
                this.inputError && <div class='inputWarning'>{this.inputError}</div> || null
              }
              <textarea value={currentSource && JSON.stringify(currentSource, null, 2) || ''} onInput={this.setSource} />
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
