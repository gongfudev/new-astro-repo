/* eslint-env browser */

import { SceneView1 } from "./SceneView1.webcomponent.js";
export { SceneView1 };

if (!window.customElements.get("scene-view1")) {
  window.customElements.define("scene-view1", SceneView1);
}
