import { f as consoleError, r as registerInstance, h, e as Host } from './index-83385c20.js';
import { B as BehaviorSubject, c as combineLatest, s as switchMap, o as of, d as debounce, i as interval } from './index-b0322d8c.js';

const isInstanceOf = (value, className) => {
  const C = globalThis[className];
  return C != null && value instanceof C;
};
const getTransferables = (value) => {
  if (value != null) {
  if (
    isInstanceOf(value, "ArrayBuffer") ||
    isInstanceOf(value, "MessagePort") ||
    isInstanceOf(value, "ImageBitmap") ||
    isInstanceOf(value, "OffscreenCanvas")
  ) {
    return [value];
  }
  if (typeof value === "object") {
    if (value.constructor === Object) {
    value = Object.values(value);
    }
    if (Array.isArray(value)) {
    return value.flatMap(getTransferables);
    }
    return getTransferables(value.buffer);
  }
  }
  return [];
};

let pendingIds = 0;
let callbackIds = 0;
const pending = new Map();
const callbacks = new Map();

const createWorker = (workerPath, workerName, workerMsgId) => {
  const worker = new Worker(workerPath, {name:workerName});

  worker.addEventListener('message', ({data}) => {
  if (data) {
    const workerMsg = data[0];
    const id = data[1];
    const value = data[2];

    if (workerMsg === workerMsgId) {
    const err = data[3];
    const [resolve, reject, callbackIds] = pending.get(id);
    pending.delete(id);

    if (err) {
      const errObj = (err.isError)
      ? Object.assign(new Error(err.value.message), err.value)
      : err.value;

      consoleError(errObj);
      reject(errObj);
    } else {
      if (callbackIds) {
      callbackIds.forEach(id => callbacks.delete(id));
      }
      resolve(value);
    }
    } else if (workerMsg === workerMsgId + '.cb') {
    try {
      callbacks.get(id)(...value);
    } catch (e) {
      consoleError(e);
    }
    }
  }
  });

  return worker;
};

const createWorkerProxy = (worker, workerMsgId, exportedMethod) => (
  (...args) => new Promise((resolve, reject) => {
  let pendingId = pendingIds++;
  let i = 0;
  let argLen = args.length;
  let mainData = [resolve, reject];
  pending.set(pendingId, mainData);

  for (; i < argLen; i++) {
    if (typeof args[i] === 'function') {
    const callbackId = callbackIds++;
    callbacks.set(callbackId, args[i]);
    args[i] = [workerMsgId + '.cb', callbackId];
    (mainData[2] = mainData[2] || []).push(callbackId);
    }
  }
  const postMessage = (w) => (
    w.postMessage(
    [workerMsgId, pendingId, exportedMethod, args],
    getTransferables(args)
    )
  );
  if (worker.then) {
    worker.then(postMessage);
  } else {
    postMessage(worker);
  }
  })
);

const workerPromise$3 = import('./jmespath.worker-750e29b7.js').then(m => m.worker);
const query$3 = /*@__PURE__*/createWorkerProxy(workerPromise$3, 'stencil.jmespath.worker', 'query');

const workerPromise$2 = import('./jmespath-plus.worker-98ef7132.js').then(m => m.worker);
const query$2 = /*@__PURE__*/createWorkerProxy(workerPromise$2, 'stencil.jmespath-plus.worker', 'query');

const workerPromise$1 = import('./metrichor-jmespath-plus.worker-5219f0e6.js').then(m => m.worker);
const query$1 = /*@__PURE__*/createWorkerProxy(workerPromise$1, 'stencil.metrichor-jmespath-plus.worker', 'query');

const workerPromise = import('./metrichor-jmespath.worker-54109e07.js').then(m => m.worker);
const query = /*@__PURE__*/createWorkerProxy(workerPromise, 'stencil.metrichor-jmespath.worker', 'query');

