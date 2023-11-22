/* eslint-env browser */

import { CameraControlPosition } from "./CameraControlPosition.webcomponent.js"
export { CameraControlPosition };

if (!window.customElements.get('camera-control-position')) {
  window.customElements.define('camera-control-position', CameraControlPosition);
}
