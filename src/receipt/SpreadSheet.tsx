import React from "react";

import Table from "../common/SpreadTable";

const SpreadSheetVisualizer = (props) => {
  const onDoubleClick = (e) => {
    const ref = e.target.parentElement.firstChild.innerHTML;
    props.addItem(ref);
  };

  return (
    <div>
      <Table
        maxHeight="250px"
        rows={props.sheet}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
};

export default SpreadSheetVisualizer;
