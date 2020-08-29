import React from "react";

const PDFIncluder = ({ files, onUpdate }) => {
  const handleChange = (e) => {
    let paths = Array.from(e.target.files).map((f) => f.path);
    onUpdate(paths);
  };
  files = files.map((f) => f.replace(/^.*[\\/]/, ""));
  return (
    <div id="input_pdf_container" className="form-group">
      <input
        onChange={handleChange}
        className="from-control"
        type="file"
        name="pdf_files"
        multiple="multiple"
        accept=".pdf"
      />
      <p>{files.join(", ")}</p>
    </div>
  );
};

export default PDFIncluder;
