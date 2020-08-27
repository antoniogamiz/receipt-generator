import React from "react";

class NavBar extends React.Component {
  render() {
    return (
      <div className="pane pane-sm sidebar">
        <nav className="nav-group" id="navbar">
          {this.props.names.map((name, i) => (
            <span key={i} className="nav-group-item" id="navbar_sheet_element">
              <span className="icon icon-database"></span>
              {name}
            </span>
          ))}
        </nav>
      </div>
    );
  }
}

export default NavBar;
