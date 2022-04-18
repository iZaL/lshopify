import React from 'react';
import {render} from 'react-dom';
import {App} from '@inertiajs/inertia-react';
import {InertiaProgress} from '@inertiajs/progress';

const el = document.getElementById('app');

InertiaProgress.init({
  delay: 50,
  color: '#047857',
  includeCSS: true,
  showSpinner: false,
});

render(
  <App
    initialPage={JSON.parse(el?.dataset?.page)}
    resolveComponent={name => require(`./${name}`).default}
  />,
  el,
);
