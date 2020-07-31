import { Component, ComponentInterface, State, Host, h, Prop, Watch } from '@stencil/core';

import {BehaviorSubject, combineLatest, Subscription, from, of} from 'rxjs';
import { filter, switchMap, catchError, tap } from 'rxjs/operators';
import { query } from '../../utils/metrichor/jmespath-plus';
import { JSONValue } from '@metrichor/jmespath/dist/types';

@Component({
  styleUrl: 'jmespath-edit.scss',
  tag: 'jmespath-edit',
  shadow: true,
})
export class JmespathEdit implements ComponentInterface {

  expression$ = new BehaviorSubject<string>('');
  source$ = new BehaviorSubject<JSONValue>(null);
  query$ = combineLatest([this.expression$, this.source$]).pipe(
    filter(([expression, source]) => (!!expression || !!source)),
    switchMap(([expression, source]) => from(query(expression, source)).pipe(catchError(error => of<string>(error.message)))),
    tap((result) => {
      this.output = JSON.stringify(result, null, 2)
    }),
  );

  listener!: Subscription;

  @Prop() expression = '';
  @Prop() json: JSONValue = null;

  @State() output = '';
  @State() inputError = '';

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
    this.listener = this.query$.subscribe()
    this.expression$.next(this.expression);
    this.source$.next(this.coerceJSON(this.json));
  }

  componentDidUnload() {
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
    expression && this.expression$.next(expression)
  }

  render() {

    const currentExpression = this.expression$.getValue();
    const currentSource = this.source$.getValue();

    return (
      <Host>
        <section class="expression" part="expression">
          <h2>EXPRESSION</h2>
          <div>
            <input type="text" value={currentExpression}
            onInput={this.setExpression}
            />
          </div>
        </section>
        <div class="results" part="results">
          <section class="input" part="results-input">
            <h2>SOURCE DATA</h2>
            <div>
              {
                this.inputError && <div class='inputWarning'>{this.inputError}</div> || null
              }
              <textarea value={currentSource && JSON.stringify(currentSource, null, 2) || ''} onInput={this.setSource} />
            </div>
          </section>
          <section class="output" part="results-output">
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
