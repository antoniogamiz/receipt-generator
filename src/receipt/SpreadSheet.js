import React from "react";

import Table from "../common/SpreadTable";

const SpreadSheetVisualizer = (props) => {
  const onDoubleClick = (e) => {
    const ref = e.target.parentElement.firstChild.innerHTML;
    props.addItem(ref);
  };
  return (
    <div style={{ height: "200px" }}>
      <Table rows={props.sheet} onDoubleClick={onDoubleClick} />
    </div>
  );
};

export default SpreadSheetVisualizer;
