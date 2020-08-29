import React from "react";

import Table from "../common/Table";

const SpreadSheetVisualizer = (props) => {
  const onDoubleClick = (e) => {
    const ref = e.target.parentElement.firstChild.innerHTML;
    props.addItem(ref);
  };
  return (
    <div className="excel_worksheet_container">
      <Table rows={props.sheet} onDoubleClick={onDoubleClick} />
    </div>
  );
};

export default SpreadSheetVisualizer;
