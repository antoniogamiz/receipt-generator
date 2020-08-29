import React from "react";

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
      <button onClick={compile} className="btn btn-positive">
        Generate PDF!
      </button>
    </div>
  );
};

export default LatexGenerator;