const jmespathEditCompareCss = ":host{padding:1%;width:98%;display:block}:host section{flex:1}:host section h2{font-family:sans-serif}:host section h2>span{display:block;font-size:0.8rem;color:#666}:host section h2>span button{position:absolute;right:2rem;margin-top:-1rem}:host section div *{font-family:Consolas, Monaco, Menlo, \"Courier New\", monospace;font-size:12px}:host .expression div{margin-bottom:20px;width:inherit}:host .expression div input,:host .expression div textarea{width:100%;padding:1%;box-sizing:border-box}:host .results{display:flex;flex:1 1 auto;flex-wrap:wrap;flex-direction:row}:host .results section>div{display:flex;flex:1;flex-direction:column;min-width:24rem}:host .results section>div>.messages{display:flex;flex:1;flex-direction:row;justify-content:flex-end;padding-right:1rem}:host .results section>div>.messages .inputWarning{padding:0rem 0 0.3rem 1rem;border-left:4px solid goldenrod;color:goldenrod;max-height:1rem;flex:1}:host .results section>div>.messages button{margin:0.2rem 0.5rem}:host .results section>div>.document-view{width:calc(100% - 0.5rem);max-width:calc(100% - 0.5rem);height:60vh;box-sizing:border-box}:host .results section>div>.document-view pre,:host .results section>div>.document-view textarea{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;overflow:auto;width:inherit;height:inherit;padding:0.5rem;white-space:pre-wrap}:host .output div.document-view{background-color:#eee;max-width:100%;overflow:hidden;white-space:pre-wrap;word-break:break-all}";

