/* eslint-env browser */
import { LitElement, html, css } from "lit-element";
import { watch } from "@lit-labs/preact-signals";

const DEFAULT_ANGLES = Object.freeze([0, 0, 0]);
const HPR_MINMAX = Object.freeze([-180, 180]);

export function default_angles() {
  return [...DEFAULT_ANGLES];
}

function normalizeHPR(angles) {
  if (Array.isArray(angles) && angles.length === 3) {
    return angles;
  }
  return default_angles();
}

function isSameHPR(angles1, angles2) {
  return angles1?.toString() === angles2?.toString();
}

function clamp(val, [min, max]) {
  if (Number.isNaN(val)) return 0;
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function parseHPR(val) {
  return clamp(parseFloat(val), HPR_MINMAX);
}

export class CameraControlHPR extends LitElement {
  #signal;

  static get styles() {
    return css`
      :host {
        height: 100%;
        display: block;
      }
      h1,
      p {
        margin-block-start: 0;
        margin-block-end: 0.5rem;
      }
      p.angles {
        display: inline-block;
        background-color: white;
        padding: 1rem;
      }
      p.angles code {
        font-weight: bold;
      }
    `;
  }

  static properties = {
    /**
     * Heading, pitch and roll angles, as a triple, in degrees.
     * @type {Array}
     */
    angles: {
      type: Array,
      hasChanged: (value, oldValue) => !isSameHPR(value, oldValue),
    },
  };

  constructor() {
    super();
    // Public observed properties, reflected from attribute values
    this._angles = default_angles();
  }

  updated(changedProperties) {
    if (changedProperties.has("angles")) {
      this._onChangeAngles();
    }
  }

  set signal(signal) {
    this.#signal = signal;
  }

  set angles(val) {
    const [heading, pitch, roll] = normalizeHPR(val);
    const angles = [parseHPR(heading), parseHPR(pitch), parseHPR(roll)];
    const oldValue = this._angles;
    this._angles = angles;
    this.requestUpdate("angles", oldValue);
  }

  get angles() {
    return this._angles;
  }

  set heading(val) {
    // eslint-disable-next-line no-unused-vars
    const [_, pitch, roll] = this.angles;
    this.angles = [val, pitch, roll];
  }

  get heading() {
    return this.angles[0];
  }

  set pitch(val) {
    // eslint-disable-next-line no-unused-vars
    const [heading, _, roll] = this.angles;
    this.angles = [heading, val, roll];
  }

  get pitch() {
    return this.angles[1];
  }

  set roll(val) {
    // eslint-disable-next-line no-unused-vars
    const [heading, pitch, _] = this.angles;
    this.angles = [heading, pitch, val];
  }

  get roll() {
    return this.angles[2];
  }

  render() {
    return html`
      <h1>HPR</h1>
      <slot></slot>
      <p>Signal: ${watch(this.#signal)}</p>
      ${this.renderHPR(this.angles)}<br />
      ${this.renderSlider("heading", "Heading", this.heading, HPR_MINMAX, this._onChangeHeading)}<br />
      ${this.renderSlider("pitch", "Pitch", this.pitch, HPR_MINMAX, this._onChangePitch)}<br />
      ${this.renderSlider("roll", "Roll", this.roll, HPR_MINMAX, this._onChangeRoll)}
    `;
  }

  renderHPR(position) {
    const [heading, pitch, roll] = position;
    return html`<p class="angles">
      Angles: [ <code>${heading}°</code>, <code>${pitch}°</code>, <code>${roll}°</code> ]
    </p>`;
  }

  renderSlider(name, label, val, minmax, onChangeFn) {
    const [min, max] = minmax || [0, 1];
    return html`
      <input type="range" id="${name}" name="${name}" min="${min}" max="${max}" .value="${val}" @input=${onChangeFn} />
      <label for="${name}">${label}</label>
    `;
  }

  _onChangeAngles() {
    if (this.#signal) {
      this.#signal.value = this.angles;
    }
    this.dispatchEvent(new CustomEvent("angles-changed", { detail: this.angles }));
  }

  _onChangeHeading(e) {
    this.heading = e.target.valueAsNumber;
  }

  _onChangePitch(e) {
    this.pitch = e.target.valueAsNumber;
  }

  _onChangeRoll(e) {
    this.roll = e.target.valueAsNumber;
  }
}
