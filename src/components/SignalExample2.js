/* eslint-env browser */

import { SignalExample2 } from "./SignalExample2.webcomponent.js";
export { SignalExample2 };

if (!window.customElements.get("signal-example2")) {
  window.customElements.define("signal-example2", SignalExample2);
}
