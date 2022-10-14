/*global chrome*/

import React from "react";
import ReactDOM from "react-dom";
import "@webcomponents/custom-elements";
import ContentScript from "./ContentScript";


class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    mountPoint.id = "reactExtensionPoint";
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    // const { shadowRoot } = this;

    // const style1Tag = document.createElement('style');
    // style1Tag.innerHTML = imageEditorStyle;
    // shadowRoot.appendChild(style1Tag);

    // const style2Tag = document.createElement('style');
    // style2Tag.innerHTML = colorPickerStyle;
    // shadowRoot.appendChild(style2Tag);
    // shadowRoot.appendChild(mountPoint)

    const root = ReactDOM.createRoot(mountPoint);
    root.render(<ContentScript />)
  }
}

const initWebComponent = function () {
  customElements.define("app-portal-snapper", ReactExtensionContainer);
  const app = document.createElement("app-portal-snapper");
  document.documentElement.appendChild(app);
};

initWebComponent();

