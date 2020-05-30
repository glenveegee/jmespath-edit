# Using jmespath-edit in your project

Since jmespath-edit (`<jmespath-edit />` web component) is nothing more than a Stencil component you can get all the information about how to integrate it into your project [here](https://stenciljs.com/docs/overview) where framework integrations are discussed. Otherwise continue reading to see specific worked examples.


## Installation

Install from NPM (https://www.npmjs.com)

```sh
npm i jmespath-edit
```

---

## Framework integrations

### React

With an application built using the `create-react-app` script the easiest way to include the component library is to call `defineCustomElements(window)` from the `index.js` file.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// jmespath-edit is the name of our made up Web Component that we have
// published to npm:
import { defineCustomElements } from 'jmespath-edit/loader';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
defineCustomElements(window);
```

This will create a custom tag in scope of the React app and so can be used like a normal tag in the JSX

```javascript
import React from 'react';

export default () => <jmespath-edit />;
```

---

### Stencil

Using jmespath-edit in other stencil components is as easy as

#### loading the page config

```javascript
import 'jmespath-edit'
```

and then in the render function you can use it as normal

```javascript

render() {
  return (
    <div>
      <jmespath-edit />
    </div>
  )
}

```

---

### Javascript

#### loading the component from `unpkg`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://unpkg.com/jmespath-edit/dist/jmespath-edit/jmespath-edit.js"></script>
</head>
<body>
  <jmespath-edit></jmespath-edit>
</body>
</html>
```

---
