import React from "react";

import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

const LatexGenerator = ({ updateTexFile, compile }) => {
  const handleChange = (e) => {
    updateTexFile(e.target.files[0].path);
  };
  return (
    <div id="latex_container" className="form-group">
      <label>Source</label>
      <input
        onChange={handleChange}
        className="from-control"
        type="file"
        accept=".tex"
      />
      <Button
        onClick={compile}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </div>
  );
};

export default LatexGenerator;
