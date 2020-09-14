import React from "react";

import * as receipt from "../utils/Receipt";

class ReceiptContainer extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      receipt: {},
    };
  }

  // event handlers
  onAddItem = () => {};
  onUpdateItem = () => {};
  onDeleteItem = () => {};

  render() {
    return <div></div>;
  }
}

export default ReceiptContainer;