const PRETTY_THRESHOLD = 1024 * 1024; // > 1MB won't pretty print the source
const COMPUTE_THRESHOLD = PRETTY_THRESHOLD * 4; // > 4MB debounce expression input change for large sources
const JmespathEdit = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.library$ = new BehaviorSubject('');
    this.expression$ = new BehaviorSubject('');
    this.source$ = new BehaviorSubject('');
    this._sourceSize = 0;
    this.library = '@metrichor/jmespath-plus';
    this.expression = '';
    this.json = null;
    this.output = '';
    this.inputError = '';
    this._json = '';
    this.isQuerying = false;
    this.viewAllSource = true;
    this.viewAllResult = true;
    this.dropFileHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const dt = e.dataTransfer;
      const files = dt.files;
      this.handleFileDrop(files);
    };
    this.handleFileDrop = async (files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.inputError = "Loading file...";
        var reader = new FileReader();
        const reportProgress = (e) => {
          const { loaded, total } = e;
          this.inputError = `Loading file...${Math.round(loaded * 100 / total)}%`;
          setTimeout(() => {
            if (e.target.readyState === FileReader.LOADING) {
              reportProgress(e);
            }
          }, 100);
        };
        reader.onprogress = (e) => {
          reportProgress(e);
        };
        reader.readAsText(file);
        reader.onload = () => {
          this.setSource({
            target: {
              value: reader.result
            }
          });
        };
      }
    };
    this.runLibrarySpecificQuery = async (expression, source, library) => {
      switch (library) {
        case 'jmespath':
          return query$3(expression, source);
        case '@metrichor/jmespath-plus':
          return query$1(expression, source);
        case '@metrichor/jmespath':
          return query(expression, source);
        case 'jmespath-plus':
          return query$2(expression, source);
        default:
          return query$3(expression, source);
      }
    };
    this.runQuery = async ([expression, source, library]) => {
      if (!expression || !source)
        return;
      this.isQuerying = true;
      try {
        this.output = await this.runLibrarySpecificQuery(expression, source, library);
      }
      catch (error) {
        this.output = error.message;
      }
      this.isQuerying = false;
    };
    this.download = () => {
      var blob = new Blob([this.output], { type: 'application/json' });
      const filename = 'output.json';
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      }
      else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    };
    this.setSource = (e) => {
      const source = e.target.value;
      if (!source)
        return;
      try {
        this._sourceSize = source.length;
        if (this._sourceSize < COMPUTE_THRESHOLD) {
          JSON.parse(source);
          this.viewAllSource = true;
          this.viewAllResult = true;
        }
        else {
          this.viewAllSource = false;
          this.viewAllResult = false;
        }
        this.inputError = '';
        this.source$.next(source);
      }
      catch (error) {
        console.error(error);
        this.inputError = error.message;
      }
    };
    this.setExpression = (e) => {
      const expression = e.target.value;
      if (expression) {
        this.expression$.next(expression);
      }
    };
  }
  updateLibraryHandler(newLibrary) {
    if (newLibrary) {
      this.library$.next(newLibrary);
    }
  }
  updateExpressionHandler(newExpression) {
    if (newExpression) {
      this.expression$.next(newExpression);
    }
  }
  updateSourceHandler(newSource) {
    if (newSource) {
      this.setSource({
        target: {
          value: JSON.stringify(newSource)
        }
      });
    }
  }
  dragHandler(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  componentWillLoad() {
    this.listener = combineLatest([this.expression$, this.source$, this.library$]).pipe(switchMap((query_params) => {
      return of(query_params);
    }), debounce(() => interval(this._sourceSize > COMPUTE_THRESHOLD ? 1000 : 0))).subscribe(this.runQuery);
    this.expression$.next(this.expression);
    this.setSource({
      target: {
        value: JSON.stringify(this.json)
      }
    });
    this.library$.next(this.library);
  }
  componentDidLoad() {
    this.sourceEl.addEventListener("dragenter", this.dragHandler, false);
    this.sourceEl.addEventListener("dragover", this.dragHandler, false);
    this.sourceEl.addEventListener("drop", this.dropFileHandler, false);
  }
  disconnectedCallback() {
    this.listener.unsubscribe();
  }
  render() {
    const currentExpression = this.expression$.getValue();
    const currentSource = this.source$.getValue();
    const truncateSource = this._sourceSize > PRETTY_THRESHOLD;
    const truncateResult = this.output.length > PRETTY_THRESHOLD;
    const parsedSource = truncateSource ? currentSource : JSON.stringify(JSON.parse(currentSource), null, 2);
    const truncatedSource = this.viewAllSource ? parsedSource : `${parsedSource.slice(0, PRETTY_THRESHOLD)}`;
    const truncatedResult = this.viewAllResult ? this.output : `${this.output.slice(0, PRETTY_THRESHOLD)}`;
    return (h(Host, null, h("section", { class: "expression" }, h("h2", null, "EXPRESSION"), h("div", null, h("textarea", { value: currentExpression, onInput: this.setExpression }))), h("div", { class: "results" }, h("section", { class: "input" }, h("h2", null, "SOURCE DATA", h("span", null, "Drag files into text area to upload")), h("div", null, h("div", { class: "messages" }, this.inputError && h("span", { class: 'inputWarning' }, this.inputError) || null, truncateSource && h("span", { class: 'inputWarning' }, "The source is HUGE - truncated to 1 Mbytes") || null, !this.viewAllSource ? h("button", { onClick: () => this.viewAllSource = true }, "View all") : null), h("div", { class: "document-view" }, h("textarea", { ref: init => this.sourceEl = init, value: truncatedSource !== null && truncatedSource !== void 0 ? truncatedSource : '', onInput: this.setSource })))), h("section", { class: "output" }, h("h2", null, "OUTPUT", h("span", null, this.output !== "null" ? h("button", { onClick: this.download }, "Download") : null)), h("div", null, h("div", { class: "messages" }, truncateResult && h("span", { class: 'inputWarning' }, "The output is HUGE - truncated to 1 Mbytes") || null, !this.viewAllResult && truncateResult ? h("button", { onClick: () => this.viewAllResult = true }, "View all") : null), h("div", { class: "document-view" }, this.isQuerying ? h("span", null, "Searching...") : h("pre", null, truncatedResult)))))));
  }
  static get watchers() { return {
    "library": ["updateLibraryHandler"],
    "expression": ["updateExpressionHandler"],
    "json": ["updateSourceHandler"]
  }; }
};
JmespathEdit.style = jmespathEditCompareCss;

export { JmespathEdit as J, createWorker as c };
