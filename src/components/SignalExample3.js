/* eslint-env browser */

import { SignalExample3 } from "./SignalExample3.webcomponent.js";
export { SignalExample3 };

if (!window.customElements.get('signal-example3')) {
  window.customElements.define('signal-example3', SignalExample3);
}
