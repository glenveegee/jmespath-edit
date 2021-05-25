import { Component, ComponentInterface, State, Host, h, Prop, Watch } from '@stencil/core';

import {BehaviorSubject, combineLatest, interval, of, Subscription} from 'rxjs';
import {query as JMESPathQuery} from '../../workers/jmespath.worker';
import {query as JMESPathPlusQuery} from '../../workers/jmespath-plus.worker';
import {query as MetrichorJMESPathPlusQuery} from '../../workers/metrichor-jmespath-plus.worker';
import {query as MetrichorJMESPathQuery} from '../../workers/metrichor-jmespath.worker';
import { JSONValue } from '@metrichor/jmespath-plus/dist/types';
import { debounce, switchMap } from 'rxjs/operators';


const PRETTY_THRESHOLD = 1024 * 1024; // > 1MB won't pretty print the source
const COMPUTE_THRESHOLD = PRETTY_THRESHOLD * 4; // > 4MB debounce expression input change for large sources

@Component({
  styleUrl: 'jmespath-edit-compare.scss',
  tag: 'jmespath-edit-compare',
  shadow: true,
})
export class JmespathEdit implements ComponentInterface {

  library$ = new BehaviorSubject<string>('');
  expression$ = new BehaviorSubject<string>('');
  source$ = new BehaviorSubject<any>('');

  sourceEl: HTMLTextAreaElement;

  listener!: Subscription;
  _sourceSize = 0;

  @Prop() library = '@metrichor/jmespath-plus';

  @Prop() expression = '';
  @Prop() json: JSONValue = null;

  @State() output = '';
  @State() inputError = '';
  @State() _json = '';
  @State() isQuerying = false;
  @State() viewAllSource = true;
  @State() viewAllResult = true;


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
      this.setSource({
        target: {
          value: JSON.stringify(newSource)
        }
      })
    }
  }

  dragHandler(e) {
    e.stopPropagation();
    e.preventDefault();
  }


  dropFileHandler = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    this.handleFileDrop(files);
  }


  handleFileDrop = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.inputError = "Loading file..."
      var reader = new FileReader();
      const reportProgress = (e: ProgressEvent<FileReader>) => {
        const {loaded, total} = e;
        this.inputError = `Loading file...${Math.round(loaded*100/total)}%`
        setTimeout(() => {
          if (e.target.readyState === FileReader.LOADING) {
            reportProgress(e)
          }
        }, 100)
      }
      reader.onprogress = (e) => {
        reportProgress(e)
      };
      reader.readAsText(file);
      reader.onload = () => {
        this.setSource({
          target: {
            value: reader.result
          }
        })
      };

    }
  }

  runLibrarySpecificQuery = async (expression: string, source: string, library: string): Promise<string> => {
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

  runQuery = async ([expression, source, library]: [string, string, string]) => {
    if (!expression || !source) return
    this.isQuerying = true
    try {
      this.output = await this.runLibrarySpecificQuery(expression, source, library);
    } catch (error) {
      this.output = error.message
    }
    this.isQuerying = false
  }

  componentWillLoad() {
    this.listener = combineLatest([this.expression$, this.source$, this.library$]).pipe(
      switchMap((query_params) => {
        return of(query_params)
      }),
      debounce(() => interval(this._sourceSize > COMPUTE_THRESHOLD ? 1000 : 0)),

    ).subscribe(this.runQuery)
    this.expression$.next(this.expression);
    this.setSource({
      target: {
        value: JSON.stringify(this.json)
      }
    })
    this.library$.next(this.library);
  }

  componentDidLoad() {
    this.sourceEl.addEventListener("dragenter", this.dragHandler, false);
    this.sourceEl.addEventListener("dragover", this.dragHandler, false);
    this.sourceEl.addEventListener("drop", this.dropFileHandler, false);
  }

  disconnectedCallback() {
    this.listener.unsubscribe()
  }


  download = () => {
    var blob = new Blob([this.output], {type: 'application/json'});
    const filename = 'output.json';
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

  setSource = (e: any) => {
    const source = e.target.value;
    if (!source) return;
    try {
      this._sourceSize = source.length;
      if (this._sourceSize < COMPUTE_THRESHOLD) {
        JSON.parse(source)
        this.viewAllSource = true;
        this.viewAllResult = true;
      } else {
        this.viewAllSource = false;
        this.viewAllResult = false;
      }
      this.inputError = '';
      this.source$.next(source)
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

    const truncateSource = this._sourceSize > PRETTY_THRESHOLD;
    const truncateResult = this.output.length > PRETTY_THRESHOLD;

    const parsedSource = truncateSource ? currentSource : JSON.stringify(JSON.parse(currentSource), null, 2)
    const truncatedSource = this.viewAllSource ? parsedSource : `${parsedSource.slice(0, PRETTY_THRESHOLD)}`
    const truncatedResult = this.viewAllResult ? this.output : `${this.output.slice(0, PRETTY_THRESHOLD)}`

    return (
      <Host>
        <section class="expression">
          <h2>EXPRESSION</h2>
          <div>
            <textarea value={currentExpression}
            onInput={this.setExpression}
            />
          </div>
        </section>
        <div class="results">
          <section class="input">
            <h2>SOURCE DATA<span>Drag files into text area to upload</span></h2>
            <div>
              <div class="messages">
                {
                  this.inputError && <span class='inputWarning'>{this.inputError}</span> || null
                }
                {
                  truncateSource && <span class='inputWarning'>The source is HUGE - truncated to 1 Mbytes</span> || null
                }
                {!this.viewAllSource ? <button onClick={() => this.viewAllSource = true}>View all</button> : null}
              </div>
              <div class="document-view">
                <textarea ref={init => this.sourceEl = init} value={truncatedSource ?? ''} onInput={this.setSource}/>
              </div>
            </div>
          </section>
          <section class="output">
            <h2>OUTPUT<span>{this.output !== "null" ? <button onClick={this.download}>Download</button> : null}</span></h2>
            <div>
              <div class="messages">
                {
                  truncateResult && <span class='inputWarning'>The output is HUGE - truncated to 1 Mbytes</span> || null
                }
                {!this.viewAllResult && truncateResult ? <button onClick={() => this.viewAllResult = true}>View all</button> : null}
              </div>
              <div class="document-view">
                {this.isQuerying ? <span>Searching...</span> : <pre>{truncatedResult}</pre>}
              </div>
            </div>
          </section>
        </div>
      </Host>
    );
  }
}
