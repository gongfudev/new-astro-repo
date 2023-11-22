/* eslint-env browser */

import { SceneView } from "./SceneView.webcomponent.js"
export { SceneView };

if (!window.customElements.get('scene-view')) {
  window.customElements.define('scene-view', SceneView);
}
