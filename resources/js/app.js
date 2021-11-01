import React from "react";
import { render } from "react-dom";
import { App } from "@inertiajs/inertia-react";
import { RecoilRoot } from "recoil";
import { InertiaProgress } from '@inertiajs/progress';

const el = document.getElementById("app");

InertiaProgress.init({
  delay: 50,
  color: '#047857',
  includeCSS: true,
  showSpinner: false,
});

render(
  <RecoilRoot>
    <App
      initialPage={JSON.parse(el?.dataset?.page)}
      resolveComponent={(name) => require(`./${name}`).default}
    />
  </RecoilRoot>,
  el
);
