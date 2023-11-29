import { LitElement, html, css } from "lit";
// import {customElement, property} from 'lit';
import { SignalWatcher, signal } from "@lit-labs/preact-signals";

const count = signal(0);

export class SignalExample1 extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <p>The count is ${count.value}</p>
      <sl-button @click=${this._onClick}>Increment</sl-button>
    `;
  }

  _onClick() {
    count.value = count.value + 1;
  }
}
