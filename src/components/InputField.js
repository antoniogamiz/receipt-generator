import React from "react";

class InputField extends React.Component {
  render() {
    return (
      <div class="form-group">
        <label>{this.props.title}</label>
        <input class="form-control" placeholder={this.props.title} />
      </div>
    );
  }
}

export default InputField;
