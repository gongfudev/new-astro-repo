import { LitElement, css } from "lit";
import { html, signal } from "@lit-labs/preact-signals";

const count = signal(0);

export class SignalExample3 extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <p>The count is ${count}</p>
      <sl-button @click=${this._onClick}>Increment</sl-button>
    `;
  }

  _onClick() {
    count.value = count.value + 1;
  }
}
