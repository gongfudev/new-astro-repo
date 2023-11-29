import { LitElement, html, css } from "lit";
// import {customElement, property} from 'lit';
import { watch, signal } from "@lit-labs/preact-signals";

const count = signal(0);

export class SignalExample2 extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <p>The count is ${watch(count)}</p>
      <sl-button @click=${this._onClick}>Increment</sl-button>
    `;
  }

  _onClick() {
    count.value = count.value + 1;
  }
}
