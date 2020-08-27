import React from "react";

import Footer from "./components/Footer";
import Title from "./components/Title";
import ReceiptPage from "./components/ReceiptPage";
import XLSX from "./utils/xlsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xlsx: new XLSX(),
    };
  }

  componentDidMount() {
    this.state.xlsx.load().then(() => this.setState({}));
  }
  render() {
    if (this.state.xlsx) {
      return (
        <div className="window">
          <Title />
          <ReceiptPage xlsx={this.state.xlsx} />
          <Footer />
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

export default App;
