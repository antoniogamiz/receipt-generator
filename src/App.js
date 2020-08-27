import React from "react";

import Footer from "./components/Footer";
import Title from "./components/Title";

import ReceiptPage from "./components/ReceiptPage";

class App extends React.Component {
  render() {
    return (
      <div class="window">
        <Title />
        <ReceiptPage />
        <Footer />
      </div>
    );
  }
}

export default App;
