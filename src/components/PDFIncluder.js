import React from "react";

class PDFIncluder extends React.Component {
  render() {
    return (
      <div id="input_pdf_container" className="form-group">
        <input
          onChange={this.props.updateFile}
          className="from-control"
          type="file"
          name="pdf_files"
          multiple="multiple"
          accept=".pdf"
        />
        <p>{this.props.files.join(", ")}</p>
      </div>
    );
  }
}

export default PDFIncluder;
