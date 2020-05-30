import { Component, ComponentInterface, State, Host, h, Prop, Watch } from '@stencil/core';

import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {query as JMESPathQuery} from '../../utils/jmespath';
import {query as JMESPathPlusQuery} from '../../utils/jmespath-plus';
import { JSONValue } from '@metrichor/jmespath/dist/types/typings';

@Component({
  styleUrl: 'jmespath-edit.scss',
  tag: 'jmespath-edit',
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
  updateLibraryHandler(newLibrary) {
    if (newLibrary) {
      this.library$.next(newLibrary)
    }
  }

  @Watch('expression')
  updateExpressionHandler(newExpression) {
    if (newExpression) {
      this.expression$.next(newExpression)
    }
  }

  @Watch('json')
  updateSourceHandler(newSource) {
    if (newSource) {
      this.source$.next(newSource)
    }
  }

  runQuery = async ([expression, source, library]) => {
    if (!expression || !source) return
    try {
      const result = library === 'jmespath' ? await JMESPathQuery(expression, source) : await JMESPathPlusQuery(expression, source);
      this.output = JSON.stringify(result, null, 2)
    } catch (error) {
      this.output = error.message
    }
  }

  coerceJSON = (json): JSONValue => {
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

  componentDidUnload() {
    this.listener.unsubscribe()
  }

  setSource = (e) => {
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

  setExpression = (e) => {
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
