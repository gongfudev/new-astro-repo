/* eslint-env browser */
import { LitElement, html, css } from 'lit-element';
import { watch } from '@lit-labs/preact-signals';

const ORIGIN_COORD = Object.freeze([0, 0, 0]);
const LAT_MINMAX = Object.freeze([-90, 90]);
const LNG_MINMAX = Object.freeze([-180, 180]);
const ALT_MINMAX = Object.freeze([-1000, 1000]);

export function origin_coord() {
  return [...ORIGIN_COORD];
}

function normalizeCoord(coord) {
  if (Array.isArray(coord) && coord.length === 3) { return coord; }
  return origin_coord();
}

function isSameCoord(coord1, coord2) {
  return coord1?.toString() === coord2?.toString();
}

function clamp(val, [min, max]) {
  if (Number.isNaN(val)) return 0;
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function parseLat(val) {
  return clamp(parseFloat(val), LAT_MINMAX);
}

function parseLng(val) {
  return clamp(parseFloat(val), LNG_MINMAX);
}

function parseAlt(val) {
  return clamp(parseFloat(val), ALT_MINMAX);
}

export class CameraControlPosition extends LitElement {
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
      p.coord {
        display: inline-block;
        background-color: white;
        padding: 1rem;
      }
      p.coord code {
        font-weight: bold;
      }
      p.coord sub {
        color: lightgray;
      }
    `;
  }

  static properties = {
    /**
     * Geodetic coordinate of a position, as a triple of latitude,
     * longitude and ellipsoïdal elevation, in degrees and meters.
     *
     * North latitude is positive, south latitude is negative;
     * east longitude is positive, west longitude is negative.
     *
     * @type {Array}
     */
    coord: {
      type: Array,
      hasChanged: (value, oldValue) => !isSameCoord(value, oldValue),
    },

    /**
     * [Spatial reference system]{@link https://en.wikipedia.org/wiki/Spatial_reference_system}.
     * Currently fixed to WGS84; for future use.
     *
     * @type {number}
     */
    srs: { type: String, attribute: false },
  };

  constructor() {
    super();

    // Public observed properties, reflected from attribute values
    this._coord = origin_coord();
    this.srs = "WGS84";
  }

  updated(changedProperties) {
    if(changedProperties.has("coord") ) {
      this._onChangeCoord();
    }
  }

  set signal(signal) {
    this.#signal = signal;
  }

  set coord(val) {
    const [lat, lng, alt] = normalizeCoord(val);
    const coord = [parseLat(lat), parseLng(lng), parseAlt(alt)];
    const oldValue = this._coord;
    this._coord = coord;
    this.requestUpdate("coord", oldValue);
  }

  get coord() {
    return this._coord;
  }

  set lat(val) {
    // eslint-disable-next-line no-unused-vars
    const [_, lng, alt] = this.coord;
    this.coord = [val, lng, alt];
  }

  get lat() {
    return this.coord[0];
  }

  set lng(val) {
    // eslint-disable-next-line no-unused-vars
    const [lat, _, alt] = this.coord;
    this.coord = [lat, val, alt];
  }

  get lng() {
    return this.coord[1];
  }

  set alt(val) {
    // eslint-disable-next-line no-unused-vars
    const [lat, lng, _] = this.coord;
    this.coord = [lat, lng, val];
  }

  get alt() {
    return this.coord[2];
  }

  render() {
    return html`
      <h1>Position</h1>
      <slot></slot>
      <p>Signal: ${watch(this.#signal)}</p>
      ${this.renderCoord(this.coord, this.srs)}<br />
      ${this.renderSlider("lat", "Latitude", this.lat, LAT_MINMAX, this._onChangeLat)}<br />
      ${this.renderSlider("lng", "Longitude", this.lng, LNG_MINMAX, this._onChangeLng)}<br />
      ${this.renderSlider("alt", "Altitude", this.alt, ALT_MINMAX, this._onChangeAlt)}
    `;
  }

  renderCoord(coord, srs) {
    const [lat, lng, alt] = coord;
    return html`<p class="coord">
      Coordinates: [ <code>${lat}°</code>, <code>${lng}°</code>,
      <code>${alt}m</code> ] <sub>${srs}</sub>
    </p>`;
  }

  renderSlider(name, label, val, minmax, onChangeFn) {
    const [min, max] = minmax || [0, 1];
    return html`
      <input type="range"
        id="${name}" name="${name}"
        min="${min}" max="${max}"
        .value="${val}"
        @input=${onChangeFn} />
      <label for="${name}">${label}</label>
    `;
  }

  _onChangeCoord() {
    if (this.#signal) {
      this.#signal.value = this.coord;
    };
    this.dispatchEvent(
      new CustomEvent("coord-changed", { detail: this.coord })
    );
  }

  _onChangeLat(e) {
    this.lat = e.target.valueAsNumber;
  }

  _onChangeLng(e) {
    this.lng = e.target.valueAsNumber;
  }

  _onChangeAlt(e) {
    this.alt = e.target.valueAsNumber;
  }
}
