import { r as registerInstance, h, e as Host } from './index-83385c20.js';

const jmespathEditDemoCss = "jmespath-edit-demo .toolbar{background-color:#666;padding:0 0.5rem;display:flex;width:calc(100% - 1rem);flex:1 1 auto;justify-content:flex-end;height:4rem;align-items:center;}jmespath-edit-demo .toolbar .using{display:block;color:#eee;font-size:14;font-family:\"Courier New\", Courier, monospace;flex:1 1 auto;width:100%}jmespath-edit-demo .toolbar .using a{color:inherit;text-decoration:none;border-bottom:1px dashed #eee}jmespath-edit-demo .toolbar .custom-select{font-family:\"Courier New\", Courier, monospace;height:2rem}jmespath-edit-demo .toolbar .custom-select select{width:200px;padding:0.5rem}";

const DEFAULT_EXPRESSION = "locations[?state == 'WA'].[name, state].{root: $, by_city: _fromPairs(@), function_predicate: _map(@, as_lambda('x => x[0]'))}";
const DEFAULT_SOURCE = { "locations": [{ "name": "Seattle", "state": "WA" }, { "name": "New York", "state": "NY" }, { "name": "Bellevue", "state": "WA" }, { "name": "Olympia", "state": "WA" }] };
const REGISTRY_URL = 'https://www.npmjs.com';
const JmespathEditDemo = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.library = '@metrichor/jmespath-plus';
    this.expression = DEFAULT_EXPRESSION;
    this.setLibrary = (e) => {
      const library = e.target.value;
      this.library = library;
      switch (library) {
        case '@metrichor/jmespath':
        case 'jmespath':
          this.expression = "locations[?state == 'WA'].name | sort(@) | {WashingtonCities: join(', ', @)}";
          break;
        case '@metrichor/jmespath-plus':
          this.expression = DEFAULT_EXPRESSION;
          break;
        case 'jmespath-plus':
          this.expression = "locations[?state == 'WA'].[name, state].{root: $, by_city: fromPairs(@)}";
          break;
        default:
          break;
      }
    };
  }
  render() {
    return (h(Host, null, h("div", { class: 'toolbar' }, h("span", { class: "using" }, "USING LIBRARY: ", h("a", { href: `${REGISTRY_URL}/package/${this.library}`, target: "_blank" }, this.library)), h("div", { class: "custom-select", style: { width: '200px' } }, h("select", { onChange: this.setLibrary }, h("option", { value: "0" }, "Select JMESPath library:"), h("option", { selected: true, value: "@metrichor/jmespath-plus" }, "@metrichor/jmespath-plus"), h("option", { value: "@metrichor/jmespath" }, "@metrichor/jmespath"), h("option", { value: "jmespath-plus" }, "jmespath-plus"), h("option", { value: "jmespath" }, "jmespath")))), h("jmespath-edit-compare", { expression: this.expression, json: DEFAULT_SOURCE, library: this.library })));
  }
};
JmespathEditDemo.style = jmespathEditDemoCss;

export { JmespathEditDemo as jmespath_edit_demo };
