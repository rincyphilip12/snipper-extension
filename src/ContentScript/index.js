import React from "react";
import ReactDOM from "react-dom";
 import "@webcomponents/custom-elements";
import ContentScript from "./ContentScript";
class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    mountPoint.id = "reactExtensionPoint";

    this.attachShadow({ mode: "open" }).appendChild(
      mountPoint
    );

    const root = ReactDOM.createRoot(mountPoint);
    root.render(<ContentScript/>)
  }
}

const initWebComponent = function () {
  customElements.define("app-portal-snapper", ReactExtensionContainer);
  const app = document.createElement("app-portal-snapper");
  document.documentElement.appendChild(app);
};

initWebComponent();

