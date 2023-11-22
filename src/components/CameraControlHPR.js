/* eslint-env browser */

import { CameraControlHPR } from "./CameraControlHPR.webcomponent.js"
export { CameraControlHPR };

if (!window.customElements.get('camera-control-hpr')) {
  window.customElements.define('camera-control-hpr', CameraControlHPR);
}
