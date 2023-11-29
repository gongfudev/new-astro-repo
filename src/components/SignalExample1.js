/* eslint-env browser */

import { SignalExample1 } from "./SignalExample1.webcomponent.js";
export { SignalExample1 };

if (!window.customElements.get("signal-example1")) {
  window.customElements.define("signal-example1", SignalExample1);
}
