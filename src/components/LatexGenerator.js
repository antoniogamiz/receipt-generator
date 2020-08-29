import React from "react";

class LatexGenerator extends React.Component {
  render() {
    return (
      <div id="latex_container" className="form-group">
        <label>Source</label>
        <input
          onChange={this.props.updateTexFile}
          lassName="from-control"
          type="file"
          accept=".tex"
        />
        <label>Destination</label>
        <input className="from-control" type="file" multiple="multiple" />
        <button class="btn btn-positive">Generate PDF!</button>
      </div>
    );
  }
}

export default LatexGenerator;
