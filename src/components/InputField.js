import React from "react";

class InputField extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label>{this.props.title}</label>
        <input
          className="form-control"
          onChange={this.props.update}
          placeholder={this.props.title}
        />
      </div>
    );
  }
}

export default InputField;
