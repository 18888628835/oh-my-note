# Getting Started

if you want to render react-component in `codeSandbox`

you can use `jsx-codeSandbox` or `tsx-codeSandbox`

for example:

```tsx-codeSandbox
import React, { useState } from 'react';

export default function App() {
  const [state, setState] = useState(0);
  return (
    <div>
      <button onClick={() => setState(n => n + 1)}>click me</button>
      <div>{state}</div>
    </div>
  );
}
```

if you just want to render HTML,you can use `html-preview`

for example

```html-preview
<div class="grid-container">
  <style>
    .grid-container {
      border: 1px solid red;
      margin: 0 auto;
      text-align: center;
    }
    .grid-container {
      display: grid;
      width: 300px;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 100px 100px 100px;
      justify-content: stretch;
      gap: 2px;
    }
    .one,
    .two {
      background-color: #e91e63;
    }
    .one {
      grid-column-start: 1;
      grid-column-end: span 3;
      grid-row-start: span 2;
    }
    .two {
      grid-column-start: 2;
      grid-column-end: 3;
      grid-row-start: 3;
      grid-row-end: 4;
    }
  </style>
  <div class="one">1</div>
  <div class="two">2</div>
</div>
```

if you just want to execute javascript,you can use `js` or `javascript`.for example

```js
alert('this is a example')
```

## Deploy on Vercel

The easiest way to deploy this project is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
